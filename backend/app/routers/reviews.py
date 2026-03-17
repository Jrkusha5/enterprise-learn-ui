"""Review routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from app.controllers.review_controller import get_by_id, list_by_course, create_review, update_review, delete_review
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/course/{course_id}", response_model=list[ReviewResponse])
def list_reviews(course_id: str, db: Session = Depends(get_db)):
    return list_by_course(db, course_id)


@router.post("", response_model=ReviewResponse, status_code=201)
def create_review_route(data: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    review = create_review(db, user.id, data)
    loaded = get_by_id(db, review.id)
    from app.controllers.review_controller import to_response
    return to_response(loaded)


@router.patch("/{review_id}", response_model=ReviewResponse)
def update_review_route(
    review_id: str,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from app.controllers.review_controller import to_response
    review = get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your review")
    update_review(db, review, data)
    return to_response(get_by_id(db, review_id))


@router.delete("/{review_id}", status_code=204)
def delete_review_route(review_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    review = get_by_id(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your review")
    delete_review(db, review)
