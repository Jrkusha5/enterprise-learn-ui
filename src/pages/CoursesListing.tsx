import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { courses } from '../data/mockData';

export const CoursesListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Development', 'Design', 'Data Science', 'Business'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Discover your next skill from our comprehensive course library
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-14 text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Found
            </h2>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No courses found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {course.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold">{course.rating}</span>
                          <span className="text-gray-500">({course.studentsCount})</span>
                        </div>
                        <span className="text-gray-400">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {course.price ? `$${course.price.toFixed(2)}` : 'Free'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course.id}`);
                          }}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
