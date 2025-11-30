import os
from app.db.base import Base
from app.db.session import engine

DB_FILE = "todos.db"

def reset_database():
    print(f"--- Reiniciando Base de Datos ({DB_FILE}) ---")
    
    # 1. Eliminar archivo de DB si existe
    if os.path.exists(DB_FILE):
        try:
            os.remove(DB_FILE)
            print(f"Archivo '{DB_FILE}' eliminado.")
        except Exception as e:
            print(f"Error al eliminar '{DB_FILE}': {e}")
            return
    else:
        print(f"Archivo '{DB_FILE}' no encontrado (se creará uno nuevo).")

    # 2. Crear tablas nuevas
    print("Creando nuevas tablas...")
    try:
        Base.metadata.create_all(bind=engine)
        print("¡Tablas creadas exitosamente!")
        print("La estructura ahora coincide con tus modelos actualizados (name, color, avatar, etc).")
    except Exception as e:
        print(f"Error al crear tablas: {e}")

if __name__ == "__main__":
    reset_database()
