import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as enrollmentStorage from '../lib/enrollmentStorage';

const DEMO_SEED_COURSES = ['c-1', 'c-2', 'c-3', 'c-4'];

interface EnrollmentContextType {
  enrolledCourseIds: string[];
  isEnrolled: (courseId: string) => boolean;
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const [refresh, setRefresh] = useState(0);

  const enrolledCourseIds = useMemo(
    () => enrollmentStorage.getEnrolledCourseIds(userId),
    [userId, refresh]
  );

  useEffect(() => {
    if (userId) {
      const current = enrollmentStorage.getEnrolledCourseIds(userId);
      if (current.length === 0) {
        DEMO_SEED_COURSES.forEach(id => enrollmentStorage.enroll(userId, id));
        setRefresh(r => r + 1);
      }
    }
  }, [userId]);

  const enroll = useCallback((courseId: string) => {
    enrollmentStorage.enroll(userId, courseId);
    setRefresh(r => r + 1);
  }, [userId]);

  const unenroll = useCallback((courseId: string) => {
    enrollmentStorage.unenroll(userId, courseId);
    setRefresh(r => r + 1);
  }, [userId]);

  const value = useMemo(
    () => ({
      enrolledCourseIds,
      isEnrolled: (courseId: string) => enrolledCourseIds.includes(courseId),
      enroll,
      unenroll,
    }),
    [userId, enrolledCourseIds, enroll, unenroll]
  );

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (ctx === undefined) {
    throw new Error('useEnrollment must be used within EnrollmentProvider');
  }
  return ctx;
}
