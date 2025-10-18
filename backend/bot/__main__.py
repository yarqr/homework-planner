import asyncio
import logging
from os import getenv
from typing import cast
from uuid import UUID

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandObject, CommandStart
from aiogram.types import Message
from aiohttp import ClientSession

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logging.getLogger("aiogram.event").setLevel(logging.WARNING)


async def start(msg: Message, command: CommandObject, api_url: str) -> None:
    if command.args:
        user_id = UUID(command.args)
        async with ClientSession() as session:
            await session.put(
                api_url + f"/users/{user_id}/update-tg-id",
                json={"tg_id": cast(types.User, msg.from_user).id},
            )
        await msg.answer("✅ Аккаунт успешно привязан!")
    else:
        await msg.answer("👋 Привет!")


async def main() -> None:
    bot = Bot(cast(str, getenv("BOT_TOKEN")))

    dp = Dispatcher()

    dp.message.register(start, CommandStart())

    await dp.start_polling(bot, api_url="http://api:8000/api")


if __name__ == "__main__":
    asyncio.run(main())
