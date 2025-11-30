from app.db.session import engine
from sqlalchemy import text

def add_profile_image_column():
    try:
        with engine.connect() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN profile_image VARCHAR"))
            print("Columna 'profile_image' añadida exitosamente.")
    except Exception as e:
        print(f"Error (probablemente la columna ya existe): {e}")

if __name__ == "__main__":
    add_profile_image_column()
