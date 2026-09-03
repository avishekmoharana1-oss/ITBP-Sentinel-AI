from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Incident, User
from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_incidents = db.query(Incident).count()
    return {
        "total_incidents": total_incidents,
        "message": "Dashboard stats"
    }