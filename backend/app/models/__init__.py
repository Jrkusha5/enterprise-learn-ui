"""SQLAlchemy models; import Base and all models for Alembic."""
from app.database import Base
from app.models.user import User
from app.models.course import Course, Chapter, Lesson, LessonResource
from app.models.review import Review
from app.models.message import Message
from app.models.activity import Activity
from app.models.enrollment import Enrollment
from app.models.course_progress import CourseProgress
from app.models.note import Note

__all__ = [
    "Base",
    "User",
    "Course",
    "Chapter",
    "Lesson",
    "LessonResource",
    "Review",
    "Message",
    "Activity",
    "Enrollment",
    "CourseProgress",
    "Note",
]
