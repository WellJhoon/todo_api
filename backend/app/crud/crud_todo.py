from sqlalchemy.orm import Session
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate

def get_todo(db: Session, todo_id: int, owner_id: int):
    return db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()

def get_todos(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(Todo).filter(Todo.owner_id == owner_id).offset(skip).limit(limit).all()

def create_todo(db: Session, todo: TodoCreate, owner_id: int):
    db_todo = Todo(**todo.dict(), owner_id=owner_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: TodoUpdate, owner_id: int):
    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()
    if db_todo:
        for key, value in todo.dict(exclude_unset=True).items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int, owner_id: int):
    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo
