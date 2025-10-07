from uuid import UUID

from fastapi import HTTPException, Request, status
from pydantic import BaseModel

from backend.db.models import UserModel
from backend.db.repositories import UserRepository


class UserAuthorizationRequest(BaseModel):
    login: str
    password: str


class UserAuthorizationResponse(BaseModel):
    user_id: UUID
    login: str


async def registration(
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
