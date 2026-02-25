import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronLeft, 
  MessageCircle, 
  ThumbsUp,
  Share2,
  Clock,
  Play,
  Pause,
  Volume2,
  Maximize,
  Settings,
  SkipForward,
  SkipBack,
  Loader2
} from 'lucide-react';
import { courses } from '../data/mockData';
import { cn } from '../utils/cn';
import { toast } from 'sonner';

export const CoursePlayer = ({ courseId, onBack }: { courseId: string, onBack: () => void }) => {
  const course = courses.find(c => c.id === courseId) || courses[0];
  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset video when lesson changes
    if (videoRef.current) {
      setIsLoading(true);
      videoRef.current.load();
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPlaying(false);
          });
        }
      }
    }
  }, [activeLesson]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error("Playback error:", e);
          toast.error("Could not play video");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLessonClick = (lesson: typeof course.lessons[0]) => {
    setActiveLesson(lesson);
    toast.info(`Now playing: ${lesson.title}`);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to courses</span>
        </button>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium"><span className="text-indigo-600 font-bold">124 others</span> are learning this now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group bg-gradient-to-br from-gray-900 to-black">
             {activeLesson.videoUrl ? (
               <video 
                 ref={videoRef}
                 src={activeLesson.videoUrl}
                 className="w-full h-full object-contain"
                 onPlay={() => setIsPlaying(true)}
                 onPause={() => setIsPlaying(false)}
                 onWaiting={() => setIsLoading(true)}
                 onCanPlay={() => setIsLoading(false)}
                 controls={false}
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-white">
                 <p>No video available for this lesson</p>
               </div>
             )}
             
             {/* Loading Spinner */}
             {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                 <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
               </div>
             )}

             {/* Custom Overlay Controls */}
             {!isPlaying && activeLesson.videoUrl && !isLoading && (
               <div 
                 className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                 onClick={togglePlay}
               >
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                   <Play className="w-10 h-10 text-white fill-white" />
                 </div>
               </div>
             )}

             {/* Player UI Overlay Mock */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="space-y-4">
                  <div className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative">
                    <div className="absolute top-0 left-0 h-full bg-indigo-500 w-1/3 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-indigo-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-6">
                      <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                      </button>
                      <div className="flex items-center gap-4">
                        <SkipBack className="w-5 h-5 cursor-pointer hover:text-indigo-400" />
                        <SkipForward className="w-5 h-5 cursor-pointer hover:text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        <div className="w-16 h-1 bg-white/20 rounded-full">
                          <div className="w-3/4 h-full bg-white rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-xs font-mono uppercase tracking-tighter">12:34 / {activeLesson.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Settings className="w-5 h-5 cursor-pointer hover:text-indigo-400" />
                      <Maximize className="w-5 h-5 cursor-pointer hover:text-indigo-400" />
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">Currently Playing</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500 font-medium">Lesson {course.lessons.indexOf(activeLesson) + 1} of {course.lessons.length}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{activeLesson.title}</h1>
                <p className="text-gray-500">{course.title} \u2022 {course.instructorName}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors border border-transparent hover:border-gray-200">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors border border-transparent hover:border-gray-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto scrollbar-hide">
              <button className="px-2 py-4 border-b-2 border-indigo-600 text-indigo-600 font-bold text-sm -mb-[2px] whitespace-nowrap">Overview</button>
              <button className="px-2 py-4 text-gray-500 font-medium text-sm hover:text-gray-800 -mb-[2px] transition-colors whitespace-nowrap">Q&A</button>
              <button className="px-2 py-4 text-gray-500 font-medium text-sm hover:text-gray-800 -mb-[2px] transition-colors whitespace-nowrap">Notes</button>
              <button className="px-2 py-4 text-gray-500 font-medium text-sm hover:text-gray-800 -mb-[2px] transition-colors whitespace-nowrap">Resources</button>
              <button className="px-2 py-4 text-gray-500 font-medium text-sm hover:text-gray-800 -mb-[2px] transition-colors whitespace-nowrap">Announcements</button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
              <p className="text-lg mb-4">
                In this lesson, we dive deep into the core concepts of <strong>{activeLesson.title}</strong>. 
                We'll explore how modern architectural patterns are applied in real-world scenarios and understand the underlying mechanics that make this technology so powerful.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mt-8">
                <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                  Key Takeaways:
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                    <span>Comprehensive understanding of the lifecycle components and their practical applications.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                    <span>Industry standard best practices for state management in large scale applications.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                    <span>Advanced performance optimization techniques that you can implement today.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] sticky top-6">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white z-10">
              <h3 className="font-bold text-gray-900">Course Content</h3>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{course.progress}% Complete</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={cn(
                    "w-full p-4 flex gap-4 text-left transition-all border-b border-gray-50 last:border-0",
                    activeLesson.id === lesson.id ? "bg-indigo-50/80 border-l-4 border-l-indigo-600" : "hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors",
                    lesson.completed 
                      ? "bg-green-500 border-green-500 text-white" 
                      : activeLesson.id === lesson.id 
                        ? "bg-white border-indigo-600 text-indigo-600" 
                        : "bg-white border-gray-100 text-gray-400"
                  )}>
                    {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-bold mb-1 truncate transition-colors",
                      activeLesson.id === lesson.id ? 'text-indigo-900' : 'text-gray-700'
                    )}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration}</span>
                      </div>
                      <span className="text-gray-200">|</span>
                      <div className="flex items-center gap-1.5">
                        <PlayCircle className="w-3 h-3" />
                        <span>Video</span>
                      </div>
                    </div>
                  </div>
                  {activeLesson.id === lesson.id && isPlaying && (
                    <div className="flex gap-0.5 items-end h-4 mb-auto pt-1">
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_0ms] h-2"></div>
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_200ms] h-3"></div>
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_400ms] h-4"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors shadow-sm">
                View Certificate
              </button>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-8 text-white overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2">Need assistance?</h3>
              <p className="text-sm text-indigo-100 mb-6 leading-relaxed opacity-80">Our instructors and community mentors are here to help you through the course.</p>
              <button className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                Ask a Question
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};