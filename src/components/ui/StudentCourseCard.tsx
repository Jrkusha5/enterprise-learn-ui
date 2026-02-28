import React from 'react';
import { Star, Clock, PlayCircle, Eye, CheckCircle2, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { getCourseProgressPercent } from '../../lib/progressStorage';

interface StudentCourseCardProps {
  course: Course;
  onClick?: () => void;
  onViewDetail?: (courseId: string) => void;
}

function getChapters(course: Course): { id: string; title: string; lessons: { id: string }[] }[] {
  if (course.chapters?.length) return course.chapters;
  const lessons = course.lessons || [];
  if (lessons.length === 0) return [];
  return [{ id: 'ch-1', title: 'Course Content', lessons }];
}

export const StudentCourseCard: React.FC<StudentCourseCardProps> = ({ course, onClick, onViewDetail }) => {
  const chapters = getChapters(course);
  const lessonIds = course.lessons.map(l => l.id);
  const progress = getCourseProgressPercent(course.id, course.lessons.length);
  const isCompleted = progress >= 100;

  const handleAction = (e: React.MouseEvent, fn?: (id: string) => void) => {
    e.stopPropagation();
    fn?.(course.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 shadow-sm">
            {course.category}
          </span>
          {isCompleted ? (
            <span className="bg-green-500/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          ) : (
            <span className="bg-amber-500/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
              In Progress
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          {onViewDetail && (
            <button
              onClick={(e) => handleAction(e, onViewDetail)}
              className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors"
              title="View details"
            >
              <Eye className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 text-amber-500 mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold">{course.rating}</span>
          <span className="text-xs text-gray-400 font-normal">({course.studentsCount})</span>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
          <img
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/instructor-profile-1-4edf3cc3-1772004546272.webp"
            alt={course.instructorName}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="truncate">{course.instructorName}</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <BookOpen className="w-3.5 h-3.5" />
              {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
