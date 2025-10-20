from typing import Annotated
from uuid import UUID

from fastapi import HTTPException, Path, Request, status

from backend.db.repositories import TaskRepository


async def update_notifications_count(
    task_id: Annotated[UUID, Path(title="Идентификатор задачи")], request: Request
) -> None:
    task_repo: TaskRepository = request.app.state.task_repo
    state = task_repo.update_notifications(task_id)
    if not state:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
