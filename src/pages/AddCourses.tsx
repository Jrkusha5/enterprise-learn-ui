import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const CATEGORIES = ['Development', 'Design', 'Data Science', 'Business', 'Marketing'];
const DEFAULT_THUMBNAIL = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/web-dev-course-thumbnail-90e00274-1772004545998.webp';

const emptyForm = () => ({
  title: '',
  description: '',
  category: 'Development',
  instructorName: '',
  thumbnail: DEFAULT_THUMBNAIL,
  duration: '',
  rating: 4.5,
  studentsCount: 0,
  price: undefined as number | undefined,
  learningOutcomesText: '',
});

interface AddCoursesProps {
  open: boolean;
  onClose: () => void;
  editCourseId?: string | null;
  onSuccess?: () => void;
}

export function AddCourses({ open, onClose, editCourseId, onSuccess }: AddCoursesProps) {
  const { courses, addCourse, updateCourse } = useCourses();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm());

  const isEditing = !!editCourseId;
  const editingCourse = isEditing && editCourseId ? courses.find(c => c.id === editCourseId) : null;

  useEffect(() => {
    if (!open) return;
    if (editingCourse) {
      setForm({
        title: editingCourse.title,
        description: editingCourse.description || '',
        category: editingCourse.category,
        instructorName: editingCourse.instructorName || '',
        thumbnail: editingCourse.thumbnail || DEFAULT_THUMBNAIL,
        duration: editingCourse.duration || '',
        rating: editingCourse.rating ?? 4.5,
        studentsCount: editingCourse.studentsCount ?? 0,
        price: editingCourse.price,
        learningOutcomesText: (editingCourse.learningOutcomes || []).join('\n'),
      });
    } else {
      setForm({
        ...emptyForm(),
        instructorName: user?.name ?? 'Instructor',
      });
    }
  }, [open, editCourseId, editingCourse?.id, user?.name]);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    const learningOutcomes = form.learningOutcomesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (isEditing && editCourseId) {
      updateCourse(editCourseId, {
        title: form.title.trim(),
        description: form.description.trim() || 'New course description.',
        category: form.category,
        instructorName: form.instructorName.trim() || (user?.name ?? 'Instructor'),
        thumbnail: form.thumbnail.trim() || DEFAULT_THUMBNAIL,
        duration: form.duration.trim() || '0h',
        rating: Number(form.rating) || 4.5,
        studentsCount: Number(form.studentsCount) || 0,
        price: form.price != null && form.price !== '' ? Number(form.price) : undefined,
        learningOutcomes: learningOutcomes.length ? learningOutcomes : undefined,
      });
      toast.success('Course updated');
    } else {
      addCourse({
        title: form.title.trim(),
        description: form.description.trim() || 'New course description.',
        category: form.category,
        instructorName: form.instructorName.trim() || (user?.name ?? 'Instructor'),
        thumbnail: form.thumbnail.trim() || DEFAULT_THUMBNAIL,
        rating: Number(form.rating) || 4.5,
        studentsCount: Number(form.studentsCount) || 0,
        duration: form.duration.trim() || '0h',
        price: form.price != null && form.price !== '' ? Number(form.price) : undefined,
        learningOutcomes: learningOutcomes.length ? learningOutcomes : undefined,
        lessons: [],
      });
      toast.success('Course created');
    }
    onSuccess?.();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full my-8 p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Course title"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description"
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructor name</label>
            <input
              value={form.instructorName}
              onChange={e => setForm(f => ({ ...f, instructorName: e.target.value }))}
              placeholder="Instructor name"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label>
            <input
              value={form.thumbnail}
              onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
              <input
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 24h 15m"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) || 4.5 }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Students count</label>
              <input
                type="number"
                min={0}
                value={form.studentsCount}
                onChange={e => setForm(f => ({ ...f, studentsCount: parseInt(e.target.value, 10) || 0 }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (optional)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price ?? ''}
                onChange={e => setForm(f => ({ ...f, price: e.target.value === '' ? undefined : parseFloat(e.target.value) }))}
                placeholder="Free"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning outcomes (one per line)</label>
            <textarea
              value={form.learningOutcomesText}
              onChange={e => setForm(f => ({ ...f, learningOutcomesText: e.target.value }))}
              placeholder="What students will learn..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            {isEditing ? 'Save changes' : 'Create course'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
