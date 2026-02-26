import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/LandingNavbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  BookOpen, 
  Users, 
  Award, 
  Zap, 
  CheckCircle2, 
  Star,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Plus,
  Minus
} from 'lucide-react';
import { courses } from '../data/mockData';
import { FAQAccordion } from '../components/FAQAccordion';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      value: 'item-1',
      question: 'What exactly is a learning management system?',
      answer: 'Yes, you can try us for free for 30 days. If you want, we\'ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
    },
    {
      value: 'item-2',
      question: 'What kind of courses can I take here?',
      answer: 'We offer a wide range of courses covering technology, business, design, and more. Our courses are designed by industry experts and include hands-on projects, video lectures, and interactive assignments to help you master new skills.',
    },
    {
      value: 'item-3',
      question: 'Do you offer both beginner and advanced courses?',
      answer: 'Absolutely! We have courses for all skill levels - from complete beginners to advanced professionals. Each course clearly indicates its difficulty level, and you can start with fundamentals before moving to more advanced topics.',
    },
    {
      value: 'item-4',
      question: 'How active is the learning community?',
      answer: 'Our community is very active with thousands of students participating daily. You can ask questions, share projects, get feedback, and connect with peers and instructors through our forums and Discord server.',
    },
    {
      value: 'item-5',
      question: 'What happens after I complete a course?',
      answer: 'Upon course completion, you\'ll receive a certificate of completion that you can add to your LinkedIn profile or resume. You\'ll also have lifetime access to the course materials and can continue to participate in the community discussions.',
    },
    {
      value: 'item-6',
      question: 'How do I change my account email?',
      answer: 'You can change your account email by going to Settings in your dashboard. Click on "Account Settings" and then "Change Email". You\'ll receive a verification email at your new address to confirm the change.',
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Courses',
      description: 'Engage with hands-on learning experiences and real-world projects',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion',
    },
    {
      icon: Zap,
      title: 'Learn at Your Pace',
      description: 'Flexible learning schedule that fits your lifestyle',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'EduFlow transformed my career. The courses are comprehensive and the instructors are amazing!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'Best investment I\'ve made in my professional development. Highly recommend!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Analyst',
      content: 'The platform is intuitive and the content is top-notch. Exceeded my expectations!',
      rating: 5,
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
    },
  ];

  const pricingPlans = [
    {
      name: 'Student',
      price: '$29',
      period: '/month',
      description: 'Perfect for individual learners',
      features: [
        'Access to all courses',
        'Certificate of completion',
        'Community support',
        'Mobile app access',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'For serious learners and professionals',
      features: [
        'Everything in Student',
        'Priority support',
        '1-on-1 mentoring sessions',
        'Advanced projects',
        'Career guidance',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For teams and organizations',
      features: [
        'Everything in Professional',
        'Team management',
        'Custom learning paths',
        'Analytics dashboard',
        'Dedicated account manager',
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="absolute top-48 right-32 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float delay-200">
            <Award className="w-8 h-8 text-purple-400" />
          </div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float delay-400">
            <Users className="w-8 h-8 text-pink-400" />
          </div>
          <div className="absolute bottom-48 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-float delay-600">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">The Best Learning Platform</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Learn New Skills
            <br />
            Build Your Future
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            We are a community of learners helping each other master new skills, advance careers, 
            and achieve professional goals through comprehensive courses and expert guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/50"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => {
                const element = document.getElementById('courses');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
            >
              Explore Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Over <span className="text-white font-semibold">50,000</span> students enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span><span className="text-white font-semibold">500+</span> courses available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose EduFlow?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Courses</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start learning from our most popular courses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
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
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{course.rating}</span>
                        <span className="text-gray-500">({course.studentsCount})</span>
                      </div>
                      <span className="text-gray-400">{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/courses')}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
            >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied learners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Flexible pricing options for every learner
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative bg-white/5 backdrop-blur-sm border-2 transition-all ${
                  plan.popular 
                    ? 'border-indigo-500 bg-white/10 scale-105' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 ml-2">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate('/register')}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    } text-white`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email</p>
                    <p className="text-gray-400">support@eduflow.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Address</p>
                    <p className="text-gray-400">123 Learning Street, Education City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input 
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                      placeholder="Your message..."
                      rows={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Section - FAQ Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700 mb-6">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Everything You Need To Know About Our Platform
              </p>
              <p className="text-gray-500">
                Still Have A Question?{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Ask On Discord
                </a>
              </p>
            </div>

            {/* Right Section - FAQ Accordion */}
            <div className="w-full">
              <FAQAccordion items={faqItems} defaultValue="item-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white font-bold text-xl">EduFlow</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 EduFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
