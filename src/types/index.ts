export type UserRole = 'admin' | 'instructor' | 'student' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructorId?: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorBio?: string;
  thumbnail: string;
  category: string;
  rating: number;
  studentsCount: number;
  duration: string;
  lessons: Lesson[];
  chapters?: Chapter[];
  progress?: number;
  description: string;
  price?: number;
  learningOutcomes?: string[];
  videoLessonsCount?: number;
  includes?: {
    videoLessons?: number;
    hoursOfContent?: string;
    certificate?: boolean;
    downloadableResources?: boolean;
    quizzes?: boolean;
  };
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
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
  senderName?: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isMe?: boolean;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
}

// Alias for backwards compatibility with some components
export type Role = UserRole;