"""Message controller."""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload

from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse


def get_by_id(db: Session, message_id: str) -> Optional[Message]:
    return db.query(Message).options(
        joinedload(Message.sender),
        joinedload(Message.receiver),
    ).filter(Message.id == message_id).first()


def list_conversation(db: Session, user_id: str, other_id: str) -> List[MessageResponse]:
    messages = (
        db.query(Message)
        .options(joinedload(Message.sender), joinedload(Message.receiver))
        .filter(
            ((Message.sender_id == user_id) & (Message.receiver_id == other_id))
            | ((Message.sender_id == other_id) & (Message.receiver_id == user_id))
        )
        .order_by(Message.created_at)
        .all()
    )
    return [
        MessageResponse(
            id=m.id,
            sender_id=m.sender_id,
            receiver_id=m.receiver_id,
            sender_name=m.sender.name if m.sender else None,
            sender_avatar=m.sender.avatar if m.sender else None,
            content=m.content,
            timestamp=m.created_at.isoformat() if m.created_at else "",
            is_read=m.is_read,
        )
        for m in messages
    ]


def create_message(db: Session, sender_id: str, data: MessageCreate) -> Message:
    msg = Message(sender_id=sender_id, receiver_id=data.receiver_id, content=data.content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def mark_read(db: Session, message_id: str, user_id: str) -> Optional[Message]:
    msg = db.query(Message).filter(Message.id == message_id, Message.receiver_id == user_id).first()
    if msg:
        msg.is_read = True
        db.commit()
        db.refresh(msg)
    return msg


def to_response(m: Message) -> MessageResponse:
    return MessageResponse(
        id=m.id,
        sender_id=m.sender_id,
        receiver_id=m.receiver_id,
        sender_name=m.sender.name if m.sender else None,
        sender_avatar=m.sender.avatar if m.sender else None,
        content=m.content,
        timestamp=m.created_at.isoformat() if m.created_at else "",
        is_read=m.is_read,
    )
