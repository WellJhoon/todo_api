from sqlalchemy import Boolean, Column, Integer, String
from app.db.base_class import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="medium")  # low, medium, high
    due_date = Column(String, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    estimated_minutes = Column(Integer, nullable=True, default=0)
    time_spent_minutes = Column(Integer, nullable=True, default=0)

