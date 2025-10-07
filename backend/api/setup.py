from fastapi import APIRouter, status

from backend.api.api.delete.task import delete
from backend.api.api.get.task import get_all_by_date, get_count_for_every_month_day
from backend.api.api.post.task import create
from backend.api.api.post.user import login, registration


def get_api_router() -> APIRouter:
    get_router = APIRouter(prefix="/get")
    get_router.get("/task/get_count_for_every_month_day")(get_count_for_every_month_day)
    get_router.get("/task/get_all_by_date")(get_all_by_date)

    post_router = APIRouter(prefix="/post")
    post_router.post("/user/registration", status_code=status.HTTP_201_CREATED)(
        registration
    )
    post_router.post("/user/login")(login)
    post_router.post("/task/create", status_code=status.HTTP_201_CREATED)(create)

    delete_router = APIRouter(prefix="/delete")
    delete_router.delete("/task")(delete)

    router = APIRouter(prefix="/api")
    router.include_router(get_router)
    router.include_router(post_router)
    router.include_router(delete_router)

    return router
