import React, { createContext, useContext, useState, useMemo } from 'react';
import { Course } from '../types';
import { courses as initialCourses } from '../data/mockData';

interface CoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'> & { id?: string }) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  isCustomCourse: (id: string) => boolean;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const STORAGE_KEY = 'learn-custom-courses';

function loadCustomCourses(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomCourses(courses: Course[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customCourses, setCustomCourses] = useState<Course[]>(loadCustomCourses);

  const courses = useMemo(() => [...initialCourses, ...customCourses], [customCourses]);

  const addCourse = (input: Omit<Course, 'id'> & { id?: string }) => {
    const id = input.id ?? `custom-${Date.now()}`;
    const lessons = input.chapters?.length
      ? input.chapters.flatMap(c => c.lessons)
      : (input.lessons ?? []);
    const newCourse: Course = {
      ...input,
      id,
      title: input.title,
      instructorName: input.instructorName ?? 'Instructor',
      thumbnail: input.thumbnail ?? 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/web-dev-course-thumbnail-90e00274-1772004545998.webp',
      category: input.category ?? 'Development',
      rating: input.rating ?? 4.5,
      studentsCount: input.studentsCount ?? 0,
      duration: input.duration ?? '0h',
      description: input.description ?? '',
      chapters: input.chapters,
      lessons,
    };
    setCustomCourses(prev => {
      const next = [...prev, newCourse];
      saveCustomCourses(next);
      return next;
    });
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCustomCourses(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updates } : c));
      saveCustomCourses(next);
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCustomCourses(prev => {
      const next = prev.filter(c => c.id !== id);
      saveCustomCourses(next);
      return next;
    });
  };

  const isCustomCourse = (id: string) => customCourses.some(c => c.id === id);

  const value = useMemo(
    () => ({ courses, addCourse, updateCourse, deleteCourse, isCustomCourse }),
    [courses, customCourses]
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (ctx === undefined) throw new Error('useCourses must be used within CoursesProvider');
  return ctx;
}
