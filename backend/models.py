from sqlalchemy import Column, Integer, String, DateTime, Boolean


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    name = Column(String)


class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    date = Column(DateTime)
    user_id = Column(Integer)
