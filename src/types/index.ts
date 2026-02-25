export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  category: string;
  rating: number;
  studentsCount: number;
  duration: string;
  lessons: Lesson[];
  progress?: number;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  content?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface AnalyticsData {
  name: string;
  value: number;
}