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


class TaskRepository:  # TODO: to fill methods & type annotations
    def __init__(self) -> None:
        self.tasks: list[TaskModel] = []

    def create(self, task: TaskModel) -> None:
        self.tasks.append(task)

    def have_repetitions(self, task: TaskModel) -> bool:
        for task2 in self.tasks:
            if task.have_same_data(task2):
                return True
        return False

    def task_exists(self, task_id: UUID):
        for task in self.tasks:
            if task_id == task.id:
                return True
        return False

    def delete(self, task_id: UUID) -> None:
        for task in self.tasks:
            if task.id == task_id:
                self.tasks.remove(task)
                break

    def get_count_for_every_month_day(
        self, user_id: UUID, month: int, year: int
    ) -> None: ...

    def get_all_by_date(
        self,
        user_id: UUID,
        date_: date,
    ) -> list[TaskModel]:
        tasks = []
        for task in self.tasks:
            if task.date == date_ and task.user_id == user_id:
                tasks.append(task)
        return tasks
