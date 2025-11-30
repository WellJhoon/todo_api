from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
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
    
    # Ticket fields
    status = Column(String, default="todo")  # todo, in_progress, done
    ticket_type = Column(String, default="task")  # bug, feature, task, improvement
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    assignee = relationship("User", foreign_keys=[assignee_id], back_populates="assigned_tickets")
    owner = relationship("User", foreign_keys=[owner_id], back_populates="todos")

