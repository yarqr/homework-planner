from datetime import date
from uuid import UUID

from backend.db.models import UserModel


class UserRepository:
    def __init__(self):
        self.users = []

    def create(self, user: UserModel):
        self.users.append(user)

    def get_by_login(self, login: str):
        for user in self.users:
            if user.login == login:
                return user


class TaskRepository:
    def __init__(self):
        self.tasks = []

    def create(self, TaskModel): ...  # TODO

    def delete(self, id_: UUID): ...  # TODO

    def get_count_for_every_month_day(self, year: int, month: int): ...  # TODO

    def get_all_by_date(self, date_: date): ...  # TODO
