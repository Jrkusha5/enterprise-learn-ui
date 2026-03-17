"""Review schemas."""
from typing import Optional
from pydantic import BaseModel


class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    course_id: str


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None


class ReviewResponse(ReviewBase):
    id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    course_id: str
    date: Optional[str] = None

    class Config:
        from_attributes = True
