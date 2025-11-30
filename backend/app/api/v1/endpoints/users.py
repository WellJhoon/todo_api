import shutil
import os
from typing import Any
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import User
from app.crud import crud_user

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.post("/me/image", response_model=User)
async def upload_user_image(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload profile image for current user.
    """
    # Validar extensión
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Crear directorio si no existe
    upload_dir = "app/static/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # Generar nombre único
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"user_{current_user.id}{file_extension}"
    file_path = os.path.join(upload_dir, filename)

    # Guardar archivo
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Actualizar usuario en DB
    # Nota: Guardamos la URL relativa
    image_url = f"/static/uploads/{filename}"
    current_user.profile_image = image_url
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user
