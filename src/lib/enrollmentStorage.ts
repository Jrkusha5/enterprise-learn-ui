const STORAGE_KEY = 'learn-enrollments';

function getEnrollments(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setEnrollments(data: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getEnrolledCourseIds(userId: string): string[] {
  return getEnrollments()[userId] ?? [];
}

export function isEnrolled(userId: string, courseId: string): boolean {
  return getEnrolledCourseIds(userId).includes(courseId);
}

export function enroll(userId: string, courseId: string): void {
  const data = getEnrollments();
  if (!data[userId]) data[userId] = [];
  if (!data[userId].includes(courseId)) {
    data[userId].push(courseId);
    setEnrollments(data);
  }
}

export function unenroll(userId: string, courseId: string): void {
  const data = getEnrollments();
  if (data[userId]) {
    data[userId] = data[userId].filter(id => id !== courseId);
    setEnrollments(data);
  }
}
