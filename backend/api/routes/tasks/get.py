from dataclasses import dataclass
from datetime import date
from typing import Annotated, Optional, cast
from uuid import UUID

from fastapi import Body, Path, Query, Request
from pydantic import BaseModel

from backend.db.models import UserModel
from backend.db.repositories import TaskRepository, UserRepository


class GetCountForEveryMonthDayResponse(BaseModel):
    result: Annotated[
        list[int],
        Body(
            title="Массив с количеством задач для каждого дня месяца",
            min_length=28,
            max_length=31,
        ),
    ]


@dataclass(kw_only=True)
class GetAllForDateTaskResult:
    id: Annotated[UUID, Body(title="Идентификатор задачи")]
    name: Annotated[str, Body(title="Название задачи")]


class GetAllForDateResponse(BaseModel):
    result: Annotated[
        list[GetAllForDateTaskResult],
        Body(
            title="Массив задач с полученной датой окончания срока",
        ),
    ]


@dataclass(kw_only=True)
class GetAllForNotificationsTaskResult:
    id: Annotated[UUID, Body(title="Идентификатор задачи")]
    name: Annotated[str, Body(title="Название задачи")]
    date: Annotated[date, Body(title="Дата окончания срока задачи")]
    tg_id: Annotated[Optional[int], Body(title="Идентификатор пользователя в телеграм")]
    notifications: Annotated[int, Body(title="Количество отправленных уведомлений")]


class GetAllForNotificationsResponse(BaseModel):
    result: Annotated[
        list[GetAllForNotificationsTaskResult],
        Body(
            title="Массив всех задач",
        ),
    ]


async def get_count_for_every_month_day(
    user_id: Annotated[UUID, Path(title="Идентификатор пользователя")],
    year: Annotated[
        int,
        Query(title="Год окончания срока задач"),
    ],
    month: Annotated[
        int,
        Query(title="Месяц окончания срока задач"),
    ],
    request: Request,
) -> GetCountForEveryMonthDayResponse:
    task_repo: TaskRepository = request.app.state.task_repo
    return GetCountForEveryMonthDayResponse(
        result=task_repo.get_count_for_every_month_day(user_id, month, year)
    )


async def get_all_for_date(
    user_id: Annotated[UUID, Path(title="Идентификатор пользователя")],
    date_: Annotated[date, Path(title="Дата окончания срока задач", alias="date")],
    request: Request,
) -> GetAllForDateResponse:
    task_repo: TaskRepository = request.app.state.task_repo
    tasks = task_repo.get_all_by_date(user_id, date_)
    return GetAllForDateResponse(
        result=[
            GetAllForDateTaskResult(
                id=task.id,
                name=task.name,
            )
            for task in tasks
        ]
    )


async def get_all_for_notifications(request: Request) -> GetAllForNotificationsResponse:
    task_repo: TaskRepository = request.app.state.task_repo
    user_repo: UserRepository = request.app.state.user_repo
    return GetAllForNotificationsResponse(
        result=[
            GetAllForNotificationsTaskResult(
                id=task.id,
                name=task.name,
                date=task.date,
                tg_id=cast(UserModel, user_repo.get_by_id(task.user_id)).tg_id,
                notifications=task.notifications,
            )
            for task in task_repo.get_all()
        ]
    )
