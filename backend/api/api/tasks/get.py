from dataclasses import dataclass
from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import Body, Path, Query, Request
from pydantic import BaseModel

from backend.db.repositories import TaskRepository


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
class TaskResult:
    id: Annotated[UUID, Body(title="Идентификатор задачи")]
    name: Annotated[str, Body(title="Название задачи")]
    date: Annotated[date, Body(title="Дата окончания срока задачи")]
    user_id: Annotated[UUID, Body(title="Идентификатор пользователя")]


class GetAllForDateResponse(BaseModel):
    result: Annotated[
        list[TaskResult],
        Body(
            title="Массив задач с полученной датой окончания срока",
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


def get_all_for_date(
    user_id: Annotated[UUID, Path(title="Идентификатор пользователя")],
    date_: Annotated[date, Path(title="Дата окончания срока задач", alias="date")],
) -> GetAllForDateResponse: ...  # TODO: to fill func
