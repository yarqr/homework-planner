from fastapi import APIRouter, status

from backend.api.api.tasks.delete import delete_by_id
from backend.api.api.tasks.get import get_all_for_date, get_count_for_every_month_day
from backend.api.api.tasks.post import create
from backend.api.api.users.post import login, register


def get_api_router() -> APIRouter:
    users = APIRouter(prefix="/users", tags=["users"])

    users.post(
        "/",
        summary="Регистрация",
        status_code=status.HTTP_201_CREATED,
    )(register)
    users.post(
        "/login",
        summary="Вход",
    )(login)

    tasks = APIRouter(prefix="/tasks", tags=["tasks"])

    tasks.post("", summary="Создать задачу", status_code=status.HTTP_201_CREATED)(
        create
    )
    tasks.get(
        "/{user_id}/count-for-every-month-day",
        summary="Получить количество задач на каждый день месяца",
    )(get_count_for_every_month_day)
    tasks.get("/{user_id}/{date}", summary="Получить задачи на определённый день")(
        get_all_for_date
    )
    tasks.delete(
        "/{task_id}",
        summary="Удалить задачу",
        status_code=status.HTTP_204_NO_CONTENT,
    )(delete_by_id)

    router = APIRouter(prefix="/api")
    router.include_router(users)
    router.include_router(tasks)

    return router
