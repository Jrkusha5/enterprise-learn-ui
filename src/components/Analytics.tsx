import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CHART_DATA } from '../data/mock';
import { DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Revenue', value: '$12k', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Students', value: '1,2k', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Completion', value: '84%', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
         ].map((c, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200">
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", c.bg)}><c.icon className={c.color} size={24}/></div>
             <p className="text-sm font-bold text-slate-400 uppercase">{c.label}</p>
             <h3 className="text-2xl font-bold">{c.value}</h3>
           </div>
         ))}
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;