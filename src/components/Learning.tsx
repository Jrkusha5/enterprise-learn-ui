import React, { useState } from 'react';
import { ChevronLeft, Clock, CheckCircle2, Download, MessageCircle, Lock } from 'lucide-react';
import { Course } from '../types';
import { cn } from '../utils/cn';

const LearningPage: React.FC<{ course: Course, onBack: () => void }> = ({ course, onBack }) => {
  const [activeLesson, setActiveLesson] = useState(course.lessons[0] || null);

  if (!activeLesson) return <div>No lessons.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
      <div className="flex-1 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold"><ChevronLeft size={20}/> Back</button>
        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
           <p className="text-slate-500 mt-2">{activeLesson.content || "Lesson content goes here."}</p>
        </div>
      </div>
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100"><h3 className="font-bold">Course Content</h3></div>
          <div className="divide-y divide-slate-50">
            {course.lessons.map(l => (
              <button key={l.id} onClick={() => setActiveLesson(l)} className={cn("w-full text-left p-4 flex gap-3 hover:bg-slate-50 transition-colors", activeLesson.id === l.id ? "bg-indigo-50" : "")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs", l.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                  {l.completed ? <CheckCircle2 size={16}/> : "?"}
                </div>
                <div className="flex-1 truncate"><p className="text-sm font-bold truncate">{l.title}</p></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;