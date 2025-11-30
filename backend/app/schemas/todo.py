from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False
    priority: str = "medium"
    due_date: str | None = None
    duration_minutes: int | None = None
    estimated_minutes: int | None = 0
    time_spent_minutes: int | None = 0

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    pass

class Todo(TodoBase):
    id: int

    class Config:
        from_attributes = True
