"""Course controller: CRUD and response building."""
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional, Dict

from app.models.course import Course, Chapter, Lesson, LessonResource
from app.models.review import Review
from app.models.user import User
from app.models.course_progress import CourseProgress
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    ChapterCreate,
    LessonCreate,
    CourseListResponse,
    ChapterResponse,
    LessonResponse,
    LessonResourceResponse,
)
from app.schemas.review import ReviewResponse


def _lesson_to_response(lesson: Lesson, completed_map: Optional[Dict[str, bool]] = None) -> LessonResponse:
    completed = (completed_map or {}).get(lesson.id, False)
    return LessonResponse(
        id=lesson.id,
        title=lesson.title,
        duration=lesson.duration,
        video_url=lesson.video_url,
        content=lesson.content,
        free_preview=lesson.free_preview or False,
        completed=completed,
        resources=[LessonResourceResponse(id=r.id, name=r.name, url=r.url, type=r.type) for r in (lesson.resources or [])],
    )


def _chapter_to_response(chapter: Chapter, completed_map: Optional[Dict[str, bool]] = None) -> ChapterResponse:
    return ChapterResponse(
        id=chapter.id,
        title=chapter.title,
        lessons=[_lesson_to_response(l, completed_map) for l in chapter.lessons],
    )


def _course_to_list_response(
    course: Course,
    instructor: Optional[User],
    completed_map: Optional[Dict[str, bool]] = None,
    progress_percent: Optional[int] = None,
    include_reviews: bool = False,
) -> CourseListResponse:
    lessons_flat = []
    chapters_data = []
    for ch in course.chapters or []:
        ch_resp = _chapter_to_response(ch, completed_map)
        chapters_data.append(ch_resp)
        lessons_flat.extend(ch_resp.lessons)
    reviews_data = None
    if include_reviews and course.reviews:
        reviews_data = [
            ReviewResponse(
                id=r.id,
                user_id=r.user_id,
                user_name=r.user.name if r.user else "",
                user_avatar=r.user.avatar if r.user else None,
                course_id=r.course_id,
                rating=r.rating,
                comment=r.comment or "",
                date=r.date or (r.created_at.isoformat() if r.created_at else None),
            )
            for r in course.reviews
        ]
    return CourseListResponse(
        id=course.id,
        title=course.title,
        instructor_id=course.instructor_id,
        instructor_name=instructor.name if instructor else "",
        instructor_avatar=instructor.avatar if instructor else None,
        instructor_bio=instructor.bio if instructor else None,
        thumbnail=course.thumbnail,
        category=course.category,
        rating=course.rating or 0,
        students_count=course.students_count or 0,
        duration=course.duration,
        description=course.description,
        price=course.price,
        learning_outcomes=course.learning_outcomes,
        progress=progress_percent,
        lessons=lessons_flat,
        chapters=chapters_data,
        reviews=reviews_data,
    )


def get_course_by_id(db: Session, course_id: str, load_chapters: bool = True) -> Optional[Course]:
    q = db.query(Course).filter(Course.id == course_id)
    if load_chapters:
        q = q.options(
            joinedload(Course.instructor),
            joinedload(Course.chapters).joinedload(Chapter.lessons).joinedload(Lesson.resources),
            joinedload(Course.reviews).joinedload(Review.user),
        )
    return q.first()


def list_courses(
    db: Session,
    category: Optional[str] = None,
    user_id: Optional[str] = None,
) -> List[CourseListResponse]:
    q = db.query(Course).options(
        joinedload(Course.instructor),
        joinedload(Course.chapters).joinedload(Chapter.lessons).joinedload(Lesson.resources),
    )
    if category:
        q = q.filter(Course.category == category)
    courses = q.all()
    progress_map = {}
    if user_id:
        progresses = db.query(CourseProgress).filter(CourseProgress.user_id == user_id).all()
        progress_map = {p.course_id: (p.progress, p.completed_lessons or {}) for p in progresses}
    result = []
    for c in courses:
        prog, completed = progress_map.get(c.id, (None, {}))
        result.append(_course_to_list_response(c, c.instructor, completed, prog, include_reviews=False))
    return result


def get_course_detail(db: Session, course_id: str, user_id: Optional[str] = None) -> Optional[CourseListResponse]:
    course = get_course_by_id(db, course_id)
    if not course:
        return None
    progress_data = None
    completed_map = {}
    if user_id:
        p = db.query(CourseProgress).filter(CourseProgress.user_id == user_id, CourseProgress.course_id == course_id).first()
        if p:
            progress_data = p.progress
            completed_map = p.completed_lessons or {}
    resp = _course_to_list_response(
        course,
        course.instructor,
        completed_map,
        progress_data,
        include_reviews=True,
    )
    return resp


def create_course(db: Session, data: CourseCreate) -> Course:
    course = Course(
        title=data.title,
        instructor_id=data.instructor_id,
        thumbnail=data.thumbnail,
        category=data.category,
        description=data.description,
        price=data.price,
        learning_outcomes=data.learning_outcomes,
        includes=data.includes,
        duration=data.duration,
    )
    db.add(course)
    db.flush()
    if data.chapters:
        for idx, ch_data in enumerate(data.chapters):
            ch = Chapter(course_id=course.id, title=ch_data.title, order_index=idx)
            db.add(ch)
            db.flush()
            if ch_data.lessons:
                for lidx, les in enumerate(ch_data.lessons):
                    lesson = Lesson(
                        chapter_id=ch.id,
                        title=les.title,
                        duration=les.duration,
                        video_url=les.video_url,
                        content=les.content,
                        free_preview=les.free_preview,
                        order_index=lidx,
                    )
                    db.add(lesson)
                    db.flush()
                    if les.resources:
                        for r in les.resources:
                            res = LessonResource(lesson_id=lesson.id, name=r.name, url=r.url, type=r.type)
                            db.add(res)
    db.commit()
    db.refresh(course)
    return course


def update_course(db: Session, course: Course, data: CourseUpdate) -> Course:
    if data.title is not None:
        course.title = data.title
    if data.instructor_id is not None:
        course.instructor_id = data.instructor_id
    if data.thumbnail is not None:
        course.thumbnail = data.thumbnail
    if data.category is not None:
        course.category = data.category
    if data.description is not None:
        course.description = data.description
    if data.price is not None:
        course.price = data.price
    if data.learning_outcomes is not None:
        course.learning_outcomes = data.learning_outcomes
    if data.includes is not None:
        course.includes = data.includes
    if data.duration is not None:
        course.duration = data.duration
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course: Course) -> None:
    db.delete(course)
    db.commit()
