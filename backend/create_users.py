from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

def create_default_users():
    db = SessionLocal()
    
    # Check if users already exist
    if db.query(User).count() > 0:
        print("Users already exist")
        return
    
    users_data = [
        {"name": "Juan Pérez", "email": "juan@example.com", "avatar": "JP", "color": "bg-blue-500"},
        {"name": "María García", "email": "maria@example.com", "avatar": "MG", "color": "bg-green-500"},
        {"name": "Carlos López", "email": "carlos@example.com", "avatar": "CL", "color": "bg-purple-500"},
        {"name": "Ana Martín", "email": "ana@example.com", "avatar": "AM", "color": "bg-pink-500"},
    ]
    
    for user_data in users_data:
        user = User(**user_data)
        db.add(user)
    
    db.commit()
    db.close()
    print("Default users created successfully")

if __name__ == "__main__":
    create_default_users()