import { Role, Course, Message, Activity, User } from '../types';

export const MOCK_USER: { [key in 'ADMIN' | 'INSTRUCTOR' | 'STUDENT']: User } = {
  ADMIN: {
    id: '1',
    name: 'Sarah Connor',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    email: 'sarah.admin@eduflow.com'
  },
  INSTRUCTOR: {
    id: '2',
    name: 'Dr. Alan Grant',
    role: 'INSTRUCTOR',
    avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/instructor-2-41bcd1f1-1772004210888.webp',
    email: 'alan.grant@eduflow.com'
  },
  STUDENT: {
    id: '3',
    name: 'Alex Rivera',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    email: 'alex.rivera@eduflow.com'
  }
};

export const MOCK_STUDENTS: User[] = [
  { id: 's1', name: 'Alex Rivera', role: 'STUDENT', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?u=s1' },
  { id: 's2', name: 'Jordan Lee', role: 'STUDENT', email: 'jordan@example.com', avatar: 'https://i.pravatar.cc/150?u=s2' },
  { id: 's3', name: 'Casey Montgomery', role: 'STUDENT', email: 'casey@example.com', avatar: 'https://i.pravatar.cc/150?u=s3' },
  { id: 's4', name: 'Taylor Swift', role: 'STUDENT', email: 'taylor@example.com', avatar: 'https://i.pravatar.cc/150?u=s4' },
];

export const MOCK_INSTRUCTORS: User[] = [
  { id: 'i1', name: 'Dr. Alan Grant', role: 'INSTRUCTOR', email: 'alan@eduflow.com', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/instructor-2-41bcd1f1-1772004210888.webp' },
  { id: 'i2', name: 'Emma Wilson', role: 'INSTRUCTOR', email: 'emma@eduflow.com', avatar: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/instructor-1-8fae3890-1772004212531.webp' },
];

export const MOCK_ASSIGNMENTS = [
  { id: 'a1', title: 'React Hooks Deep Dive', course: 'Mastering React 19', dueDate: 'Oct 25, 2024', status: 'Pending', score: '-' },
  { id: 'a2', title: 'Data Cleaning Project', course: 'Data Science with Python', dueDate: 'Oct 28, 2024', status: 'Submitted', score: '95/100' },
  { id: 'a3', title: 'User Persona Research', course: 'UI/UX Design Masterclass', dueDate: 'Nov 02, 2024', status: 'In Progress', score: '-' },
];

export const MOCK_QUIZZES = [
  { id: 'q1', title: 'Fundamentals of React', questions: 10, time: '15 mins', status: 'Available' },
  { id: 'q2', title: 'Python Syntax Basics', questions: 20, time: '30 mins', status: 'Completed' },
  { id: 'q3', title: 'Color Theory & UI', questions: 15, time: '20 mins', status: 'Locked' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Course Available', message: 'Mastering AI with Python is now live!', time: '1 hour ago', unread: true },
  { id: 'n2', title: 'Assignment Graded', message: 'Your "Data Cleaning" assignment has been graded.', time: '3 hours ago', unread: true },
  { id: 'n3', title: 'Live Session Starting', message: 'Join Dr. Grant for a live Q&A in 30 mins.', time: '5 hours ago', unread: false },
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mastering React 19 & Next.js 15',
    instructorName: 'John Doe',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/course-thumbnail-1-010651c5-1772004211513.webp',
    progress: 45,
    category: 'Development',
    studentsCount: 1240,
    rating: 4.8,
    price: 89.99,
    duration: '24h 15m',
    description: 'Learn the latest features of React 19 including Server Components, Actions, and more.',
    lessons: [
      { id: 'l1', title: 'Introduction to React 19', duration: '10:00', completed: true, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', content: 'Welcome to the course!' },
      { id: 'l2', title: 'Understanding Server Components', duration: '15:30', completed: true, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', content: 'Deep dive into RSCs.' },
      { id: 'l3', title: 'Client Actions & Forms', duration: '22:15', completed: false, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', content: 'Managing state with actions.' },
    ]
  },
  {
    id: '2',
    title: 'Data Science with Python',
    instructorName: 'Sarah Smith',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/course-thumbnail-2-45fb37a8-1772004209540.webp',
    progress: 12,
    category: 'Data Science',
    studentsCount: 850,
    rating: 4.9,
    price: 99.99,
    duration: '35h 20m',
    description: 'Comprehensive guide to data analysis, visualization, and machine learning.',
    lessons: [
      { id: 'l4', title: 'Pandas Fundamentals', duration: '12:00', completed: true, videoUrl: '', content: '' },
      { id: 'l5', title: 'Data Cleaning 101', duration: '18:45', completed: false, videoUrl: '', content: '' },
    ]
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    instructorName: 'Emma Wilson',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/course-thumbnail-3-7ee80af6-1772004210672.webp',
    progress: 0,
    category: 'Design',
    studentsCount: 2100,
    rating: 4.7,
    price: 75.00,
    duration: '18h 45m',
    description: 'Learn Figma, design systems, and user testing from industry experts.',
    lessons: []
  },
  {
    id: '4',
    title: 'Business Strategy & Growth',
    instructorName: 'Marcus Aurelius',
    thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/course-thumbnail-4-177cf377-1772004211417.webp',
    progress: 80,
    category: 'Business',
    studentsCount: 540,
    rating: 4.6,
    price: 120.00,
    duration: '12h 10m',
    description: 'Scaling your startup to the next level with proven frameworks.',
    lessons: []
  }
];

export const MOCK_MESSAGES: Message[] = [
  { id: '1', senderId: '2', receiverId: '3', senderName: 'Dr. Alan Grant', senderAvatar: MOCK_USER.INSTRUCTOR.avatar, content: 'Hello! How is your progress on the React course?', timestamp: '10:30 AM', isMe: false, isRead: true },
  { id: '2', senderId: '3', receiverId: '2', senderName: 'Alex Rivera', senderAvatar: MOCK_USER.STUDENT.avatar, content: 'Hi Professor! It is going great. I just finished the RSC section.', timestamp: '10:35 AM', isMe: true, isRead: true },
  { id: '3', senderId: '2', receiverId: '3', senderName: 'Dr. Alan Grant', senderAvatar: MOCK_USER.INSTRUCTOR.avatar, content: 'Excellent. Make sure to try the assignment.', timestamp: '10:40 AM', isMe: false, isRead: true },
];

export const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', user: 'Alex Rivera', action: 'completed', target: 'Understanding Server Components', time: '2 hours ago' },
  { id: '2', user: 'Emma Wilson', action: 'added a new lecture', target: 'Figma Auto-layout', time: '4 hours ago' },
  { id: '3', user: 'John Doe', action: 'responded to', target: 'Course Discussion', time: '5 hours ago' },
];

export const CHART_DATA = [
  { name: 'Mon', completion: 400, enrollment: 240, revenue: 1200 },
  { name: 'Tue', completion: 300, enrollment: 139, revenue: 2100 },
  { name: 'Wed', completion: 200, enrollment: 980, revenue: 1800 },
  { name: 'Thu', completion: 278, enrollment: 390, revenue: 3400 },
  { name: 'Fri', completion: 189, enrollment: 480, revenue: 4200 },
  { name: 'Sat', completion: 239, enrollment: 380, revenue: 2500 },
  { name: 'Sun', completion: 349, enrollment: 430, revenue: 3900 },
];