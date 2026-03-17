"""Course progress controller."""
from sqlalchemy.orm import Session

from app.models.course_progress import CourseProgress


def get_progress(db: Session, user_id: str, course_id: str) -> CourseProgress | None:
    return db.query(CourseProgress).filter(
        CourseProgress.user_id == user_id,
        CourseProgress.course_id == course_id,
    ).first()


def get_or_create_progress(db: Session, user_id: str, course_id: str) -> CourseProgress:
    p = get_progress(db, user_id, course_id)
    if p:
        return p
    p = CourseProgress(user_id=user_id, course_id=course_id, progress=0, completed_lessons={}, positions={})
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


def set_lesson_position(db: Session, user_id: str, course_id: str, lesson_id: str, current_time: int) -> CourseProgress:
    p = get_or_create_progress(db, user_id, course_id)
    if p.positions is None:
        p.positions = {}
    p.positions[lesson_id] = current_time
    db.commit()
    db.refresh(p)
    return p


def set_lesson_completed(db: Session, user_id: str, course_id: str, lesson_id: str, total_lessons: int) -> CourseProgress:
    p = get_or_create_progress(db, user_id, course_id)
    if p.completed_lessons is None:
        p.completed_lessons = {}
    p.completed_lessons[lesson_id] = True
    completed_count = len(p.completed_lessons)
    p.progress = round((completed_count / total_lessons) * 100) if total_lessons else 0
    db.commit()
    db.refresh(p)
    return p
