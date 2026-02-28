import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { Skeleton } from './components/ui/skeleton';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Courses = lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const Management = lazy(() => import('./pages/Management').then(m => ({ default: m.Management })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Messages = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })));
const Calendar = lazy(() => import('./pages/Calendar').then(m => ({ default: m.Calendar })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const CoursesListing = lazy(() => import('./pages/CoursesListing').then(m => ({ default: m.CoursesListing })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })));

function PageFallback() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('student');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { user } = useAuth();

  const editCourseId = new URLSearchParams(location.search).get('edit');
  const openCourseId = new URLSearchParams(location.search).get('course');

  // When URL has ?edit=id, switch to courses tab
  useEffect(() => {
    if (editCourseId) setActiveTab('courses');
  }, [editCourseId]);

  // When URL has ?course=id, open course player (for enrolled students)
  useEffect(() => {
    if (openCourseId && location.pathname === '/dashboard') {
      setActiveTab('courses');
      setSelectedCourseId(openCourseId);
    }
  }, [openCourseId, location.pathname]);

  // Update role when user changes
  React.useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const renderContent = () => {
    if (selectedCourseId) {
      return (
        <CoursePlayer 
          courseId={selectedCourseId} 
          onBack={() => setSelectedCourseId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={role as any} onSelectCourse={(id) => setSelectedCourseId(id)} />;
      case 'courses':
        return (
          <Courses
            role={role as any}
            onSelectCourse={(id) => setSelectedCourseId(id)}
            editCourseId={editCourseId ?? undefined}
            onClearEditId={() => navigate(location.pathname, { replace: true })}
          />
        );
      case 'students':
      case 'instructors':
        return <Management role={role as any} />;
      case 'analytics':
        return <Analytics />;
      case 'messages':
        return <Messages />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
                <span className="text-3xl">🏗️</span>
             </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-900">Feature Under Development</h2>
               <p className="text-gray-500 max-w-sm mx-auto">We're working hard to bring the {activeTab} page to life. Stay tuned!</p>
             </div>
             <button 
               onClick={() => setActiveTab('dashboard')}
               className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100"
             >
               Go Back Home
             </button>
          </div>
        );
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setSelectedCourseId(null);
    setActiveTab('dashboard');
    toast.success(`Switched to ${newRole} view`);
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Landing Page - Default Route */}
        <Route path="/" element={<Suspense fallback={<PageFallback />}><Landing /></Suspense>} />

        {/* Public Routes */}
        <Route path="/courses" element={<Suspense fallback={<PageFallback />}><CoursesListing /></Suspense>} />
        <Route path="/courses/:id" element={<Suspense fallback={<PageFallback />}><CourseDetail /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<PageFallback />}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageFallback />}><Register /></Suspense>} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedCourseId(null);
                }}
                role={role as any}
                setRole={handleRoleChange as any}
              >
                <Suspense fallback={<PageFallback />}>
                  {renderContent()}
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
