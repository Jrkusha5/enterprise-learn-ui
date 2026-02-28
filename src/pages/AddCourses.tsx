import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronRight, Video, FileText } from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import type { Chapter, Lesson, LessonResource } from '../types';

const CATEGORIES = ['Development', 'Design', 'Data Science', 'Business', 'Marketing'];
const DEFAULT_THUMBNAIL = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/web-dev-course-thumbnail-90e00274-1772004545998.webp';
const MAX_VIDEO_SIZE_MB = 5;
const MAX_RESOURCE_SIZE_MB = 2;

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

interface LessonForm {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoFile: File | null;
  duration: string;
  resources: { name: string; url: string; file?: File }[];
  freePreview: boolean;
}

interface ChapterForm {
  id: string;
  title: string;
  lessons: LessonForm[];
  expanded: boolean;
}

const emptyLesson = (): LessonForm => ({
  id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: '',
  description: '',
  videoUrl: '',
  videoFile: null,
  duration: '',
  resources: [],
  freePreview: false,
});

const emptyChapter = (): ChapterForm => ({
  id: `chapter-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: '',
  lessons: [],
  expanded: true,
});

function ResourceUrlInput({ onAdd }: { onAdd: (url: string, name: string) => void }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  return (
    <div className="flex gap-2">
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Or paste resource URL"
        className="flex-1 px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-xs"
      />
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        className="w-24 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-xs"
      />
      <button
        type="button"
        onClick={() => {
          if (url.trim()) {
            onAdd(url, name);
            setUrl('');
            setName('');
          }
        }}
        className="px-2 py-1.5 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
      >
        Add
      </button>
    </div>
  );
}

function fileToDataUrl(file: File, maxMb: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxMb * 1024 * 1024) {
      reject(new Error(`File must be under ${maxMb}MB`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

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
  const [chapters, setChapters] = useState<ChapterForm[]>([]);
  const [activeSection, setActiveSection] = useState<'basic' | 'chapters'>('basic');

  const isEditing = !!editCourseId;
  const editingCourse = isEditing && editCourseId ? courses.find(c => c.id === editCourseId) : null;

  const loadChaptersFromCourse = useCallback((course: { chapters?: Chapter[]; lessons?: Lesson[] }) => {
    if (course.chapters?.length) {
      setChapters(
        course.chapters.map(ch => ({
          id: ch.id,
          title: ch.title,
          expanded: true,
          lessons: ch.lessons.map(l => ({
            id: l.id,
            title: l.title,
            description: l.content || '',
            videoUrl: l.videoUrl || '',
            videoFile: null,
            duration: l.duration || '',
            resources: (l.resources || []).map(r => ({ name: r.name, url: r.url })),
            freePreview: !!l.freePreview,
          })),
        }))
      );
    } else if (course.lessons?.length) {
      setChapters([
        {
          ...emptyChapter(),
          title: 'Chapter 1',
          lessons: course.lessons.map(l => ({
            id: l.id,
            title: l.title,
            description: l.content || '',
            videoUrl: l.videoUrl || '',
            videoFile: null,
            duration: l.duration || '',
            resources: (l.resources || []).map(r => ({ name: r.name, url: r.url })),
            freePreview: !!l.freePreview,
          })),
        },
      ]);
    } else {
      setChapters([]);
    }
  }, []);

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
      loadChaptersFromCourse(editingCourse);
    } else {
      setForm({
        ...emptyForm(),
        instructorName: user?.name ?? 'Instructor',
      });
      setChapters([]);
    }
  }, [open, editCourseId, editingCourse?.id, user?.name, loadChaptersFromCourse]);

  const addChapter = () => {
    setChapters(prev => [...prev, { ...emptyChapter(), title: `Chapter ${prev.length + 1}` }]);
    setActiveSection('chapters');
  };

  const removeChapter = (chapterId: string) => {
    setChapters(prev => prev.filter(c => c.id !== chapterId));
  };

  const updateChapter = (chapterId: string, updates: Partial<ChapterForm>) => {
    setChapters(prev =>
      prev.map(c => (c.id === chapterId ? { ...c, ...updates } : c))
    );
  };

  const addLesson = (chapterId: string) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? { ...c, lessons: [...c.lessons, emptyLesson()], expanded: true }
          : c
      )
    );
  };

  const removeLesson = (chapterId: string, lessonId: string) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) }
          : c
      )
    );
  };

  const updateLesson = (chapterId: string, lessonId: string, updates: Partial<LessonForm>) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId ? { ...l, ...updates } : l
              ),
            }
          : c
      )
    );
  };

  const addResource = (chapterId: string, lessonId: string, file: File) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId
                  ? { ...l, resources: [...l.resources, { name: file.name, url: '', file }] }
                  : l
              ),
            }
          : c
      )
    );
  };

  const addResourceUrl = (chapterId: string, lessonId: string, url: string, name: string) => {
    if (!url.trim()) return;
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId
                  ? {
                      ...l,
                      resources: [...l.resources, { name: name.trim() || 'Resource', url: url.trim() }],
                    }
                  : l
              ),
            }
          : c
      )
    );
  };

  const removeResource = (chapterId: string, lessonId: string, index: number) => {
    setChapters(prev =>
      prev.map(c =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId
                  ? {
                      ...l,
                      resources: l.resources.filter((_, i) => i !== index),
                    }
                  : l
              ),
            }
          : c
      )
    );
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }
    const learningOutcomes = form.learningOutcomesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const buildLessons = async (lessonForms: LessonForm[]): Promise<Lesson[]> => {
      const result: Lesson[] = [];
      for (const lf of lessonForms) {
        let videoUrl = lf.videoUrl.trim();
        if (lf.videoFile) {
          try {
            videoUrl = await fileToDataUrl(lf.videoFile, MAX_VIDEO_SIZE_MB);
          } catch {
            toast.error(`Video "${lf.title || 'Untitled'}" exceeds ${MAX_VIDEO_SIZE_MB}MB. Use a URL instead.`);
            continue;
          }
        }
        const resources: LessonResource[] = [];
        for (const r of lf.resources) {
          if (r.url) {
            resources.push({ name: r.name, url: r.url, type: r.name.endsWith('.pdf') ? 'pdf' : 'doc' });
          } else if (r.file) {
            try {
              const dataUrl = await fileToDataUrl(r.file, MAX_RESOURCE_SIZE_MB);
              resources.push({ name: r.name, url: dataUrl, type: r.name.endsWith('.pdf') ? 'pdf' : 'doc' });
            } catch {
              toast.error(`Resource "${r.name}" exceeds ${MAX_RESOURCE_SIZE_MB}MB.`);
            }
          }
        }
        result.push({
          id: lf.id,
          title: lf.title.trim() || 'Untitled Lecture',
          duration: lf.duration.trim() || '0:00',
          completed: false,
          videoUrl: videoUrl || undefined,
          content: lf.description.trim() || undefined,
          resources: resources.length ? resources : undefined,
          freePreview: lf.freePreview,
        });
      }
      return result;
    };

    const chapterData: Chapter[] = await Promise.all(
      chapters.map(async ch => ({
        id: ch.id,
        title: ch.title.trim() || 'Untitled Chapter',
        lessons: await buildLessons(ch.lessons),
      }))
    );

    const allLessons = chapterData.flatMap(c => c.lessons);
    const totalDuration = allLessons.reduce((acc, l) => {
      const [m, s] = l.duration.split(':').map(Number);
      return acc + (m || 0) * 60 + (s || 0);
    }, 0);
    const hours = Math.floor(totalDuration / 3600);
    const mins = Math.floor((totalDuration % 3600) / 60);
    const durationStr = hours ? `${hours}h ${mins}m` : `${mins}m`;

    const basePayload = {
      title: form.title.trim(),
      description: form.description.trim() || 'New course description.',
      category: form.category,
      instructorName: form.instructorName.trim() || (user?.name ?? 'Instructor'),
      thumbnail: form.thumbnail.trim() || DEFAULT_THUMBNAIL,
      rating: Number(form.rating) || 4.5,
      studentsCount: Number(form.studentsCount) || 0,
      duration: durationStr,
      price: form.price != null && form.price !== '' ? Number(form.price) : undefined,
      learningOutcomes: learningOutcomes.length ? learningOutcomes : undefined,
    };

    if (isEditing && editCourseId) {
      updateCourse(editCourseId, {
        ...basePayload,
        chapters: chapterData,
        lessons: allLessons,
      });
      toast.success('Course updated');
    } else {
      addCourse({
        ...basePayload,
        chapters: chapterData,
        lessons: allLessons,
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full my-8 p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
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

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSection('basic')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeSection === 'basic'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Course Info
          </button>
          <button
            onClick={() => setActiveSection('chapters')}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeSection === 'chapters'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            Chapters & Lectures ({chapters.length})
          </button>
        </div>

        {activeSection === 'basic' && (
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
        )}

        {activeSection === 'chapters' && (
          <div className="space-y-4">
            <button
              onClick={addChapter}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Add Chapter
            </button>

            {chapters.map(chapter => (
              <div
                key={chapter.id}
                className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer"
                  onClick={() => updateChapter(chapter.id, { expanded: !chapter.expanded })}
                >
                  {chapter.expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <input
                    value={chapter.title}
                    onChange={e => updateChapter(chapter.id, { title: e.target.value })}
                    onClick={e => e.stopPropagation()}
                    placeholder="Chapter title"
                    className="flex-1 bg-transparent font-medium text-gray-900 dark:text-gray-100 border-none focus:ring-0"
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      removeChapter(chapter.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {chapter.expanded && (
                  <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => addLesson(chapter.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Lecture
                    </button>

                    {chapter.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <Video className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                          <div className="flex-1 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Lecture title</label>
                              <input
                                value={lesson.title}
                                onChange={e => updateLesson(chapter.id, lesson.id, { title: e.target.value })}
                                placeholder="e.g. Introduction to React Hooks"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                              <textarea
                                value={lesson.description}
                                onChange={e => updateLesson(chapter.id, lesson.id, { description: e.target.value })}
                                placeholder="Brief description of this lecture..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Video URL or upload</label>
                              <div className="flex gap-2">
                                <input
                                  value={lesson.videoUrl}
                                  onChange={e => updateLesson(chapter.id, lesson.id, { videoUrl: e.target.value })}
                                  placeholder="https://... or upload below"
                                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                                />
                                <label className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 shrink-0">
                                  Upload
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={e => {
                                      const f = e.target.files?.[0];
                                      if (f) updateLesson(chapter.id, lesson.id, { videoFile: f, videoUrl: '' });
                                      e.target.value = '';
                                    }}
                                  />
                                </label>
                              </div>
                              {lesson.videoFile && (
                                <p className="text-xs text-amber-600 mt-1">
                                  File: {lesson.videoFile.name} (max {MAX_VIDEO_SIZE_MB}MB for local storage)
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                              <input
                                value={lesson.duration}
                                onChange={e => updateLesson(chapter.id, lesson.id, { duration: e.target.value })}
                                placeholder="e.g. 10:30"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Resources (PDF, Word)</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {lesson.resources.map((r, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                                  >
                                    <FileText className="w-3 h-3" />
                                    {r.name}
                                    <button
                                      type="button"
                                      onClick={() => removeResource(chapter.id, lesson.id, i)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                                <label className="px-2 py-1 rounded border border-dashed border-gray-300 dark:border-gray-600 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                  + Upload PDF/Word
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={e => {
                                      const f = e.target.files?.[0];
                                      if (f) addResource(chapter.id, lesson.id, f);
                                      e.target.value = '';
                                    }}
                                  />
                                </label>
                              </div>
                              <ResourceUrlInput
                                onAdd={(url, name) => addResourceUrl(chapter.id, lesson.id, url, name)}
                              />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={lesson.freePreview}
                                onChange={e => updateLesson(chapter.id, lesson.id, { freePreview: e.target.checked })}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Free preview on public landing page
                              </span>
                            </label>
                          </div>
                          <button
                            onClick={() => removeLesson(chapter.id, lesson.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
