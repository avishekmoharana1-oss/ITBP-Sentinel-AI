from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel
from database import get_db
from models import Incident, User
from auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["Incidents"])

class IncidentCreate(BaseModel):
    title: str
    description: str
    location: str
    incident_type: str
    severity: str

class IncidentResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    incident_type: str
    severity: str
    status: str
    reported_by: int
    created_at: datetime
    updated_at: datetime

@router.get("/", response_model=List[IncidentResponse])
def get_incidents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Incident).all()

@router.post("/", response_model=IncidentResponse)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_incident = Incident(
        title=incident.title,
        description=incident.description,
        location=incident.location,
        incident_type=incident.incident_type,
        severity=incident.severity,
        reported_by=current_user.id
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.put("/{incident_id}")
def update_incident(
    incident_id: int,
    incident: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    db_incident.title = incident.title
    db_incident.description = incident.description
    db_incident.location = incident.location
    db_incident.incident_type = incident.incident_type
    db_incident.severity = incident.severity
    db_incident.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_incident)
    return db_incident

@router.delete("/{incident_id}")
def delete_incident(incident_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    db.delete(db_incident)
    db.commit()
    return {"message": "Incident deleted"}