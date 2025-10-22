from dataclasses import dataclass, field
from datetime import date
from typing import Optional
from uuid import UUID, uuid4


@dataclass(kw_only=True)
class UserModel:
    login: str
    password: str
    tg_id: Optional[int] = None

    id: UUID = field(default_factory=uuid4)


@dataclass(kw_only=True)
class TaskModel:
    name: str
    date: date
    user_id: UUID
    notifications: int = 0

    id: UUID = field(default_factory=uuid4)

    def have_same_data(self, task: "TaskModel") -> bool:
        return all(
            [
                self.name == task.name,
                self.date == task.date,
                self.user_id == task.user_id,
            ]
        )
