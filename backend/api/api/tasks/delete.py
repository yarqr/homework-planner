from typing import Annotated
from uuid import UUID

from fastapi import Body, HTTPException, Path, Request, status
from pydantic import BaseModel

from backend.db.repositories import TaskRepository


class TaskDeletingResponse(BaseModel):
    status: Annotated[str, Body(title="Статус", default="OK")]


async def delete_by_id(
    task_id: Annotated[UUID, Path(title="Идентификатор задачи", alias="id")],
    request: Request,
) -> TaskDeletingResponse:
    task_repo: TaskRepository = request.app.state.task_repo
    if not task_repo.task_exists(task_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    else:
        task_repo.delete(task_id)
        return TaskDeletingResponse(status="OK")
