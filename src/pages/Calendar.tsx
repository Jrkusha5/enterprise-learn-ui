import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const events = [
  { id: 1, title: 'React Advanced Q&A', time: '10:00 AM', type: 'Live Session', date: new Date() },
  { id: 2, title: 'UI Design Deadline', time: '11:59 PM', type: 'Assignment', date: addDays(new Date(), 2) },
  { id: 3, title: 'Data Science Workshop', time: '02:00 PM', type: 'Workshop', date: addDays(new Date(), -1) },
  { id: 4, title: 'Student Onboarding', time: '09:00 AM', type: 'Meeting', date: addDays(new Date(), 4) },
];

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-500">Track your classes, sessions, and deadlines.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">
             {format(currentDate, 'MMMM yyyy')}
           </button>
           <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Weekly View */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="grid grid-cols-7 border-b border-gray-50">
             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-0">
                 {day}
               </div>
             ))}
           </div>
           <div className="grid grid-cols-7 h-[500px]">
             {days.map((day, idx) => {
               const dayEvents = events.filter(e => isSameDay(e.date, day));
               return (
                 <div key={idx} className={`p-4 border-r border-b border-gray-50 last:border-r-0 min-h-[120px] ${!isSameDay(day, new Date()) ? 'bg-gray-50/20' : ''}`}>
                    <span className={`text-sm font-bold inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      isSameDay(day, new Date()) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-700'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-4 space-y-2">
                      {dayEvents.map(event => (
                        <div key={event.id} className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg cursor-pointer hover:shadow-sm transition-shadow">
                          <p className="text-[10px] font-bold text-indigo-700 truncate">{event.title}</p>
                          <p className="text-[8px] text-indigo-400">{event.time}</p>
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Upcoming Sidebar */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-900">Upcoming</h3>
               <button className="text-indigo-600">
                 <Plus className="w-5 h-5" />
               </button>
             </div>
             <div className="space-y-6">
               {events.map(event => (
                 <div key={event.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-600 uppercase">{format(event.date, 'MMM')}</span>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-900">{format(event.date, 'dd')}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{event.type}</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-8 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
               See All Events
             </button>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-3xl text-white">
              <h3 className="font-bold mb-2">Sync with Google</h3>
              <p className="text-xs text-indigo-100 opacity-80 mb-4">Integrate your LMS schedule directly with your primary calendar.</p>
              <button className="w-full py-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl text-sm hover:bg-white/30 transition-all">
                Connect Now
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};