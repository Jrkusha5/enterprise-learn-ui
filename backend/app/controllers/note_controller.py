"""Note controller."""
from sqlalchemy.orm import Session
from typing import List

from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse


def get_by_id(db: Session, note_id: str) -> Note | None:
    return db.query(Note).filter(Note.id == note_id).first()


def list_for_lesson(db: Session, user_id: str, course_id: str, lesson_id: str) -> List[NoteResponse]:
    notes = (
        db.query(Note)
        .filter(Note.user_id == user_id, Note.course_id == course_id, Note.lesson_id == lesson_id)
        .order_by(Note.timestamp)
        .all()
    )
    return [
        NoteResponse(
            id=n.id,
            lesson_id=n.lesson_id,
            course_id=n.course_id,
            content=n.content,
            timestamp=n.timestamp,
            created_at=n.created_at.isoformat() if n.created_at else None,
        )
        for n in notes
    ]


def create_note(db: Session, user_id: str, data: NoteCreate) -> Note:
    note = Note(
        user_id=user_id,
        lesson_id=data.lesson_id,
        course_id=data.course_id,
        content=data.content,
        timestamp=data.timestamp,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, note: Note, data: NoteUpdate) -> Note:
    if data.content is not None:
        note.content = data.content
    if data.timestamp is not None:
        note.timestamp = data.timestamp
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note: Note) -> None:
    db.delete(note)
    db.commit()


def to_response(note: Note) -> NoteResponse:
    return NoteResponse(
        id=note.id,
        lesson_id=note.lesson_id,
        course_id=note.course_id,
        content=note.content,
        timestamp=note.timestamp,
        created_at=note.created_at.isoformat() if note.created_at else None,
    )
