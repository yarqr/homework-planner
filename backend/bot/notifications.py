import asyncio
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from aiogram import Bot
from aiohttp import ClientSession


@dataclass
class TaskData:
    id: UUID
    name: str
    date: date
    user_tg_id: Optional[int]
    notifications: int


async def worker(bot: Bot, api_url: str) -> None:
    async with ClientSession() as session:
        while True:
            async with session.get(api_url + "/tasks") as resp:
                data = await resp.json()
                tasks = [
                    TaskData(
                        id=task_data["id"],
                        name=task_data["name"],
                        date=date.fromisoformat(task_data["date"]),
                        user_tg_id=task_data["tg_id"],
                        notifications=task_data["notifications"],
                    )
                    for task_data in data["result"]
                ]
            for task in tasks:
                now = datetime.now(tz=timezone(timedelta(hours=3)))
                if task.user_tg_id is not None and all(
                    [
                        (task.date - now.date()).days == 1,
                        now.hour > 12,
                        task.notifications == 0,
                    ]
                ):
                    await session.put(
                        api_url + f"/tasks/{task.id}/update-notifications-count"
                    )
                    await bot.send_message(
                        task.user_tg_id, f"🔔 Завтра заканчивается задача: {task.name}"
                    )
            await asyncio.sleep(60 * 10)
