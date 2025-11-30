from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False
    priority: str = "medium"
    due_date: str | None = None
    duration_minutes: int | None = None
    estimated_minutes: int | None = 0
    time_spent_minutes: int | None = 0
    status: str = "todo"
    ticket_type: str = "task"
    assignee_id: int | None = None

class TodoCreate(TodoBase):
    pass

from beanie import PydanticObjectId

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    duration_minutes: Optional[int] = None
    estimated_minutes: Optional[int] = None
    time_spent_minutes: Optional[int] = None
    status: Optional[str] = None
    ticket_type: Optional[str] = None
    assignee_id: Optional[PydanticObjectId] = None

class Todo(TodoBase):
    id: PydanticObjectId
    created_at: datetime

    class Config:
        from_attributes = True
