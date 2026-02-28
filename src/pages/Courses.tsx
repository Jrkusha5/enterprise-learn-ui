import React, { useState } from 'react';
import { Search, Filter, Grid, List, ChevronRight, Plus, X, Pencil, Trash2 } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/ui/CourseCard';
import { Course } from '../types';
import { toast } from 'sonner';

const CATEGORIES = ['Development', 'Design', 'Data Science', 'Business', 'Marketing'];

function isCustomCourse(course: Course) {
  return course.id.startsWith('custom-');
}

export const Courses = ({ onSelectCourse }: { onSelectCourse: (id: string) => void }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const { user } = useAuth();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Development');
  const categories = ['All', ...CATEGORIES];

  const canCreate = user?.role === 'admin' || user?.role === 'instructor';

  const filteredCourses = filter === 'All' ? courses : courses.filter(c => c.category === filter);

  const openCreateModal = () => {
    setNewTitle('');
    setNewDescription('');
    setNewCategory('Development');
    setShowCreateModal(true);
  };

  const openEditModal = (course: Course, showDeleteConfirm = false) => {
    setEditingCourse(course);
    setNewTitle(course.title);
    setNewDescription(course.description ?? '');
    setNewCategory(course.category ?? 'Development');
    setDeleteConfirmId(showDeleteConfirm ? course.id : null);
  };

  const handleCreateCourse = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    addCourse({
      title: newTitle.trim(),
      description: newDescription.trim() || 'New course description.',
      category: newCategory,
      instructorName: user?.name ?? 'Instructor',
      thumbnail: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/web-dev-course-thumbnail-90e00274-1772004545998.webp',
      rating: 4.5,
      studentsCount: 0,
      duration: '0h',
      lessons: [],
    });
    toast.success('Course created');
    setNewTitle('');
    setNewDescription('');
    setNewCategory('Development');
    setShowCreateModal(false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;
    if (!newTitle.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    updateCourse(editingCourse.id, {
      title: newTitle.trim(),
      description: newDescription.trim() || editingCourse.description,
      category: newCategory,
    });
    toast.success('Course updated');
    setEditingCourse(null);
    setNewTitle('');
    setNewDescription('');
    setNewCategory('Development');
  };

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    toast.success('Course deleted');
    setDeleteConfirmId(null);
    setEditingCourse(null);
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
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Course</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Course title"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateCourse} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                Create
              </button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setEditingCourse(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Course</h2>
              <button onClick={() => setEditingCourse(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Course title"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex gap-3">
                <button onClick={handleUpdateCourse} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                  Save changes
                </button>
                <button onClick={() => setEditingCourse(null)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl font-medium">
                  Cancel
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirmId(editingCourse.id)}
                className="w-full py-2.5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete course
              </button>
              {deleteConfirmId === editingCourse.id && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <span className="text-sm text-red-800 dark:text-red-200 flex-1">Delete this course? This cannot be undone.</span>
                  <button onClick={() => handleDeleteCourse(editingCourse.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium">Yes, delete</button>
                  <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-700 dark:text-red-300">Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              isCustomCourse={isCustomCourse(course)}
              onEdit={canCreate && isCustomCourse(course) ? (e) => { e.stopPropagation(); openEditModal(course); } : undefined}
              onDelete={canCreate && isCustomCourse(course) ? (e) => { e.stopPropagation(); openEditModal(course, true); } : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 hover:shadow-md transition-all cursor-pointer group relative"
            >
              <img src={course.thumbnail} className="w-40 h-24 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase">{course.category}</span>
                  <span className="text-[10px] text-gray-400 font-medium">• {course.duration}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{course.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{course.description}</p>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                {canCreate && isCustomCourse(course) && (
                  <>
                    <button onClick={() => openEditModal(course)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => openEditModal(course, true)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">${(course.price ?? 49).toFixed(2)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};