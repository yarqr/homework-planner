from passlib.context import CryptContext
from sqlalchemy.orm import Session

import backend.models
import backend.schemas

# Настройка хеширования паролей
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str):
    """
    Находит пользователя по email
    Возвращает None если пользователь не найден
    """
    return (
        db.query(backend.models.User).filter(backend.models.User.email == email).first()
    )


def get_user_by_id(db: Session, user_id: int):
    """
    Находит пользователя по ID
    """
    return (
        db.query(backend.models.User).filter(backend.models.User.id == user_id).first()
    )


def create_user(db: Session, user: backend.schemas.UserCreate):
    """
    Создает нового пользователя с хешированным паролем
    """
    # Хешируем пароль перед сохранением
    hashed_password = pwd_context.hash(user.password)

    db_user = backend.models.User(
        email=user.email,
        password=hashed_password,  # Сохраняем хеш, а не пароль
        name=user.name,
    )

    db.add(db_user)  # Добавляем в сессию
    db.commit()  # Сохраняем в БД
    db.refresh(db_user)  # Обновляем объект (получаем ID и т.д.)

    return db_user


def authenticate_user(db: Session, email: str, password: str):
    """
    Проверяет email и пароль пользователя
    Возвращает пользователя если все верно, иначе None
    """
    user = get_user_by_email(db, email)
    if not user:
        return None  # Пользователь не найден

    if not pwd_context.verify(password, user.password):
        return None  # Неверный пароль

    return user  # Аутентификация успешна
