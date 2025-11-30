from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.models.todo import Todo

async def init_db(mongodb_url: str):
    client = AsyncIOMotorClient(mongodb_url)
    # Nombre de la base de datos (puedes cambiarlo si quieres)
    database = client.todo_app_db
    
    # Inicializar Beanie con los modelos de documento
    await init_beanie(database=database, document_models=[User, Todo])
