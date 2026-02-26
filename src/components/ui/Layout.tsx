import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronDown,
  User as UserIcon,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../contexts/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'admin' | 'instructor' | 'student';
  setRole: (role: 'admin' | 'instructor' | 'student') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, setRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'instructor', 'student'] },
    { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['admin', 'instructor', 'student'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'instructor'] },
    { id: 'instructors', label: 'Instructors', icon: ShieldCheck, roles: ['admin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'instructor'] },
    { id: 'messages', label: 'Messages', icon: MessageSquare, roles: ['admin', 'instructor', 'student'] },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['admin', 'instructor', 'student'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'instructor', 'student'] },
  ].filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-indigo-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg">
            <GraduationCap className="w-6 h-6 text-indigo-900" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">EduFlow</span>}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-colors group",
                activeTab === item.id 
                  ? "bg-white/10 text-white" 
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-6 h-6 shrink-0", activeTab === item.id ? "text-white" : "text-indigo-300")} />
              {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800/50">
           <button 
             onClick={() => setRole(role === 'student' ? 'instructor' : role === 'instructor' ? 'admin' : 'student')}
             className="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-indigo-300 hover:bg-white/5 text-sm"
           >
             <ShieldCheck className="w-5 h-5 shrink-0" />
             {isSidebarOpen && <span>Switch Role: {role}</span>}
           </button>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 mt-2"
           >
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:flex hidden"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <div className="relative max-w-md w-full lg:flex hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search courses, lessons, students..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className="p-2 hover:bg-gray-100 rounded-full relative"
               >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 z-50">
                   <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                     <h3 className="font-semibold">Notifications</h3>
                     <button className="text-xs text-indigo-600 hover:underline">Mark all read</button>
                   </div>
                   <div className="max-h-80 overflow-y-auto">
                     {[1, 2, 3].map((n) => (
                       <div key={n} className="p-4 hover:bg-indigo-50/50 cursor-pointer border-b border-gray-50 last:border-0">
                         <p className="text-sm font-medium text-gray-800">New assignment submitted</p>
                         <p className="text-xs text-gray-500 mt-0.5">John Doe uploaded 'Final Project.pdf'</p>
                         <p className="text-[10px] text-gray-400 mt-2">2 minutes ago</p>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>

            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-colors"
              >
                <img 
                  src={user?.avatar || "https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/student-profile-1-e114f209-1772004547190.webp"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="text-left hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                    <UserIcon className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="h-px bg-gray-50 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};