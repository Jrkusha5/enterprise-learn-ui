"""Course progress schemas."""
from typing import Optional, Dict, Any
from pydantic import BaseModel


class CourseProgressBase(BaseModel):
    progress: int = 0
    completed_lessons: Dict[str, bool] = {}
    positions: Dict[str, int] = {}


class CourseProgressUpdate(BaseModel):
    progress: Optional[int] = None
    completed_lessons: Optional[Dict[str, bool]] = None
    positions: Optional[Dict[str, int]] = None


class CourseProgressResponse(CourseProgressBase):
    id: str
    user_id: str
    course_id: str

    class Config:
        from_attributes = True


class SetLessonPosition(BaseModel):
    lesson_id: str
    current_time: int  # seconds


class SetLessonCompleted(BaseModel):
    lesson_id: str
    total_lessons: int
