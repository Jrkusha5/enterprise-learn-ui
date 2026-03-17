"""Message routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.message import MessageCreate, MessageResponse
from app.controllers.message_controller import get_by_id, list_conversation, create_message, mark_read, to_response
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/messages", tags=["messages"])


@router.get("/conversation/{other_id}", response_model=list[MessageResponse])
def get_conversation(
    other_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list_conversation(db, user.id, other_id)


@router.post("", response_model=MessageResponse, status_code=201)
def send_message(data: MessageCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    msg = create_message(db, user.id, data)
    loaded = get_by_id(db, msg.id)
    return to_response(loaded)


@router.post("/{message_id}/read")
def mark_message_read(message_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    msg = mark_read(db, message_id, user.id)
    return {"ok": msg is not None}
