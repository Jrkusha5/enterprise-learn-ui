import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  Calendar as CalendarIcon
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { enrollmentStats, recentActivity, courses } from '../data/mockData';
import { UserRole } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export const Dashboard = ({ role }: { role: UserRole }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {role === 'admin' ? 'System Overview' : role === 'instructor' ? 'Instructor Dashboard' : 'Welcome back, Alex!'}
          </h1>
          <p className="text-gray-500">Here's what's happening with your learning ecosystem today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4" />
            <span>Last 30 Days</span>
          </button>
          {role !== 'student' && (
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-sm">
              Generate Report
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {role === 'admin' ? (
          <>
            <StatCard title="Total Revenue" value="$124,592" icon={TrendingUp} trend={{ value: 12, isUp: true }} color="indigo" />
            <StatCard title="Total Students" value="12,402" icon={Users} trend={{ value: 5, isUp: true }} color="blue" />
            <StatCard title="Active Courses" value="142" icon={BookOpen} trend={{ value: 2, isUp: false }} color="green" />
            <StatCard title="Certificates Issued" value="1,240" icon={Award} trend={{ value: 18, isUp: true }} color="purple" />
          </>
        ) : role === 'instructor' ? (
          <>
            <StatCard title="Active Students" value="842" icon={Users} trend={{ value: 8, isUp: true }} color="indigo" />
            <StatCard title="My Courses" value="6" icon={BookOpen} color="blue" />
            <StatCard title="Avg. Course Rating" value="4.8" icon={Award} color="orange" />
            <StatCard title="Hours Taught" value="1,240" icon={Clock} color="purple" />
          </>
        ) : (
          <>
            <StatCard title="Courses Enrolled" value="4" icon={BookOpen} color="indigo" />
            <StatCard title="Completed Lessons" value="28" icon={CheckCircle} color="green" />
            <StatCard title="Points Earned" value="1,450" icon={Award} color="orange" />
            <StatCard title="Learning Hours" value="42.5" icon={Clock} color="blue" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900">
              {role === 'admin' ? 'Revenue & Enrollment' : role === 'instructor' ? 'Student Engagement' : 'Learning Progress'}
            </h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentStats}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    {activity.type === 'course_completed' ? 'completed' : activity.type === 'new_enrollment' ? 'enrolled in' : 'submitted'}{' '}
                    <span className="font-semibold text-indigo-600">{activity.item}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100">
            View All Activity
          </button>
        </div>
      </div>

      {/* Recommended/My Courses Row */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">
            {role === 'student' ? 'Continue Learning' : 'Popular Courses'}
          </h3>
          <button className="text-sm font-semibold text-indigo-600 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
              <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-600">{course.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 bg-gray-100 rounded-full flex-1">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{course.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};