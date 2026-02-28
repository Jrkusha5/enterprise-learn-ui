import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, ChevronRight, Plus, Eye, Pencil } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/ui/CourseCard';
import { AddCourses } from './AddCourses';
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
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const categories = ['All', ...CATEGORIES];

  const role = (roleProp ?? user?.role ?? 'student').toString().toLowerCase();
  const canCreate = role === 'admin' || role === 'instructor';
  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.category === filter);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-500 text-sm">Discover your next skill from 140+ courses</p>
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

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => onSelectCourse(course.id)}
              onViewDetail={handleViewDetail}
              onEdit={openEdit}
              canEdit={canCreate && isCustomCourse(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => onSelectCourse(course.id)}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-pointer"
            >
              <img src={course.thumbnail} className="w-40 h-24 rounded-xl object-cover" alt="" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">{course.category}</span>
                  <span className="text-[10px] text-gray-400 font-medium">• {course.duration}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleViewDetail(course.id); }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  title="View details"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                {canCreate && isCustomCourse(course.id) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(course.id); }}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    title="Edit course"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <span className="font-bold text-indigo-600 min-w-[4rem] text-right">
                  {course.price != null ? `$${course.price.toFixed(2)}` : 'Free'}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
