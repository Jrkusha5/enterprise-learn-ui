"""Note schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteBase(BaseModel):
    content: str
    timestamp: int  # video time in seconds


class NoteCreate(NoteBase):
    lesson_id: str
    course_id: str


class NoteUpdate(BaseModel):
    content: Optional[str] = None
    timestamp: Optional[int] = None


class NoteResponse(NoteBase):
    id: str
    lesson_id: str
    course_id: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
