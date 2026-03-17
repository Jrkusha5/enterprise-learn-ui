"""FastAPI application entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, users, courses, reviews, messages, activities, enrollments, progress, notes

app = FastAPI(title="Enterprise Learn API", description="Backend API for Enterprise Learn LMS", version="1.0.0")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS else ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(activities.router, prefix="/api")
app.include_router(enrollments.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(notes.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Enterprise Learn API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
