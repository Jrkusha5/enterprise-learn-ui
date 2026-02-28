import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronRight, Plus, Eye, Pencil, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { CourseCard } from '../components/ui/CourseCard';
import { StudentCourseCard } from '../components/ui/StudentCourseCard';
import { AddCourses } from './AddCourses';
import { EmptyState } from '../components/EmptyState';
import { getCourseProgressPercent } from '../lib/progressStorage';
import { UserRole } from '../types';

const CATEGORIES = ['Development', 'Design', 'Data Science', 'Business', 'Marketing'];

interface CoursesProps {
  role?: UserRole;
  onSelectCourse: (id: string) => void;
  editCourseId?: string;
  onClearEditId?: () => void;
}

export const Courses = ({ role: roleProp, onSelectCourse, editCourseId, onClearEditId }: CoursesProps) => {
  const navigate = useNavigate();
  const { courses, isCustomCourse } = useCourses();
  const { user } = useAuth();
  const { enrolledCourseIds } = useEnrollment();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const categories = ['All', ...CATEGORIES];

  const role = (roleProp ?? user?.role ?? 'student').toString().toLowerCase();
  const canCreate = role === 'admin' || role === 'instructor';
  const isStudent = role === 'student';

  const enrolledCourses = useMemo(
    () => courses.filter(c => enrolledCourseIds.includes(c.id)),
    [courses, enrolledCourseIds]
  );

  const { completedCount, inProgressCount } = useMemo(() => {
    if (!isStudent || enrolledCourses.length === 0) return { completedCount: 0, inProgressCount: 0 };
    let completed = 0;
    let inProgress = 0;
    enrolledCourses.forEach(c => {
      const p = getCourseProgressPercent(c.id, c.lessons.length);
      if (p >= 100) completed++;
      else inProgress++;
    });
    return { completedCount: completed, inProgressCount: inProgress };
  }, [isStudent, enrolledCourses]);

  const completedPercent = enrolledCourses.length > 0 ? Math.round((completedCount / enrolledCourses.length) * 100) : 0;
  const inProgressPercent = enrolledCourses.length > 0 ? Math.round((inProgressCount / enrolledCourses.length) * 100) : 0;

  const filteredCourses = isStudent
    ? (filter === 'All' ? enrolledCourses : enrolledCourses.filter(c => c.category === filter))
    : (filter === 'All' ? courses : courses.filter(c => c.category === filter));

  // Open add/edit modal when navigated with ?edit=id
  useEffect(() => {
    if (editCourseId) {
      setEditingCourseId(editCourseId);
      setShowAddModal(true);
      onClearEditId?.();
    }
  }, [editCourseId]);

  const openCreate = () => {
    setEditingCourseId(null);
    setShowAddModal(true);
  };

  const openEdit = (id: string) => {
    setEditingCourseId(id);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditingCourseId(null);
  };

  const handleViewDetail = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isStudent ? 'My Courses' : 'Explore Courses'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isStudent
              ? `Enrolled in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}`
              : 'Discover your next skill from 140+ courses'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {canCreate && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          )}
        </div>
      </div>

      <AddCourses
        open={showAddModal}
        onClose={closeAddModal}
        editCourseId={editingCourseId}
      />

      {isStudent && enrolledCourses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12">
          <EmptyState
            icon={BookOpen}
            title="No enrolled courses yet"
            description="Browse courses from the public catalog and enroll to start learning."
            action={{ label: 'Browse courses', onClick: () => navigate('/courses') }}
          />
        </div>
      ) : (
        <>
      {isStudent && enrolledCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedCount} <span className="text-base font-normal text-gray-500 dark:text-gray-400">({completedPercent}%)</span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {inProgressCount} <span className="text-base font-normal text-gray-500 dark:text-gray-400">({inProgressPercent}%)</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {!isStudent && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) =>
            isStudent ? (
              <StudentCourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course.id)}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course.id)}
                onViewDetail={handleViewDetail}
                onEdit={openEdit}
                canEdit={canCreate && isCustomCourse(course.id)}
              />
            )
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const chapters = course.chapters?.length ?? 1;
            const progress = isStudent
              ? getCourseProgressPercent(course.id, course.lessons.length)
              : (course.progress ?? 0);
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-pointer"
              >
                <img src={course.thumbnail} className="w-40 h-24 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase">{course.category}</span>
                    <span className="text-[10px] text-gray-400 font-medium">• {course.duration}</span>
                    {isStudent && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progress >= 100 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                        {progress >= 100 ? 'Completed' : 'In Progress'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{course.description}</p>
                  {isStudent && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chapters} chapter{chapters !== 1 ? 's' : ''}</span>
                      <div className="flex-1 max-w-[120px] h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewDetail(course.id); }}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  {canCreate && isCustomCourse(course.id) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(course.id); }}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      title="Edit course"
                    >
                      <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  {!isStudent && (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 min-w-[4rem] text-right">
                      {course.price != null ? `$${course.price.toFixed(2)}` : 'Free'}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
