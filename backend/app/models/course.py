"""Course, Chapter, Lesson, LessonResource models."""
import uuid
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False)
    instructor_id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    thumbnail = Column(String(1024), nullable=True)
    category = Column(String(100), nullable=False, default="Development")
    rating = Column(Float, default=0.0)
    students_count = Column(Integer, default=0)
    duration = Column(String(50), nullable=True)  # e.g. "24h 15m"
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    learning_outcomes = Column(ARRAY(Text), nullable=True)
    includes = Column(JSONB, nullable=True)  # { videoLessons, hoursOfContent, certificate, ... }
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    instructor = relationship("User", back_populates="courses_instructing", foreign_keys=[instructor_id])
    chapters = relationship("Chapter", back_populates="course", order_by="Chapter.order_index", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    course_progresses = relationship("CourseProgress", back_populates="course", cascade="all, delete-orphan")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(UUID(as_uuid=False), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    order_index = Column(Integer, default=0)

    course = relationship("Course", back_populates="chapters")
    lessons = relationship("Lesson", back_populates="chapter", order_by="Lesson.order_index", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    chapter_id = Column(UUID(as_uuid=False), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(500), nullable=False)
    duration = Column(String(50), nullable=True)  # e.g. "10:00"
    video_url = Column(String(1024), nullable=True)
    content = Column(Text, nullable=True)
    free_preview = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    chapter = relationship("Chapter", back_populates="lessons")
    resources = relationship("LessonResource", back_populates="lesson", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lesson", cascade="all, delete-orphan")


class LessonResource(Base):
    __tablename__ = "lesson_resources"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id = Column(UUID(as_uuid=False), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    type = Column(String(20), nullable=True)  # pdf, doc, docx

    lesson = relationship("Lesson", back_populates="resources")
