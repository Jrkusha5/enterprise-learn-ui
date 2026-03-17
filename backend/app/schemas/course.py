"""Course, Chapter, Lesson schemas."""
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel


class LessonResourceBase(BaseModel):
    name: str
    url: str
    type: Optional[str] = None


class LessonResourceCreate(LessonResourceBase):
    pass


class LessonResourceResponse(LessonResourceBase):
    id: str

    class Config:
        from_attributes = True


class LessonBase(BaseModel):
    title: str
    duration: Optional[str] = None
    video_url: Optional[str] = None
    content: Optional[str] = None
    free_preview: bool = False


class LessonCreate(LessonBase):
    resources: Optional[List[LessonResourceCreate]] = None


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    duration: Optional[str] = None
    video_url: Optional[str] = None
    content: Optional[str] = None
    free_preview: Optional[bool] = None


class LessonResponse(LessonBase):
    id: str
    completed: bool = False  # set by API from progress when user context present
    resources: Optional[List[LessonResourceResponse]] = None

    class Config:
        from_attributes = True


class ChapterBase(BaseModel):
    title: str


class ChapterCreate(ChapterBase):
    lessons: Optional[List[LessonCreate]] = None


class ChapterUpdate(BaseModel):
    title: Optional[str] = None


class ChapterResponse(ChapterBase):
    id: str
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True


class CourseIncludes(BaseModel):
    video_lessons: Optional[int] = None
    hours_of_content: Optional[str] = None
    certificate: Optional[bool] = None
    downloadable_resources: Optional[bool] = None
    quizzes: Optional[bool] = None


class CourseBase(BaseModel):
    title: str
    thumbnail: Optional[str] = None
    category: str = "Development"
    description: Optional[str] = None
    price: Optional[float] = None
    learning_outcomes: Optional[List[str]] = None
    includes: Optional[dict] = None
    duration: Optional[str] = None


class CourseCreate(CourseBase):
    instructor_id: Optional[str] = None
    chapters: Optional[List[ChapterCreate]] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    instructor_id: Optional[str] = None
    thumbnail: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    learning_outcomes: Optional[List[str]] = None
    includes: Optional[dict] = None
    duration: Optional[str] = None


class CourseListResponse(BaseModel):
    id: str
    title: str
    instructor_id: Optional[str] = None
    instructor_name: str = ""
    instructor_avatar: Optional[str] = None
    instructor_bio: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str
    rating: float
    students_count: int
    duration: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    learning_outcomes: Optional[List[str]] = None
    progress: Optional[int] = None
    lessons: List[LessonResponse] = []
    chapters: Optional[List[ChapterResponse]] = None
    reviews: Optional[List[Any]] = None

    class Config:
        from_attributes = True


class CourseDetailResponse(CourseListResponse):
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
