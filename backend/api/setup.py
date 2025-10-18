from fastapi import APIRouter, status

from backend.api.routes.tasks.delete import delete_by_id
from backend.api.routes.tasks.get import get_all_for_date, get_count_for_every_month_day
from backend.api.routes.tasks.post import create
from backend.api.routes.users.get import get_user
from backend.api.routes.users.post import login, register
from backend.api.routes.users.put import update_tg_id


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
    users.get("/{user_id}", summary="Получить данные о пользователе")(get_user)
    users.put(
        "/{user_id}/update-tg-id",
        summary="Обновить ИД в ТГ",
        status_code=status.HTTP_204_NO_CONTENT,
    )(update_tg_id)

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
