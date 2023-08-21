import asyncio
import json
import mimetypes
import os
import uuid
from typing import Dict, List, Literal, Optional, cast, Union

import aiofiles

from chainlit.client.base import (
    BaseDBClient,
    ConversationDict,
    ConversationFilter,
    ElementDict,
    MessageDict,
    PageInfo,
    PaginatedResponse,
    Pagination,
    UserDict,
)
from chainlit.config import config
from chainlit.logger import logger


class PostgresClient(BaseDBClient):
    conversation_id: Optional[str] = None
    lock: asyncio.Lock

    async def init(self):
        from chainlit.client.postgres.prisma.app.models import Project, User

        if not self.project_id:
            raise ValueError(
                'The `database` configuration is set to "postgres" in config.toml but the `id` isn\'t set (project id).'
            )

        if self.user_infos["role"] is None:
            raise ValueError(
                f"The user {self.user_infos['id']} has no role associated with the project id {self.project_id}."
            )

        logger.debug(self.user_infos)

        user = await User.prisma().find_first(where={"id": self.user_infos["id"]})
        if not user:
            await User.prisma().create(
                # data={"id": self.user_infos["id"], "name": "Unnamed User"}
                data=self.user_infos
            )

        project = await Project.prisma().find_unique(where={"id": self.project_id})
        if not project:
            print("create", self.project_id)
            await Project.prisma().create(
                data={
                    "id": self.project_id,
                    "name": "Unnamed project",
                    "authorId": self.user_infos["id"],
                }
            )

        await self.create_user(
            {
                "id": self.user_infos["id"],
                "name": "Unnamed user",
                "role": self.user_infos["role"],
            }
        )

    def __init__(self, project_id: str, user_infos: UserDict):
        self.lock = asyncio.Lock()
        self.project_id = project_id
        self.user_infos = user_infos

    # def before_write(self, variables: Dict):
    #     if "tempId" in variables:
    #         del variables["tempId"]

    async def get_conversation_id(self):
        self.conversation_id = await self.create_conversation()

        return self.conversation_id

    async def create_user(self, variables: UserDict) -> bool:
        from chainlit.client.postgres.prisma.app.models import User, UserToProject
        from chainlit.client.postgres.prisma.app.types import UserCreateInput
        from chainlit.client.postgres.prisma.app.enums import Role

        logger.info(f"create_user variables: {variables}")
        user = await User.prisma().find_unique(
            where={"id": variables["id"]},
            include={
                "UserToProject": {
                    "where": {"projectId": self.project_id, "role": cast(Role, variables["role"])}
                }
            },
        )

        if not user:
            logger.info("need to create a new user...")
            user = await User.prisma().create(data=cast(UserCreateInput, variables))
            return True
        elif user.UserToProject and user.UserToProject.count() == 0:
            await UserToProject.prisma().create(
                data={
                    "projectId": self.project_id,
                    "userId": user.id,
                    "role": user.role,
                }
            )
        return False

    async def get_project_members(self) -> List[UserDict]:
        from chainlit.client.postgres.prisma.app.models import User

        users = await User.prisma().find_many(
            where={"UserToProject": {"some": {"projectId": self.project_id}}}
        )

        return [json.loads(u.json()) for u in users]

    async def create_conversation(self) -> str:
        from chainlit.client.postgres.prisma.app.models import Conversation
        from chainlit.client.postgres.prisma.app.types import ConversationCreateInput
        async with self.lock:
            if self.conversation_id:
                return self.conversation_id

            data = {"projectId": self.project_id}
            if self.user_infos:
                data["authorId"] = self.user_infos["id"]

            res = await Conversation.prisma().create(data=cast(ConversationCreateInput, data))

            return res.id

    async def delete_conversation(self, conversation_id: str) -> bool:
        from chainlit.client.postgres.prisma.app.models import Conversation

        await Conversation.prisma().delete_many(
            where={"id": conversation_id, "projectId": self.project_id}
        )

        return True

    async def get_conversation(self, conversation_id: str) -> ConversationDict:
        from chainlit.client.postgres.prisma.app.errors import RecordNotFoundError
        from chainlit.client.postgres.prisma.app.models import Conversation

        c = await Conversation.prisma().find_unique_or_raise(
            where={"id": conversation_id}, include={"messages": True, "elements": True}
        )
        if c.projectId != self.project_id:
            raise RecordNotFoundError(
                data=conversation_id, message="No conversation with this id in the project"
            )

        for m in c.messages:
            if m.llmSettings:
                m.llmSettings = json.loads(m.llmSettings)

        return json.loads(c.json())

    async def get_conversations(self, pagination: "Pagination", filter: "ConversationFilter"):
        from chainlit.client.postgres.prisma.app.enums import Role
        from chainlit.client.postgres.prisma.app.models import Conversation

        email_where = {}

        print(self.user_infos["role"], Role.USER)
        if self.user_infos:
            if self.user_infos["role"] == Role.USER:
                email_where = {"email": self.user_infos["email"]}
            elif filter.authorEmail:
                email_where = {"email": filter.authorEmail}

        some_messages = {}

        if filter.feedback is not None:
            some_messages["humanFeedback"] = filter.feedback

        if filter.search is not None:
            some_messages["content"] = {"contains": filter.search or None}

        if pagination.cursor:
            cursor = {"id": pagination.cursor}
        else:
            cursor = None

        conversations = await Conversation.prisma().find_many(
            take=pagination.first,
            skip=1 if pagination.cursor else None,
            cursor=cursor,
            include={
                "author": True,
                "messages": {
                    "take": 1,
                    "where": {
                        "authorIsUser": True,
                    },
                    "orderBy": [
                        {
                            "createdAt": "asc",
                        }
                    ],
                },
            },
            where={
                "messages": {"some": some_messages},
                "author": email_where,
                "projectId": self.project_id,
            },
            order={
                "createdAt": "desc",
            },
        )

        has_more = len(conversations) == pagination.first

        if has_more:
            end_cursor = conversations[-1].id
        else:
            end_cursor = None

        conversations = [json.loads(c.json()) for c in conversations]

        return PaginatedResponse(
            pageInfo=PageInfo(hasNextPage=has_more, endCursor=end_cursor),
            data=conversations,
        )

    async def get_message(self, conversation_id: str, message_id: str) -> Dict:
        raise NotImplementedError

    async def create_message(self, variables: MessageDict) -> str:
        from chainlit.client.postgres.prisma.app.models import Message
        from chainlit.client.postgres.prisma.app.types import MessageCreateInput

        c_id = await self.get_conversation_id()

        if not c_id:
            logger.error(f"Missing conversation ID, could not persist the message. {variables}")
            raise ValueError("Missing conversation ID, could not persist the message.")

        variables = variables.copy()

        variables["conversationId"] = c_id

        # self.before_write(variables)

        variables["llmSettings"] = "{}"
        print(variables)

        res = await Message.prisma().create(data=cast(MessageCreateInput, variables))
        return res.id

    async def update_message(self, message_id: str, variables: MessageDict) -> bool:
        from chainlit.client.postgres.prisma.app.models import Message
        from chainlit.client.postgres.prisma.app.types import MessageUpdateInput

        variables = variables.copy()

        # self.before_write(variables)

        await Message.prisma().update(data=cast(MessageUpdateInput, variables), where={"id": message_id})

        return True

    async def delete_message(self, message_id: str) -> bool:
        from chainlit.client.postgres.prisma.app.models import Message

        await Message.prisma().delete(where={"id": message_id})

        return True

    async def upload_element(self, content: Union[bytes, str], mime: str) -> str:
        c_id = await self.get_conversation_id()

        if not c_id:
            logger.error("Missing conversation ID, could not persist the element.")
            raise ValueError("Missing conversation ID, could not persist the element.")

        file_ext = mimetypes.guess_extension(mime)
        file_name = f"{uuid.uuid4()}{file_ext}"

        sub_path = os.path.join(str(c_id), file_name)
        full_path = os.path.join(config.project.local_fs_path, sub_path)

        print("uploading to", full_path)

        if not os.path.exists(os.path.dirname(full_path)):
            os.makedirs(os.path.dirname(full_path))

        # TODO: add s3 support
        async with aiofiles.open(full_path, "wb") as out:
            await out.write(content)
            await out.flush()

            url = f"/files/{sub_path}"
            return url

    async def upsert_element(self, variables: ElementDict) -> ElementDict:
        from chainlit.client.postgres.prisma.app.models import Element
        from chainlit.client.postgres.prisma.app.types import ElementCreateInput, ElementUpdateInput

        c_id = await self.get_conversation_id()

        if not c_id:
            logger.error("Missing conversation ID, could not persist the element.")
            raise ValueError("Missing conversation ID, could not persist the element.")

        variables["conversationId"] = c_id

        # self.before_write(variables)

        if "id" in variables:
            res = await Element.prisma().update(
                data=cast(ElementUpdateInput, variables), where={"id": variables.get("id")}
            )
        else:
            res = await Element.prisma().create(data=cast(ElementCreateInput, variables))

        return cast(ElementDict, res.dict())

    async def create_element(self, variables: ElementDict) -> ElementDict:
        return await self.upsert_element(variables)

    async def update_element(self, variables: ElementDict) -> ElementDict:
        return await self.upsert_element(variables)

    async def get_element(self, conversation_id: str, element_id: str) -> ElementDict:
        from chainlit.client.postgres.prisma.app.models import Element

        res = await Element.prisma().find_unique_or_raise(where={"id": element_id})
        return json.loads(res.json())

    async def set_human_feedback(
        self, message_id: str, feedback: Literal[-1, 0, 1]
    ) -> bool:
        from chainlit.client.postgres.prisma.app.models import Message

        await Message.prisma().update(
            where={"id": message_id},
            data={
                "humanFeedback": feedback,
            },
        )

        return True
