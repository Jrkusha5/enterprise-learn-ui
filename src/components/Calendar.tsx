import React from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const Calendar: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Calendar</h1>
          <p className="text-slate-500">Manage your class schedules and deadlines.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">March 2024</h2>
          </div>
          <div className="grid grid-cols-7 border-t border-l border-slate-100">
            {days.map(day => (
              <div key={day} className="p-4 border-r border-b border-slate-100 text-center font-bold text-xs text-slate-400 uppercase tracking-widest bg-slate-50/50">
                {day}
              </div>
            ))}
            {dates.map(date => (
              <div key={date} className={cn(
                "p-4 border-r border-b border-slate-100 min-h-[120px] group transition-colors hover:bg-indigo-50/30",
                date === 15 ? "bg-indigo-50/20" : ""
              )}>
                <p className={cn(
                  "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg mb-2",
                  date === 15 ? "bg-indigo-600 text-white" : "text-slate-700"
                )}>
                  {date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;