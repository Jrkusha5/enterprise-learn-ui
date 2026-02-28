import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Calendar as CalendarIcon,
  Download,
  FileText,
  X,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { enrollmentStats, recentActivity } from '../data/mockData';
import { useCourses } from '../contexts/CoursesContext';
import { UserRole } from '../types';
import { getCourseProgressPercent } from '../lib/progressStorage';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/ui/skeleton';

// Extended activity for "View All" (client-side only)
const allActivity = [
  ...recentActivity,
  { id: 4, type: 'new_enrollment' as const, user: 'Alice Brown', item: 'Data Science Bootcamp', time: '2 days ago' },
  { id: 5, type: 'course_completed' as const, user: 'Bob Lee', item: 'React 19', time: '3 days ago' },
  { id: 6, type: 'assignment_submitted' as const, user: 'Carol White', item: 'Design Project', time: '4 days ago' },
  { id: 7, type: 'course_completed' as const, user: 'David Kim', item: 'Business Management', time: '5 days ago' },
  { id: 8, type: 'new_enrollment' as const, user: 'Eva Davis', item: 'UI/UX Masterclass', time: '1 week ago' },
];

type DateRange = '7' | '30' | '90';

// Chart data for different ranges (client-side)
const chartByRange: Record<DateRange, { name: string; value: number }[]> = {
  '7': [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 180 },
    { name: 'Wed', value: 150 },
    { name: 'Thu', value: 220 },
    { name: 'Fri', value: 190 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 140 },
  ],
  '30': [
    { name: 'Week 1', value: 320 },
    { name: 'Week 2', value: 410 },
    { name: 'Week 3', value: 380 },
    { name: 'Week 4', value: 490 },
  ],
  '90': enrollmentStats,
};

function exportDashboardCSV(role: UserRole, dateRange: DateRange) {
  const data = chartByRange[dateRange];
  const headers = ['Period', 'Value'];
  const rows = data.map(d => [d.name, d.value]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-report-${dateRange}-days.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface DashboardProps {
  role: UserRole;
  onSelectCourse?: (courseId: string) => void;
}

export const Dashboard = ({ role, onSelectCourse }: DashboardProps) => {
  const { courses } = useCourses();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [isLoading] = useState(false);

  const chartData = useMemo(() => chartByRange[dateRange], [dateRange]);

  const coursesWithProgress = useMemo(() => {
    return courses.map(c => ({
      ...c,
      progress: getCourseProgressPercent(c.id, c.lessons.length) || c.progress || 0,
    })).sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
  }, [courses]);

  const displayCourses = coursesWithProgress.slice(0, 4);
  const hasCourses = displayCourses.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {role === 'admin' ? 'System Overview' : role === 'instructor' ? 'Instructor Dashboard' : 'Welcome back, Alex!'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your learning ecosystem today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          {role !== 'student' && (
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Generate Report
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
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
              <StatCard title="Courses Enrolled" value={String(courses.length)} icon={BookOpen} color="indigo" />
              <StatCard title="Completed Lessons" value="28" icon={CheckCircle} color="green" />
              <StatCard title="Points Earned" value="1,450" icon={Award} color="orange" />
              <StatCard title="Learning Hours" value="42.5" icon={Clock} color="blue" />
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {role === 'admin' ? 'Revenue & Enrollment' : role === 'instructor' ? 'Student Engagement' : 'Learning Progress'}
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-gray-600" />
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{activity.user}</span>{' '}
                    {activity.type === 'course_completed' ? 'completed' : activity.type === 'new_enrollment' ? 'enrolled in' : 'submitted'}{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activity.item}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllActivity(true)}
            className="w-full mt-8 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors border border-indigo-100 dark:border-indigo-800"
          >
            View All Activity
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            {role === 'student' ? 'Continue Learning' : 'Popular Courses'}
          </h3>
          <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
        </div>
        {!hasCourses ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12">
            <EmptyState
              icon={BookOpen}
              title="No courses yet"
              description="Enroll in courses from the Courses page to see your progress here."
              action={{ label: 'Browse courses', onClick: () => {} }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCourses.map((course) => (
              <div
                key={course.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCourse?.(course.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectCourse?.(course.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{course.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full flex-1">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${course.progress ?? 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{course.progress ?? 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowReportModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-8 border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Generated Report</h2>
              <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Summary for the last {dateRange} days. Revenue and engagement metrics are based on current data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { exportDashboardCSV(role, dateRange); setShowReportModal(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAllActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAllActivity(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Activity</h2>
              <button onClick={() => setShowAllActivity(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
              {allActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      {activity.type === 'course_completed' ? 'completed' : activity.type === 'new_enrollment' ? 'enrolled in' : 'submitted'}{' '}
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activity.item}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
