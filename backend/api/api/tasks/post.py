from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import Body, HTTPException, status, Request
from pydantic import BaseModel

from backend.db.models import TaskModel
from backend.db.repositories import TaskRepository


class TaskCreatingRequest(BaseModel):
    name: Annotated[str, Body(title="Название задачи")]
    date: Annotated[date, Body(title="Дата окончания срока задачи")]
    user_id: Annotated[UUID, Body(title="Идентификатор пользователя")]


class TaskCreatingResponse(BaseModel):
    id: Annotated[UUID, Body(title="Идентификатор задачи")]


async def create(
    data: TaskCreatingRequest, request: Request
) -> TaskCreatingResponse:
    task_repo: TaskRepository = request.app.state.task_repo
    task = TaskModel(name=data.name, date=data.date, user_id=data.user_id)
    if task_repo.have_repetitions(task):
        raise HTTPException(status.HTTP_409_CONFLICT, "Task with same data already exists")
    else:
        task_repo.create(task)
        return TaskCreatingResponse(id=task.id)