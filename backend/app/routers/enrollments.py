"""Enrollment routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.enrollment import EnrollmentCreate
from app.controllers.enrollment_controller import get_enrolled_course_ids, is_enrolled, enroll, unenroll
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/enrollments", tags=["enrollments"])


@router.get("/me")
def my_enrollments(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {"course_ids": get_enrolled_course_ids(db, user.id)}


@router.get("/check/{course_id}")
def check_enrolled(course_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {"enrolled": is_enrolled(db, user.id, course_id)}


@router.post("")
def enroll_route(data: EnrollmentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    enroll(db, user.id, data.course_id)
    return {"enrolled": True, "course_id": data.course_id}


@router.delete("/{course_id}", status_code=204)
def unenroll_route(course_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    unenroll(db, user.id, course_id)
