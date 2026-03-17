"""Course routes."""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.course import CourseCreate, CourseUpdate, CourseListResponse
from app.controllers.course_controller import (
    list_courses,
    get_course_detail,
    create_course,
    update_course,
    delete_course,
    get_course_by_id,
)
from app.dependencies import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("", response_model=list[CourseListResponse])
def list_courses_route(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    return list_courses(db, category=category, user_id=user.id if user else None)


@router.get("/{course_id}", response_model=CourseListResponse)
def get_course(
    course_id: str,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    course = get_course_detail(db, course_id, user_id=user.id if user else None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("", response_model=CourseListResponse, status_code=201)
def create_course_route(
    data: CourseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = create_course(db, data)
    return get_course_detail(db, course.id, user_id=user.id)


@router.patch("/{course_id}", response_model=CourseListResponse)
def update_course_route(
    course_id: str,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = get_course_by_id(db, course_id, load_chapters=False)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    update_course(db, course, data)
    return get_course_detail(db, course_id, user_id=user.id)


@router.delete("/{course_id}", status_code=204)
def delete_course_route(
    course_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    course = get_course_by_id(db, course_id, load_chapters=False)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    delete_course(db, course)
