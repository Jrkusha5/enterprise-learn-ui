"""Auth routes: login, register, me."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import verify_password, create_access_token
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.controllers.user_controller import get_by_email, create_user, to_response
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if get_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, data)
    token = create_access_token(data={"sub": user.id})
    return Token(access_token=token, user=to_response(user))


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = get_by_email(db, data.email)
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={"sub": user.id})
    return Token(access_token=token, user=to_response(user))


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return to_response(user)
