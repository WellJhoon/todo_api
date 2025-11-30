from typing import Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field

class User(Document):
    name: str
    email: Indexed(str, unique=True) # type: ignore
    hashed_password: str
    avatar: Optional[str] = None
    color: str = "bg-blue-500"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "users"