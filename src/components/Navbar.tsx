import React, { useState } from 'react';
import { Search, Bell, Mail, ChevronDown, Clock, User, CheckCircle2 } from 'lucide-react';
import { Role, User as UserType } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mock';
import { cn } from '../utils/cn';

interface NavbarProps {
  role: Role;
  setRole: (role: Role) => void;
  user: UserType;
}

const Navbar: React.FC<NavbarProps> = ({ role, setRole, user }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => { setShowRoleMenu(!showRoleMenu); setShowNotifications(false); setShowProfileMenu(false); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100"
          >
            {role} <ChevronDown size={14} />
          </button>
          {showRoleMenu && (
            <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              {(['ADMIN', 'INSTRUCTOR', 'STUDENT'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setShowRoleMenu(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-slate-50",
                    role === r ? "text-indigo-600 font-bold" : "text-slate-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
            <Mail size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
            {showNotifications && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between"><h4 className="font-bold">Notifications</h4></div>
                <div className="max-h-80 overflow-y-auto">
                   {MOCK_NOTIFICATIONS.map(n => (
                     <div key={n.id} className="px-6 py-4 border-b border-slate-50 hover:bg-slate-50">
                       <p className="text-sm font-bold">{n.title}</p>
                       <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50">
            <img src={user.avatar} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-50" />
          </button>
          {showProfileMenu && (
             <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
               <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Sign out</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;