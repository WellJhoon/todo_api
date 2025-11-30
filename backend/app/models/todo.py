from typing import Optional
from datetime import datetime
from beanie import Document, PydanticObjectId
from pydantic import Field

class Todo(Document):
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    due_date: Optional[str] = None
    duration_minutes: Optional[int] = None
    estimated_minutes: Optional[int] = 0
    time_spent_minutes: Optional[int] = 0
    
    # Ticket fields
    status: str = "todo"
    ticket_type: str = "task"
    assignee_id: Optional[PydanticObjectId] = None
    owner_id: Optional[PydanticObjectId] = None
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "todos"

