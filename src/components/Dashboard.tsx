import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp, Clock, CheckCircle2, MoreVertical, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Role } from '../types';
import { CHART_DATA, MOCK_ACTIVITIES, MOCK_COURSES } from '../data/mock';
import { cn } from '../utils/cn';

const Dashboard: React.FC<{ role: Role }> = ({ role }) => {
  const stats = [
    { label: role === 'STUDENT' ? 'Enrolled Courses' : 'Total Students', value: '48', change: '+12%', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Active Progress', value: '75%', change: '+5%', icon: BookOpen, bg: 'bg-indigo-50', color: 'text-indigo-600' },
    { label: 'Hours Spent', value: '128', change: '+2%', icon: Clock, bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Certification', value: '12', change: '+18%', icon: GraduationCap, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back to your workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-emerald-600 text-xs font-bold">{stat.change}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
           <h3 className="font-bold text-slate-900 mb-6">Learning Analytics</h3>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="enrollment" stroke="#4f46e5" fill="#4f46e520" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-900"><span className="font-bold">{activity.user}</span> {activity.action}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;