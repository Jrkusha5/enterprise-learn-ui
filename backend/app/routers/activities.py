"""Activity routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.controllers.activity_controller import list_activities, create_activity, to_response
from app.dependencies import get_current_user_optional
from app.models.user import User
from typing import Optional

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=list[ActivityResponse])
def get_activities(
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
):
    return list_activities(db, limit=limit)


@router.post("", response_model=ActivityResponse, status_code=201)
def create_activity_route(
    data: ActivityCreate,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    act = create_activity(db, user.id if user else None, data, user_display=user.name if user else None)
    return to_response(act)
