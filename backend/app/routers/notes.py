"""Note routes."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.controllers.note_controller import get_by_id, list_for_lesson, create_note, update_note, delete_note, to_response
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteResponse])
def get_notes(
    course_id: str = Query(...),
    lesson_id: str = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return list_for_lesson(db, user.id, course_id, lesson_id)


@router.post("", response_model=NoteResponse, status_code=201)
def create_note_route(data: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = create_note(db, user.id, data)
    return to_response(note)


@router.patch("/{note_id}", response_model=NoteResponse)
def update_note_route(
    note_id: str,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    note = get_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your note")
    update_note(db, note, data)
    return to_response(note)


@router.delete("/{note_id}", status_code=204)
def delete_note_route(note_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = get_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if note.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not your note")
    delete_note(db, note)
