from datetime import date
from typing import Optional
from uuid import UUID

from backend.db.models import TaskModel, UserModel


class UserRepository:
    def __init__(self) -> None:
        self.users: list[UserModel] = []

    def create(self, user: UserModel) -> None:
        self.users.append(user)

    def get_by_login(self, login: str) -> Optional[UserModel]:
        for user in self.users:
            if user.login == login:
                return user
        return None


class TaskRepository:
    def __init__(self) -> None:
        self.tasks: list[TaskModel] = []

    def create(self, task: TaskModel) -> None: ...  # TODO

    def delete(self, id_: UUID) -> None: ...  # TODO

    def get_count_for_every_month_day(self, year: int, month: int) -> None: ...  # TODO

    def get_all_by_date(self, date_: date) -> None: ...  # TODO
