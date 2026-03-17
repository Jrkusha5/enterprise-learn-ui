"""Enrollment controller."""
from sqlalchemy.orm import Session
from typing import List

from app.models.enrollment import Enrollment
from app.models.course import Course


def get_enrolled_course_ids(db: Session, user_id: str) -> List[str]:
    rows = db.query(Enrollment.course_id).filter(Enrollment.user_id == user_id).all()
    return [r[0] for r in rows]


def is_enrolled(db: Session, user_id: str, course_id: str) -> bool:
    return db.query(Enrollment).filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id).first() is not None


def enroll(db: Session, user_id: str, course_id: str) -> Enrollment:
    existing = db.query(Enrollment).filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id).first()
    if existing:
        return existing
    en = Enrollment(user_id=user_id, course_id=course_id)
    db.add(en)
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is not None:
        course.students_count = (course.students_count or 0) + 1
    db.commit()
    db.refresh(en)
    return en


def unenroll(db: Session, user_id: str, course_id: str) -> None:
    en = db.query(Enrollment).filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id).first()
    if en:
        db.delete(en)
        course = db.query(Course).filter(Course.id == course_id).first()
        if course is not None and course.students_count and course.students_count > 0:
            course.students_count -= 1
        db.commit()
