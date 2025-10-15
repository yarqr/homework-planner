from typing import Annotated
from uuid import UUID

from fastapi import HTTPException, Path, Request, status
from pydantic import BaseModel

from backend.db.repositories import TaskRepository


class DeleteByIdRequest(BaseModel):
    task_id: Annotated[UUID, Path(title="Идентификатор задачи")]


async def delete_by_id(
    data: DeleteByIdRequest,
    request: Request,
) -> None:
    task_repo: TaskRepository = request.app.state.task_repo
    if not task_repo.task_exists(data.task_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    else:
        task_repo.delete(data.task_id)
