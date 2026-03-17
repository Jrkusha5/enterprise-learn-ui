"""Review controller."""
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.models.review import Review
from app.models.course import Course
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse


def get_by_id(db: Session, review_id: str) -> Review | None:
    return db.query(Review).options(joinedload(Review.user)).filter(Review.id == review_id).first()


def list_by_course(db: Session, course_id: str) -> List[ReviewResponse]:
    reviews = db.query(Review).options(joinedload(Review.user)).filter(Review.course_id == course_id).all()
    return [
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
        for r in reviews
    ]


def create_review(db: Session, user_id: str, data: ReviewCreate) -> Review:
    review = Review(
        course_id=data.course_id,
        user_id=user_id,
        rating=data.rating,
        comment=data.comment,
        date=datetime.utcnow().isoformat(),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    # Update course rating (average)
    course = db.query(Course).filter(Course.id == data.course_id).first()
    if course:
        from sqlalchemy import func
        avg = db.query(func.avg(Review.rating)).filter(Review.course_id == course.id).scalar()
        if avg is not None:
            course.rating = round(float(avg), 1)
            db.commit()
    return review


def to_response(review: Review) -> ReviewResponse:
    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        user_name=review.user.name if review.user else "",
        user_avatar=review.user.avatar if review.user else None,
        course_id=review.course_id,
        rating=review.rating,
        comment=review.comment or "",
        date=review.date or (review.created_at.isoformat() if review.created_at else None),
    )


def update_review(db: Session, review: Review, data: ReviewUpdate) -> Review:
    if data.rating is not None:
        review.rating = data.rating
    if data.comment is not None:
        review.comment = data.comment
    db.commit()
    db.refresh(review)
    return review


def delete_review(db: Session, review: Review) -> None:
    db.delete(review)
    db.commit()
