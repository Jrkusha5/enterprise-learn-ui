import React from 'react';
import { Mail, MoreVertical, Search, UserPlus, BarChart } from 'lucide-react';
import { MOCK_STUDENTS } from '../data/mock';
import { cn } from '../utils/cn';

const Students: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"><UserPlus size={18}/> Add Student</button>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Student</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Progress</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_STUDENTS.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} className="w-10 h-10 rounded-full" />
                    <div><p className="font-bold">{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">Active</span></td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: '65%'}}/></div>
                </td>
                <td className="px-6 py-4 text-right"><button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={18}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;