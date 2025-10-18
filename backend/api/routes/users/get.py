from typing import Annotated, Optional
from uuid import UUID

from fastapi import Body, HTTPException, Path, Request, status
from pydantic import BaseModel

from backend.db.repositories import UserRepository


class GetUserResponse(BaseModel):
    login: Annotated[str, Body(title="Логин пользователя")]
    tg_id: Annotated[Optional[int], Body(title="Идентификатор пользователя в телеграм")]


async def get_user(
    user_id: Annotated[UUID, Path(title="Идентификатор пользователя")], request: Request
) -> GetUserResponse:
    user_repo: UserRepository = request.app.state.user_repo
    user = user_repo.get_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return GetUserResponse(login=user.login, tg_id=user.tg_id)
