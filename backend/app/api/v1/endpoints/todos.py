from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app import schemas
from app.api import deps
from app.models.user import User
from app.models.todo import Todo
from beanie import PydanticObjectId

router = APIRouter()

@router.post("/", response_model=schemas.Todo)
async def create_todo(
    todo: schemas.TodoCreate, 
    current_user: User = Depends(deps.get_current_user)
):
    db_todo = Todo(**todo.dict(), owner_id=current_user.id)
    await db_todo.create()
    return db_todo

@router.get("/", response_model=List[schemas.Todo])
async def read_todos(
    skip: int = 0, 
    limit: int = 100, 
    current_user: User = Depends(deps.get_current_user)
):
    todos = await Todo.find(Todo.owner_id == current_user.id).skip(skip).limit(limit).to_list()
    return todos

@router.get("/{todo_id}", response_model=schemas.Todo)
async def read_todo(
    todo_id: PydanticObjectId, 
    current_user: User = Depends(deps.get_current_user)
):
    todo = await Todo.find_one(Todo.id == todo_id, Todo.owner_id == current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return todo

@router.put("/{todo_id}", response_model=schemas.Todo)
async def update_todo(
    todo_id: PydanticObjectId, 
    todo_in: schemas.TodoUpdate, 
    current_user: User = Depends(deps.get_current_user)
):
    todo = await Todo.find_one(Todo.id == todo_id, Todo.owner_id == current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    update_data = todo_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)
    
    await todo.save()
    return todo

@router.delete("/{todo_id}", response_model=schemas.Todo)
async def delete_todo(
    todo_id: PydanticObjectId, 
    current_user: User = Depends(deps.get_current_user)
):
    todo = await Todo.find_one(Todo.id == todo_id, Todo.owner_id == current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    await todo.delete()
    return todo
