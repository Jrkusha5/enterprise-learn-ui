import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-bold text-xl">EduFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('courses');
                } else {
                  navigate('/courses');
                }
              }}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Contact
            </button>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-md border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  scrollToSection('courses');
                } else {
                  navigate('/courses');
                }
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Contact
            </button>
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full mt-2 border-gray-700 text-white hover:bg-gray-800"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
