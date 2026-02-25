import React, { useState } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronLeft, 
  MessageCircle, 
  FileText, 
  Download,
  MoreVertical,
  ThumbsUp,
  Share2,
  Clock
} from 'lucide-react';
import { courses } from '../data/mockData';

export const CoursePlayer = ({ courseId, onBack }: { courseId: string, onBack: () => void }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to courses</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer">
             <img 
               src={course.thumbnail} 
               alt="" 
               className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                 <PlayCircle className="w-12 h-12 text-white fill-white" />
               </div>
             </div>
             {/* Player UI Overlay Mock */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
               <div className="flex items-center gap-4 text-white">
                 <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-1/3"></div>
                 </div>
                 <span className="text-xs font-mono">12:34 / 45:00</span>
               </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h1>
                <p className="text-gray-500">{course.title} • Module 1</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 border-b border-gray-100 mb-6">
              <button className="px-4 py-3 border-b-2 border-indigo-600 text-indigo-600 font-bold text-sm">Overview</button>
              <button className="px-4 py-3 text-gray-500 font-medium text-sm hover:text-gray-800">Q&A</button>
              <button className="px-4 py-3 text-gray-500 font-medium text-sm hover:text-gray-800">Notes</button>
              <button className="px-4 py-3 text-gray-500 font-medium text-sm hover:text-gray-800">Resources</button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600">
              <p>
                In this lesson, we dive deep into the core concepts of {activeLesson.title}. 
                We'll explore how modern architectural patterns are applied in real-world scenarios.
              </p>
              <h4 className="text-gray-900 font-bold mt-4">Key Takeaways:</h4>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Understanding the lifecycle components.</li>
                <li>Best practices for state management.</li>
                <li>Performance optimization techniques.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">45% Complete</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full p-4 flex gap-4 text-left transition-colors border-b border-gray-50 last:border-0 ${
                    activeLesson.id === lesson.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    lesson.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-gray-400'
                  }`}>
                    {lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold mb-1 ${activeLesson.id === lesson.id ? 'text-indigo-900' : 'text-gray-700'}`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <PlayCircle className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Need help?</h3>
              <p className="text-sm text-indigo-100 mb-4 opacity-80">Join our Discord community or reach out to the instructor.</p>
              <button className="w-full py-2 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Ask a Question
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};