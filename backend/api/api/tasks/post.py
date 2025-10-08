from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import Body
from pydantic import BaseModel


class TaskCreatingRequest(BaseModel):
    name: Annotated[str, Body(title="Название задачи")]
    date: Annotated[date, Body(title="Дата окончания срока задачи")]
    user_id: Annotated[UUID, Body(title="Идентификатор пользователя")]


class TaskCreatingResponse(BaseModel):
    id: Annotated[UUID, Body(title="Идентификатор задачи")]


async def create(
    data: TaskCreatingRequest,
) -> TaskCreatingResponse: ...  # TODO: to fill func
