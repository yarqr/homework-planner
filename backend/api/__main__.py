import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import Config, Server

from backend.api.setup import get_api_router
from backend.db.repositories import TaskRepository, UserRepository


async def main():
    app = FastAPI()

    app.state.user_repo = UserRepository()
    app.state.task_repo = TaskRepository()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(get_api_router())

    server = Server(Config(app, "0.0.0.0"))

    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
