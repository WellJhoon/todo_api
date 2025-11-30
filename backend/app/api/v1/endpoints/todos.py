from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.api import deps

router = APIRouter()

from app.models.user import User

@router.post("/", response_model=schemas.Todo)
def create_todo(
    todo: schemas.TodoCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    return crud.create_todo(db=db, todo=todo, owner_id=current_user.id)

@router.get("/", response_model=List[schemas.Todo])
def read_todos(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    todos = crud.get_todos(db, owner_id=current_user.id, skip=skip, limit=limit)
    return todos

@router.get("/{todo_id}", response_model=schemas.Todo)
def read_todo(
    todo_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    db_todo = crud.get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return db_todo

@router.put("/{todo_id}", response_model=schemas.Todo)
def update_todo(
    todo_id: int, 
    todo: schemas.TodoUpdate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    db_todo = crud.update_todo(db, todo_id=todo_id, todo=todo, owner_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return db_todo

@router.delete("/{todo_id}", response_model=schemas.Todo)
def delete_todo(
    todo_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    db_todo = crud.delete_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return db_todo
