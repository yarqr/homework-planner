from dataclasses import dataclass, field
from datetime import date
from uuid import UUID, uuid4


@dataclass(kw_only=True)
class UserModel:
    login: str
    password: str

    id: UUID = field(default_factory=uuid4)


@dataclass(kw_only=True)
class TaskModel:
    name: str
    date: date
    user_id: UUID

    id: UUID = field(default_factory=uuid4)
