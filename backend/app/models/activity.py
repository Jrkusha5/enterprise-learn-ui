"""Activity model (audit/feed)."""
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_display = Column(String(255), nullable=True)  # denormalized for display
    action = Column(String(100), nullable=False)
    target = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
