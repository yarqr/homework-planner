from typing import Annotated
from uuid import UUID

from fastapi import Body, HTTPException, Request, status
from pydantic import BaseModel

from backend.db.models import UserModel
from backend.db.repositories import UserRepository


class UserAuthorizationRequest(BaseModel):
    login: Annotated[str, Body(title="Логин пользователя")]
    password: Annotated[str, Body(title="Пароль пользователя")]


class UserAuthorizationResponse(BaseModel):
    user_id: Annotated[UUID, Body(title="Идентификатор пользователя")]
    login: Annotated[str, Body(title="Логин пользователя")]


async def register(
    data: UserAuthorizationRequest, request: Request
) -> UserAuthorizationResponse:
    user_repo: UserRepository = request.app.state.user_repo
    if user_repo.get_by_login(data.login):
        raise HTTPException(status.HTTP_409_CONFLICT, "User already registered")
    else:
        user = UserModel(login=data.login, password=data.password)
        user_repo.create(user)
        return UserAuthorizationResponse(user_id=user.id, login=user.login)


async def login(
    data: UserAuthorizationRequest, request: Request
) -> UserAuthorizationResponse:
    user_repo: UserRepository = request.app.state.user_repo
    user = user_repo.get_by_login(data.login)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    else:
        if user.password == data.password:
            return UserAuthorizationResponse(user_id=user.id, login=user.login)
        else:
            raise HTTPException(status.HTTP_409_CONFLICT, "Incorrect password")
