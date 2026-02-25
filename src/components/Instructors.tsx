import React from 'react';
import { Mail, MoreVertical, Plus, Star, BookOpen } from 'lucide-react';
import { MOCK_INSTRUCTORS } from '../data/mock';
import { cn } from '../utils/cn';

const Instructors: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instructors</h1>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"><Plus size={18}/> Add Instructor</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INSTRUCTORS.map(i => (
          <div key={i.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-6">
              <img src={i.avatar} className="w-14 h-14 rounded-2xl object-cover" />
              <div><h3 className="font-bold">{i.name}</h3><p className="text-sm text-slate-500">{i.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-3 rounded-2xl text-center"><p className="text-xs text-slate-400 font-bold uppercase">Courses</p><p className="font-bold">12</p></div>
               <div className="bg-slate-50 p-3 rounded-2xl text-center"><p className="text-xs text-slate-400 font-bold uppercase">Rating</p><p className="font-bold">4.9</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;