import { User, Course, AnalyticsData } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  role: 'student',
  avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/student-profile-1-e114f209-1772004547190.webp',
};

export const instructors: User[] = [
  {
    id: 'inst-1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.w@lms.com',
    role: 'instructor',
    avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/instructor-profile-1-4edf3cc3-1772004546272.webp',
    bio: 'PhD in Computer Science, 10+ years experience in Full Stack Development.'
  }
];

export const courses: Course[] = [
  {
    id: 'c-1',
    title: 'Modern Web Development with React 19',
    instructorId: 'inst-1',
    instructorName: 'Dr. Sarah Wilson',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/web-dev-course-thumbnail-90e00274-1772004545998.webp',
    category: 'Development',
    rating: 4.8,
    studentsCount: 1240,
    duration: '24h 15m',
    progress: 45,
    description: 'Master the latest features of React 19, including Server Components, Actions, and enhanced hooks.',
    lessons: [
      { id: 'l-1', title: 'Introduction to React 19', duration: '10:00', completed: true },
      { id: 'l-2', title: 'New Hook: useActionState', duration: '15:30', completed: true },
      { id: 'l-3', title: 'Server Components Explained', duration: '20:00', completed: false },
      { id: 'l-4', title: 'Optimizing Performance', duration: '12:45', completed: false },
    ]
  },
  {
    id: 'c-2',
    title: 'Data Science & Machine Learning Bootcamp',
    instructorId: 'inst-2',
    instructorName: 'Prof. Michael Chen',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/data-science-thumbnail-70964fde-1772004551801.webp',
    category: 'Data Science',
    rating: 4.9,
    studentsCount: 850,
    duration: '45h 30m',
    progress: 10,
    description: 'A comprehensive guide to Python for Data Science, statistics, and machine learning algorithms.',
    lessons: [
      { id: 'l-5', title: 'Python Basics for Data Science', duration: '45:00', completed: true },
      { id: 'l-6', title: 'NumPy and Pandas Deep Dive', duration: '60:00', completed: false },
    ]
  },
  {
    id: 'c-3',
    title: 'UI/UX Design Masterclass 2024',
    instructorId: 'inst-3',
    instructorName: 'Emma Rodriguez',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/ui-ux-course-thumbnail-f889c017-1772004547305.webp',
    category: 'Design',
    rating: 4.7,
    studentsCount: 3200,
    duration: '18h 20m',
    progress: 0,
    description: 'Learn professional UI/UX design from scratch using Figma, Framer, and modern design principles.',
    lessons: [
      { id: 'l-7', title: 'Design Thinking Principles', duration: '15:00', completed: false },
      { id: 'l-8', title: 'Mastering Figma Components', duration: '35:00', completed: false },
    ]
  },
  {
    id: 'c-4',
    title: 'Strategic Business Management',
    instructorId: 'inst-4',
    instructorName: 'James Sterling',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/business-course-thumbnail-3b576928-1772004547408.webp',
    category: 'Business',
    rating: 4.6,
    studentsCount: 540,
    duration: '12h 45m',
    progress: 75,
    description: 'Learn how to lead teams, manage budgets, and execute business strategies effectively.',
    lessons: [
      { id: 'l-9', title: 'Leadership Styles', duration: '20:00', completed: true },
      { id: 'l-10', title: 'Financial Planning', duration: '40:00', completed: true },
    ]
  }
];

export const enrollmentStats: AnalyticsData[] = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const recentActivity = [
  { id: 1, type: 'course_completed', user: 'John Doe', item: 'React Basics', time: '2 hours ago' },
  { id: 2, type: 'new_enrollment', user: 'Jane Smith', item: 'UI/UX Design', time: '5 hours ago' },
  { id: 3, type: 'assignment_submitted', user: 'Mark Wilson', item: 'Machine Learning Quiz', time: '1 day ago' },
];

export const notifications = [
  { id: 1, title: 'New Course Available', message: 'Mastering TypeScript is now live!', time: '10m ago', unread: true },
  { id: 2, title: 'Assignment Graded', message: 'Your UI Design task was graded: A+', time: '2h ago', unread: true },
  { id: 3, title: 'Live Session', message: 'Q&A with Dr. Sarah starts in 30 mins.', time: '1d ago', unread: false },
];