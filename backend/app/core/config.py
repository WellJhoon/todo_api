from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Todo API"
    SQLALCHEMY_DATABASE_URL: str = "sqlite:///./todos.db"

    class Config:
        case_sensitive = True

settings = Settings()
