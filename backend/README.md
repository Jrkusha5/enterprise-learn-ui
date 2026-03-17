# Enterprise Learn API (FastAPI + PostgreSQL)

Backend for the Enterprise Learn UI. Provides REST API for users, courses, chapters, lessons, reviews, messages, activities, enrollments, progress, and notes.

## Setup

1. **Python 3.10+** and **PostgreSQL** installed.

2. Create a database:
   ```bash
   createdb enterprise_learn
   ```

3. Create a virtualenv and install dependencies:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and set `DATABASE_URL` (and optionally `SECRET_KEY`, `CORS_ORIGINS`).

5. Run migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the server:
   ```bash
   uvicorn app.main:app --reload --app-dir .
   ```
   Or from project root:
   ```bash
   uvicorn app.main:app --reload --app-dir backend
   ```
   API: http://localhost:8000  
   Docs: http://localhost:8000/docs

## API Overview

| Area | Prefix | Auth |
|------|--------|------|
| Auth | `/api/auth` | register/login public; `/me` requires Bearer |
| Users | `/api/users` | `/me`, `PATCH /me`, `GET /{id}` |
| Courses | `/api/courses` | GET list/detail public; POST/PATCH/DELETE require auth |
| Reviews | `/api/reviews` | GET by course public; POST/PATCH/DELETE require auth |
| Messages | `/api/messages` | All require auth |
| Activities | `/api/activities` | GET public; POST optional auth |
| Enrollments | `/api/enrollments` | All require auth |
| Progress | `/api/progress` | All require auth |
| Notes | `/api/notes` | All require auth |

Auth: send `Authorization: Bearer <token>` for protected routes. Token returned from `POST /api/auth/login` or `POST /api/auth/register`.

## Project layout

- `app/main.py` – FastAPI app, CORS, router includes
- `app/config.py` – Settings from env
- `app/database.py` – Engine, session, `get_db`
- `app/auth.py` – JWT and password hashing
- `app/dependencies.py` – `get_current_user`, `get_current_user_optional`
- `app/models/` – SQLAlchemy models (User, Course, Chapter, Lesson, LessonResource, Review, Message, Activity, Enrollment, CourseProgress, Note)
- `app/schemas/` – Pydantic request/response schemas
- `app/controllers/` – Business logic (CRUD, response building)
- `app/routers/` – Route handlers
- `alembic/` – Migrations; `alembic upgrade head` to apply
