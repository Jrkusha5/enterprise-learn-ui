"""Course progress routes."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.progress import CourseProgressResponse, SetLessonPosition, SetLessonCompleted
from app.controllers.progress_controller import get_progress, get_or_create_progress, set_lesson_position, set_lesson_completed
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/course/{course_id}", response_model=CourseProgressResponse)
def get_course_progress(
    course_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    p = get_or_create_progress(db, user.id, course_id)
    return CourseProgressResponse(
        id=p.id,
        user_id=p.user_id,
        course_id=p.course_id,
        progress=p.progress or 0,
        completed_lessons=p.completed_lessons or {},
        positions=p.positions or {},
    )


@router.post("/course/{course_id}/position")
def update_lesson_position(
    course_id: str,
    data: SetLessonPosition,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    set_lesson_position(db, user.id, course_id, data.lesson_id, data.current_time)
    return {"ok": True}


@router.post("/course/{course_id}/completed")
def mark_lesson_completed(
    course_id: str,
    data: SetLessonCompleted,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    set_lesson_completed(db, user.id, course_id, data.lesson_id, data.total_lessons)
    return {"ok": True}
