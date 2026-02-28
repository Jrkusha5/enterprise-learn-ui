const STORAGE_KEY = 'learn-progress';
const NOTES_KEY = 'learn-notes';

export interface CourseProgress {
  progress: number;
  completedLessons: Record<string, boolean>;
  positions: Record<string, number>; // lessonId -> currentTime in seconds
}

export interface NoteItem {
  id: string;
  lessonId: string;
  courseId: string;
  content: string;
  timestamp: number; // video time in seconds
  createdAt: string; // ISO
}

function getProgress(): Record<string, CourseProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setProgress(data: Record<string, CourseProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCourseProgress(courseId: string): CourseProgress | null {
  return getProgress()[courseId] ?? null;
}

export function getLessonPosition(courseId: string, lessonId: string): number {
  const p = getProgress()[courseId];
  return p?.positions?.[lessonId] ?? 0;
}

export function setLessonPosition(courseId: string, lessonId: string, currentTime: number) {
  const data = getProgress();
  if (!data[courseId]) data[courseId] = { progress: 0, completedLessons: {}, positions: {} };
  data[courseId].positions[lessonId] = currentTime;
  setProgress(data);
}

export function setLessonCompleted(courseId: string, lessonId: string, totalLessons: number) {
  const data = getProgress();
  if (!data[courseId]) data[courseId] = { progress: 0, completedLessons: {}, positions: {} };
  data[courseId].completedLessons[lessonId] = true;
  const completed = Object.keys(data[courseId].completedLessons).length;
  data[courseId].progress = Math.round((completed / totalLessons) * 100);
  setProgress(data);
}

export function isLessonCompleted(courseId: string, lessonId: string): boolean {
  return getProgress()[courseId]?.completedLessons?.[lessonId] ?? false;
}

export function getCourseProgressPercent(courseId: string, totalLessons: number): number {
  const p = getProgress()[courseId];
  if (!p) return 0;
  return p.progress ?? Math.round((Object.keys(p.completedLessons || {}).length / totalLessons) * 100);
}

export function getMergedProgressForCourse(courseId: string, lessonIds: string[], defaultProgress?: number): { progress: number; completed: Record<string, boolean>; positions: Record<string, number> } {
  const p = getProgress()[courseId];
  const completed: Record<string, boolean> = {};
  const positions: Record<string, number> = {};
  lessonIds.forEach(id => {
    completed[id] = p?.completedLessons?.[id] ?? false;
    positions[id] = p?.positions?.[id] ?? 0;
  });
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = p?.progress ?? (defaultProgress ?? Math.round((completedCount / lessonIds.length) * 100));
  return { progress, completed, positions };
}

// Notes
function getNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setNotes(notes: NoteItem[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getNotesForLesson(courseId: string, lessonId: string): NoteItem[] {
  return getNotes().filter(n => n.courseId === courseId && n.lessonId === lessonId).sort((a, b) => a.timestamp - b.timestamp);
}

export function addNote(courseId: string, lessonId: string, content: string, timestamp: number): NoteItem {
  const notes = getNotes();
  const item: NoteItem = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    courseId,
    lessonId,
    content,
    timestamp,
    createdAt: new Date().toISOString(),
  };
  notes.push(item);
  setNotes(notes);
  return item;
}

export function deleteNote(noteId: string) {
  setNotes(getNotes().filter(n => n.id !== noteId));
}
