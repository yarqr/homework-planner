from typing import Annotated
from uuid import UUID

from fastapi import Body, Path
from pydantic import BaseModel


class TaskDeletingResponse(BaseModel):
    status: Annotated[str, Body(title="Статус", default="OK")]


async def delete_by_id(
    task_id: Annotated[UUID, Path(title="Идентификатор задачи")],
) -> TaskDeletingResponse: ...  # TODO: to fill func
