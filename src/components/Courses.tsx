import React, { useState } from 'react';
import { Search, LayoutGrid, List, Star, Users, ArrowRight } from 'lucide-react';
import { MOCK_COURSES } from '../data/mock';
import { cn } from '../utils/cn';
import { Course } from '../types';

const Courses: React.FC<{ onSelectCourse: (c: Course) => void }> = ({ onSelectCourse }) => {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Library</h1>
        <div className="flex gap-2">
           <button onClick={() => setView('grid')} className={cn("p-2 rounded-lg", view === 'grid' ? "bg-white shadow-sm" : "text-slate-400")}><LayoutGrid size={20}/></button>
           <button onClick={() => setView('table')} className={cn("p-2 rounded-lg", view === 'table' ? "bg-white shadow-sm" : "text-slate-400")}><List size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_COURSES.map((course) => (
          <div key={course.id} onClick={() => onSelectCourse(course)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all">
            <img src={course.thumbnail} className="w-full h-40 object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-slate-900">{course.title}</h3>
              <p className="text-sm text-slate-500 mt-1">by {course.instructor}</p>
              <div className="flex items-center gap-4 mt-4 text-xs font-bold text-slate-400 uppercase">
                <span className="flex items-center gap-1"><Users size={14}/> {course.students}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor"/> {course.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;