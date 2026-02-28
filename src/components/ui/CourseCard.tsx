import React from 'react';
import { Star, Users, Clock, PlayCircle, Pencil, Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  isCustomCourse?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, onEdit, onDelete, isCustomCourse }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isCustomCourse && (onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-2" onClick={e => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow hover:bg-white dark:hover:bg-gray-700"
                aria-label="Edit course"
              >
                <Pencil className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow hover:bg-red-50 dark:hover:bg-red-900/30"
                aria-label="Delete course"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
            {course.category}
          </span>
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

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
          {course.progress !== undefined && (
            <div className="flex items-center gap-2 flex-1 ml-4">
              <div className="h-1.5 bg-gray-100 rounded-full flex-1 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-gray-500">{course.progress}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};