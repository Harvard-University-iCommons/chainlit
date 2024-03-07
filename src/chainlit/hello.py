# This is a simple example of a chainlit app.

from chainlit.session import Session
from fastapi import Request
from fastapi.responses import JSONResponse

from chainlit import AskUserMessage, Message, on_chat_start
from chainlit.server import app


@on_chat_start
async def main():
    res = await AskUserMessage(content="What is your name?", timeout=30).send()
    if res:
        await Message(
            content=f"Your name is: {res['content']}.\nChainlit installation is working!\nYou can now start building your own chainlit apps!",
        ).send()


@app.get("/version")
async def get_version(request: Request):
    payload = {"version": "1.1.9999"}
    return JSONResponse(content=payload)


@app.get("/projects/{session_id}")
async def get_user_projects(request: Request, session_id: str) -> JSONResponse:
    """
    Get AI Sandboxes a user has access to.
    """
    # we need to get a hold of the websocket context in order to push messages
    # newer version of chainlit does this via a dedicated websocket session:
    #     ws_session = WebsocketSession.get_by_id(session_id=session_id)
    #     init_ws_context(ws_session)
    # but since we don't have that atm, do it ourselves with the regular session object
    print(f"SESSION_ID ============================================================================================================================  {type(session_id)} {session_id}")
    session = Session.get_by_id(session_id=session_id)
    print(f"SESSION ============================================================================================================================ {session}")

    try:
        user_infos = await session.auth_client.get_user_infos()
        print(f"user_infos ============================================================================================================================ {user_infos}")
        if session:
            return JSONResponse(content={"projects": ["Success"]})
        # return JSONResponse(content={"projects": user_infos["projects"]})
    except Exception as e:
        print(f"---------> Failed to get user_infos: {e}")
        raise
