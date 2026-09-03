from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import Officer, User
from auth import get_current_user, get_current_admin

router = APIRouter(prefix="/officers", tags=["Officers"])

class OfficerCreate(BaseModel):
    name: str
    designation: str
    badge_number: str
    checkpoint_id: int = None
    shift: str
    contact: str
    status: str = "active"

class OfficerResponse(BaseModel):
    id: int
    name: str
    designation: str
    badge_number: str
    checkpoint_id: int
    shift: str
    contact: str
    status: str

@router.get("/", response_model=List[OfficerResponse])
def get_officers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    officers = db.query(Officer).offset(skip).limit(limit).all()
    return officers

@router.post("/", response_model=OfficerResponse)
def create_officer(
    officer: OfficerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_officer = Officer(**officer.dict())
    db.add(db_officer)
    db.commit()
    db.refresh(db_officer)
    return db_officer

@router.get("/{officer_id}", response_model=OfficerResponse)
def get_officer(
    officer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    officer = db.query(Officer).filter(Officer.id == officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    return officer

@router.put("/{officer_id}", response_model=OfficerResponse)
def update_officer(
    officer_id: int,
    officer_update: OfficerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    officer = db.query(Officer).filter(Officer.id == officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    
    for key, value in officer_update.dict().items():
        setattr(officer, key, value)
    
    db.commit()
    db.refresh(officer)
    return officer

@router.delete("/{officer_id}")
def delete_officer(
    officer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    officer = db.query(Officer).filter(Officer.id == officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail="Officer not found")
    
    db.delete(officer)
    db.commit()
    return {"message": "Officer deleted"}