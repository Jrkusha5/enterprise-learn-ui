"""Activity schemas."""
from typing import Optional
from pydantic import BaseModel


class ActivityBase(BaseModel):
    action: str
    target: Optional[str] = None


class ActivityCreate(ActivityBase):
    user_display: Optional[str] = None


class ActivityResponse(ActivityBase):
    id: str
    user: str  # user_display or user name
    time: str

    class Config:
        from_attributes = True
