from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel
from database import get_db
from models import Checkpoint, User
from auth import get_current_user, get_current_admin

router = APIRouter(prefix="/checkpoints", tags=["Checkpoints"])

class CheckpointCreate(BaseModel):
    name: str
    location: str
    status: str = "operational"
    officer_assigned: int = None

class CheckpointResponse(BaseModel):
    id: int
    name: str
    location: str
    status: str
    officer_assigned: int
    last_inspection: datetime

@router.get("/", response_model=List[CheckpointResponse])
def get_checkpoints(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    checkpoints = db.query(Checkpoint).offset(skip).limit(limit).all()
    return checkpoints

@router.post("/", response_model=CheckpointResponse)
def create_checkpoint(
    checkpoint: CheckpointCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_checkpoint = Checkpoint(**checkpoint.dict())
    db.add(db_checkpoint)
    db.commit()
    db.refresh(db_checkpoint)
    return db_checkpoint

@router.get("/{checkpoint_id}", response_model=CheckpointResponse)
def get_checkpoint(
    checkpoint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    checkpoint = db.query(Checkpoint).filter(Checkpoint.id == checkpoint_id).first()
    if not checkpoint:
        raise HTTPException(status_code=404, detail="Checkpoint not found")
    return checkpoint

@router.put("/{checkpoint_id}", response_model=CheckpointResponse)
def update_checkpoint(
    checkpoint_id: int,
    checkpoint_update: CheckpointCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    checkpoint = db.query(Checkpoint).filter(Checkpoint.id == checkpoint_id).first()
    if not checkpoint:
        raise HTTPException(status_code=404, detail="Checkpoint not found")
    
    for key, value in checkpoint_update.dict().items():
        setattr(checkpoint, key, value)
    
    checkpoint.last_inspection = datetime.utcnow()
    db.commit()
    db.refresh(checkpoint)
    return checkpoint

@router.delete("/{checkpoint_id}")
def delete_checkpoint(
    checkpoint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    checkpoint = db.query(Checkpoint).filter(Checkpoint.id == checkpoint_id).first()
    if not checkpoint:
        raise HTTPException(status_code=404, detail="Checkpoint not found")
    
    db.delete(checkpoint)
    db.commit()
    return {"message": "Checkpoint deleted"}