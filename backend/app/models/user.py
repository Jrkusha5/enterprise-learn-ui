"""User model."""
import uuid
from sqlalchemy import Column, String, Text, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base

# Use PostgreSQL ENUM or String; we use String for simplicity and frontend compatibility
# (admin, instructor, student or ADMIN, INSTRUCTOR, STUDENT)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(String(50), nullable=False, default="student")  # admin, instructor, student
    avatar = Column(String(1024), nullable=True)
    bio = Column(Text, nullable=True)
    password_hash = Column(String(255), nullable=True)  # null for OAuth users
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    courses_instructing = relationship("Course", back_populates="instructor", foreign_keys="Course.instructor_id")
    reviews = relationship("Review", back_populates="user")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    messages_received = relationship("Message", back_populates="receiver", foreign_keys="Message.receiver_id")
    enrollments = relationship("Enrollment", back_populates="user")
    course_progresses = relationship("CourseProgress", back_populates="user")
    notes = relationship("Note", back_populates="user")
