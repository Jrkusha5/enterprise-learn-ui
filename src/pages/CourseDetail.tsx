import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { 
  Star, 
  Users, 
  Clock, 
  Play, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  BookOpen,
  Award,
  Download,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { courses, instructors } from '../data/mockData';
import { Course } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews' | 'instructor'>('overview');

  // Find the course
  const course = courses.find(c => c.id === id);
  const instructor = course?.instructorId 
    ? instructors.find(i => i.id === course.instructorId) 
    : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-white">
        <LandingNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
            <p className="text-gray-400 mb-8">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/courses')} className="bg-indigo-600 hover:bg-indigo-700">
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Organize lessons into chapters (mock data structure)
  const chapters = course.chapters || [
    {
      id: 'ch-1',
      title: 'Video Editing Basics',
      lessons: course.lessons.slice(0, 5) || []
    },
    {
      id: 'ch-2',
      title: 'Advanced Editing Techniques',
      lessons: course.lessons.slice(5, 9) || []
    },
    {
      id: 'ch-3',
      title: 'Color Correction and Grading',
      lessons: course.lessons.slice(9) || []
    }
  ];

  const totalLessons = course.lessons.length;
  const totalHours = course.duration || '2+ hours';
  const learningOutcomes = course.learningOutcomes || [
    'Edit like a professional with industry tools',
    'Color grading and correction techniques',
    'Sound design and audio mixing fundamentals',
    'Export settings for any platform'
  ];

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll in this course');
      navigate('/login');
      return;
    }
    toast.success('Successfully enrolled in the course!');
    navigate(`/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-white">
      <LandingNavbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-white">{course.category}</span>
          <span>/</span>
          <span className="text-white">{course.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-xs font-semibold uppercase">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold">{course.rating}</span>
                  </div>
                  <span className="text-gray-400">({course.studentsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>{course.studentsCount} students</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{totalHours} of content</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Play className="w-5 h-5" />
                  <span>{totalLessons} video lessons</span>
                </div>
              </div>
            </div>

            {/* Course Preview Video */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Preview this course
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex gap-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'curriculum', label: 'Course Curriculum' },
                  { id: 'reviews', label: 'Student Reviews' },
                  { id: 'instructor', label: 'About the Instructor' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-2 font-semibold transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'text-white border-indigo-500'
                        : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* What You'll Learn */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-gray-300">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Includes */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">This course includes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Play className="w-5 h-5 text-indigo-400" />
                        <span>{totalLessons} video lessons</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="w-5 h-5 text-indigo-400" />
                        <span>{totalHours} of content</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Award className="w-5 h-5 text-indigo-400" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Download className="w-5 h-5 text-indigo-400" />
                        <span>Downloadable resources</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                    <span className="text-gray-400">
                      {chapters.length} chapters • {totalLessons} lessons
                    </span>
                  </div>
                  <Accordion type="multiple" className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <AccordionItem 
                        key={chapter.id} 
                        value={chapter.id}
                        className="bg-white/5 border border-gray-800 rounded-xl px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-gray-500">{index + 1}</span>
                              <div className="text-left">
                                <h3 className="font-semibold text-lg">{chapter.title}</h3>
                                <p className="text-sm text-gray-400">{chapter.lessons.length} lessons</p>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-12 pb-4">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-300">{lesson.title}</span>
                                  {lessonIndex === 0 && (
                                    <span className="text-xs text-indigo-400 bg-indigo-400/20 px-2 py-0.5 rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold">{course.rating}</span>
                      <span className="text-gray-400">({course.studentsCount} reviews)</span>
                    </div>
                  </div>
                  <div className="text-center py-12 bg-white/5 rounded-xl border border-gray-800">
                    <p className="text-gray-400">No reviews yet. Be the first to review this course!</p>
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
                  <Card className="bg-white/5 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <img 
                          src={instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructorName)}&background=6366f1&color=fff`}
                          alt={course.instructorName}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{course.instructorName}</h3>
                          <p className="text-indigo-400 mb-4">{instructor?.bio || 'Professional instructor with years of experience'}</p>
                          <p className="text-gray-300">
                            {instructor?.bio || 'Passionate about sharing knowledge and helping students achieve their goals.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-sm border-gray-800 sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-2">
                  {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                </div>
                <div className="text-gray-400 text-sm mb-6">30-day access</div>
                
                <Button
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white mb-4 py-6 text-lg"
                >
                  Enroll Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-white hover:bg-white/10 mb-6"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Course
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span>30 days of access</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <span>Certificate on completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Play className="w-5 h-5 text-indigo-400" />
                    <span>Video lessons on Vimeo</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span>Quizzes after each lesson</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
