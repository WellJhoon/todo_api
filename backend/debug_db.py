from app.db.session import SessionLocal, engine
from app.db.base import Base
from sqlalchemy import text
from app.crud.crud_user import create_user
from app.schemas.user import UserCreate
import sys

def check_db():
    print("--- Verificando Base de Datos ---")
    
    # 1. Verificar tablas existentes
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
            tables = [row[0] for row in result]
            print(f"Tablas encontradas: {tables}")
            
            if "users" not in tables:
                print("ERROR CRÍTICO: La tabla 'users' NO existe.")
                print("Intentando crear tablas ahora...")
                Base.metadata.create_all(bind=engine)
                print("Tablas creadas. Verifica si 'users' aparece ahora.")
            else:
                print("La tabla 'users' existe.")
    except Exception as e:
        print(f"Error conectando a la DB: {e}")
        return

    # 2. Intentar crear un usuario de prueba
    print("\n--- Prueba de Creación de Usuario ---")
    db = SessionLocal()
    try:
        user_in = UserCreate(email="test_debug@example.com", password="password123")
        # Verificar si ya existe para no fallar por unique constraint
        from app.models.user import User
        existing = db.query(User).filter(User.email == "test_debug@example.com").first()
        if existing:
            print("El usuario de prueba ya existe. El CRUD parece funcionar.")
        else:
            user = create_user(db, user_in)
            print(f"Usuario creado exitosamente: ID {user.id}, Email {user.email}")
    except Exception as e:
        print(f"ERROR al crear usuario: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
