from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import uvicorn

from backend.database import get_db, engine, Base
from backend.auth import get_current_user
import backend.schemas
import backend.crud

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/register")
async def register(user_data: backend.schemas.UserCreate, db: Session = Depends(get_db)):
    return backend.crud.create_user(db, user_data)


@app.post("/login")
async def login(user_data: backend.schemas.UserCreate, db: Session = Depends(get_db)):
    user = backend.crud.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Wrong login or password")
    # Генерацию JWT токена нужно сделать!!!
    return {"token": "real_jwt_token"}

