"""Activity controller."""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityResponse


def list_activities(db: Session, limit: int = 50) -> List[ActivityResponse]:
    activities = (
        db.query(Activity)
        .order_by(Activity.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        ActivityResponse(
            id=a.id,
            user=a.user_display or (str(a.user_id) if a.user_id else ""),
            action=a.action,
            target=a.target,
            time=a.created_at.isoformat() if a.created_at else "",
        )
        for a in activities
    ]


def create_activity(
    db: Session,
    user_id: Optional[str],
    data: ActivityCreate,
    user_display: Optional[str] = None,
) -> Activity:
    act = Activity(
        user_id=user_id,
        user_display=user_display or data.user_display,
        action=data.action,
        target=data.target,
    )
    db.add(act)
    db.commit()
    db.refresh(act)
    return act


def to_response(a: Activity) -> ActivityResponse:
    return ActivityResponse(
        id=a.id,
        user=a.user_display or (str(a.user_id) if a.user_id else ""),
        action=a.action,
        target=a.target,
        time=a.created_at.isoformat() if a.created_at else "",
    )
