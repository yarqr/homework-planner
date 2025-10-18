from typing import Annotated
from uuid import UUID

from fastapi import Body, Path, Request
from pydantic import BaseModel

from backend.db.repositories import UserRepository


class UpdateTgIdRequest(BaseModel):
    tg_id: Annotated[int, Body(title="Новый идентификатор в телеграм")]


async def update_tg_id(
    user_id: Annotated[UUID, Path(title="Идентификатор пользователя")],
    data: UpdateTgIdRequest,
    request: Request,
) -> None:
    user_repo: UserRepository = request.app.state.user_repo
    user_repo.update_tg_id(user_id, data.tg_id)
