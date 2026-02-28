import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  FileQuestion,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'] },
    { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'] },
    { id: 'quizzes', label: 'Quizzes', icon: FileQuestion, roles: ['INSTRUCTOR', 'STUDENT'] },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, roles: ['INSTRUCTOR', 'STUDENT'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['ADMIN', 'INSTRUCTOR'] },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap, roles: ['ADMIN'] },
    { id: 'messages', label: 'Messages', icon: MessageSquare, roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'] },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['ADMIN', 'INSTRUCTOR'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[60] bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={cn(
        "h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed left-0 top-0 z-50 overflow-y-auto scrollbar-hide",
        collapsed ? "w-20" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
                <GraduationCap size={24} />
              </div>
              <span className="tracking-tight">ZappaLMS</span>
            </div>
          )}
          {collapsed && (
            <div className="bg-indigo-600 text-white p-2 rounded-lg mx-auto">
              <GraduationCap size={24} />
            </div>
          )}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all",
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                collapsed && "justify-center"
              )}
            >
              <item.icon size={22} className={activeTab === item.id ? "text-white" : "text-slate-400"} />
              {!collapsed && <span className="font-bold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full hidden md:flex items-center justify-center p-3 rounded-2xl hover:bg-slate-50 text-slate-400"
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest"><ChevronLeft size={16} /> Minimize</div>}
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all",
            collapsed && "justify-center"
          )}>
            <LogOut size={22} />
            {!collapsed && <span className="font-bold text-sm">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;