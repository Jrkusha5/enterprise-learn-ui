import React from 'react';
import { ClipboardList, Clock, ArrowUpRight } from 'lucide-react';
import { MOCK_ASSIGNMENTS } from '../data/mock';
import { cn } from '../utils/cn';

const Assignments: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <div className="grid grid-cols-1 gap-4">
        {MOCK_ASSIGNMENTS.map(a => (
          <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><ClipboardList size={24}/></div>
              <div><h3 className="font-bold">{a.title}</h3><p className="text-sm text-slate-500">{a.course}</p></div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase">Due Date</p>
              <p className="font-bold text-slate-900">{a.dueDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;