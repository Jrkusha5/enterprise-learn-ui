import React, { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CoursePlayer } from './pages/CoursePlayer';
import { Management } from './pages/Management';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';
import { UserRole } from './types';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('student');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
        return <Dashboard role={role as any} />;
      case 'courses':
        return <Courses onSelectCourse={(id) => setSelectedCourseId(id)} />;
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
                <span className="text-3xl">\ud83c\udfd7\ufe0f</span>
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
      <Layout 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedCourseId(null);
        }} 
        role={role as any}
        setRole={handleRoleChange as any}
      >
        {renderContent()}
      </Layout>
    </>
  );
}