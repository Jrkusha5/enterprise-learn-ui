"""Enrollment schemas."""
from pydantic import BaseModel


class EnrollmentCreate(BaseModel):
    course_id: str


class EnrollmentResponse(BaseModel):
    user_id: str
    course_id: str
    enrolled_at: Optional[str] = None

    class Config:
        from_attributes = True
