# This is a simple example of a chainlit app.

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
