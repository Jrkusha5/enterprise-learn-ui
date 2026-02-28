import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipForward,
  SkipBack,
  Loader2,
  Plus,
  Trash2,
  StickyNote
} from 'lucide-react';
import { useCourses } from '../contexts/CoursesContext';
import { cn } from '../utils/cn';
import { toast } from 'sonner';
import {
  getMergedProgressForCourse,
  setLessonPosition,
  setLessonCompleted,
  getNotesForLesson,
  addNote,
  deleteNote,
  type NoteItem
} from '../lib/progressStorage';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const CoursePlayer = ({ courseId, onBack }: { courseId: string; onBack: () => void }) => {
  const { courses } = useCourses();
  const course = courses.find(c => c.id === courseId) || courses[0];
  const lessonIds = course.lessons.map(l => l.id);
  const stored = getMergedProgressForCourse(courseId, lessonIds, course.progress);

  const [activeLesson, setActiveLesson] = useState(course.lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'quiz'>('overview');
  const [notes, setNotes] = useState<NoteItem[]>(() => getNotesForLesson(courseId, activeLesson.id));
  const [newNoteText, setNewNoteText] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [justCompletedIds, setJustCompletedIds] = useState<Set<string>>(new Set());
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const LESSON_QUIZ = { question: 'What is the primary way to manage local state in React function components?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 'useState' };

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const completedLessons = { ...stored.completed };
  justCompletedIds.forEach(id => { completedLessons[id] = true; });
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / course.lessons.length) * 100);
  const positions = { ...stored.positions };
  const isCourseComplete = progressPercent >= 100;

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => {
        toast.error('Could not play video');
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seek = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const t = Math.max(0, Math.min(seconds, duration));
    videoRef.current.currentTime = t;
    setCurrentTime(t);
  }, [duration]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 10);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, currentTime, seek]);

  // Load lesson and resume position
  useEffect(() => {
    const savedPos = positions[activeLesson.id] ?? 0;
    if (videoRef.current) {
      setIsLoading(true);
      videoRef.current.load();
      videoRef.current.currentTime = savedPos;
      setCurrentTime(savedPos);
    }
  }, [activeLesson.id]);

  // Sync video ref with volume/rate/mute
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
    videoRef.current.volume = isMuted ? 0 : volume;
  }, [playbackRate, volume, isMuted]);

  // Time update (throttled save position)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onDurationChange = () => setDuration(v.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setLessonCompleted(courseId, activeLesson.id, course.lessons.length);
      setJustCompletedIds(prev => new Set(prev).add(activeLesson.id));
      toast.success('Lesson completed!');
    };
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('durationchange', onDurationChange);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('durationchange', onDurationChange);
      v.removeEventListener('ended', onEnded);
    };
  }, [activeLesson.id, courseId, course.lessons.length]);

  // Persist position every 3 seconds
  useEffect(() => {
    timeUpdateRef.current = setInterval(() => {
      if (videoRef.current && activeLesson.videoUrl) {
        setLessonPosition(courseId, activeLesson.id, videoRef.current.currentTime);
      }
    }, 3000);
    return () => {
      if (timeUpdateRef.current) clearInterval(timeUpdateRef.current);
    };
  }, [courseId, activeLesson.id, activeLesson.videoUrl]);

  // Refresh notes when lesson changes
  useEffect(() => {
    setNotes(getNotesForLesson(courseId, activeLesson.id));
    setNewNoteText('');
  }, [courseId, activeLesson.id]);

  const handleLessonClick = (lesson: (typeof course.lessons)[0]) => {
    if (videoRef.current) {
      setLessonPosition(courseId, activeLesson.id, videoRef.current.currentTime);
    }
    setActiveLesson(lesson);
    toast.info(`Now playing: ${lesson.title}`);
  };

  const handleAddNote = () => {
    const t = videoRef.current?.currentTime ?? 0;
    if (!newNoteText.trim()) return;
    const added = addNote(courseId, activeLesson.id, newNoteText.trim(), t);
    setNotes(prev => [...prev, added].sort((a, b) => a.timestamp - b.timestamp));
    setNewNoteText('');
    toast.success('Note added');
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setNotes(getNotesForLesson(courseId, activeLesson.id));
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    seek(x * duration);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to courses</span>
        </button>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium"><span className="text-indigo-600 dark:text-indigo-400 font-bold">124 others</span> are learning this now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div
            ref={containerRef}
            className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group bg-gradient-to-br from-gray-900 to-black"
          >
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

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              </div>
            )}

            {!isPlaying && activeLesson.videoUrl && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="space-y-4">
                <div
                  className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative"
                  onClick={handleProgressBarClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-indigo-500 transition-all"
                    style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 8px)` : 0 }}
                  />
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                    </button>
                    <button onClick={() => seek(currentTime - 10)} className="hover:text-indigo-400" title="Rewind 10s">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button onClick={() => seek(currentTime + 10)} className="hover:text-indigo-400" title="Forward 10s">
                      <SkipForward className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setIsMuted(videoRef.current.muted); } }}>
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setVolume(v);
                          if (videoRef.current) {
                            videoRef.current.muted = v === 0;
                            setIsMuted(v === 0);
                          }
                        }}
                        className="w-20 h-1 accent-indigo-500"
                      />
                    </div>
                    <span className="text-xs font-mono">{formatTime(currentTime)} / {duration ? formatTime(duration) : activeLesson.duration}</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="text-xs font-bold px-2 py-1 rounded bg-white/20 hover:bg-white/30"
                      >
                        {playbackRate}x
                      </button>
                      {showSpeedMenu && (
                        <div className="absolute bottom-full left-0 mb-2 py-2 bg-black/90 rounded-lg min-w-[80px] z-10">
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => { setPlaybackRate(s); setShowSpeedMenu(false); }}
                              className={cn("block w-full px-4 py-1.5 text-left text-sm hover:bg-white/20", playbackRate === s && "bg-indigo-600")}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={toggleFullscreen} className="hover:text-indigo-400" title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md uppercase tracking-wider">Currently Playing</span>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Lesson {course.lessons.indexOf(activeLesson) + 1} of {course.lessons.length}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{activeLesson.title}</h1>
                <p className="text-gray-500 dark:text-gray-400">{course.title} • {course.instructorName}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors border border-transparent hover:border-gray-200 dark:border-gray-600">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors border border-transparent hover:border-gray-200 dark:border-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-100 dark:border-gray-700 mb-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn("px-2 py-4 border-b-2 -mb-[2px] whitespace-nowrap text-sm font-medium", activeTab === 'overview' ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200")}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={cn("px-2 py-4 border-b-2 -mb-[2px] whitespace-nowrap text-sm font-medium flex items-center gap-2", activeTab === 'notes' ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200")}
              >
                <StickyNote className="w-4 h-4" /> Notes {notes.length > 0 && `(${notes.length})`}
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={cn("px-2 py-4 border-b-2 -mb-[2px] whitespace-nowrap text-sm font-medium", activeTab === 'quiz' ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200")}
              >
                Quiz
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-lg mb-4">
                  In this lesson, we dive deep into the core concepts of <strong>{activeLesson.title}</strong>.
                  We'll explore how modern architectural patterns are applied in real-world scenarios.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mt-8">
                  <h4 className="text-gray-900 dark:text-gray-100 font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                    Key Takeaways:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>Comprehensive understanding of the lifecycle components and their practical applications.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>Industry standard best practices for state management in large scale applications.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>Advanced performance optimization techniques that you can implement today.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="Add a note at current time..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNoteText.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No notes yet. Add a note at any point in the video.</p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{note.content}</p>
                          <button
                            onClick={() => seek(note.timestamp)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 hover:underline"
                          >
                            @ {formatTime(note.timestamp)}
                          </button>
                        </div>
                        <button onClick={() => handleDeleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {!quizStarted ? (
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Lesson Quiz</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Test your understanding with a short quiz (1 question).</p>
                    <button onClick={() => setQuizStarted(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                      Start Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{LESSON_QUIZ.question}</p>
                    <div className="space-y-2">
                      {LESSON_QUIZ.options.map((opt) => (
                        <button
                          key={opt}
                          disabled={!!quizSubmitted}
                          onClick={() => !quizSubmitted && setQuizAnswer(opt)}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 font-medium text-sm transition-colors",
                            quizAnswer === opt && !quizSubmitted && "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
                            quizSubmitted && opt === LESSON_QUIZ.correct && "border-green-500 bg-green-50 dark:bg-green-900/20",
                            quizSubmitted && quizAnswer === opt && opt !== LESSON_QUIZ.correct && "border-red-500 bg-red-50 dark:bg-red-900/20"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {!quizSubmitted ? (
                      <button
                        onClick={() => { setQuizSubmitted(true); toast.success(quizAnswer === LESSON_QUIZ.correct ? 'Correct!' : 'Incorrect. The answer is useState.'); }}
                        disabled={!quizAnswer}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Submit
                      </button>
                    ) : (
                      <p className={cn("font-medium", quizAnswer === LESSON_QUIZ.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                        {quizAnswer === LESSON_QUIZ.correct ? 'Correct! Well done.' : `Incorrect. The correct answer is ${LESSON_QUIZ.correct}.`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] sticky top-6">
            <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Course Content</h3>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full">{progressPercent}% Complete</span>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
              {course.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={cn(
                    "w-full p-4 flex gap-4 text-left transition-all border-b border-gray-50 dark:border-gray-700/50 last:border-0",
                    activeLesson.id === lesson.id ? "bg-indigo-50/80 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-colors",
                      completedLessons[lesson.id]
                        ? "bg-green-500 border-green-500 text-white"
                        : activeLesson.id === lesson.id
                          ? "bg-white dark:bg-gray-800 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-600 text-gray-400"
                    )}
                  >
                    {completedLessons[lesson.id] ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-bold mb-1 truncate", activeLesson.id === lesson.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300')}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                  {activeLesson.id === lesson.id && isPlaying && (
                    <div className="flex gap-0.5 items-end h-4 mb-auto pt-1">
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_0ms] h-2" />
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_200ms] h-3" />
                      <div className="w-0.5 bg-indigo-500 animate-[bounce_1s_infinite_400ms] h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => isCourseComplete && setShowCertificate(true)}
                disabled={!isCourseComplete}
                className={cn(
                  "w-full py-3 font-bold rounded-xl text-sm transition-colors shadow-sm",
                  isCourseComplete
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                )}
              >
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
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowCertificate(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This certifies that you have successfully completed</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">{course.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">EduFlow Learning Platform</p>
            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
            >
                Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
