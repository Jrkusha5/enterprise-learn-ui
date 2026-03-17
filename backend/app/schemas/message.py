"""Message schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    receiver_id: str


class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None


class MessageResponse(MessageBase):
    id: str
    sender_id: str
    receiver_id: str
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    timestamp: str
    is_read: bool

    class Config:
        from_attributes = True
