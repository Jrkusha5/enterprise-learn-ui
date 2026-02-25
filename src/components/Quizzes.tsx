import React, { useState } from 'react';
import { FileQuestion, Clock, CheckCircle2, X, Timer, ArrowRight } from 'lucide-react';
import { MOCK_QUIZZES } from '../data/mock';
import { cn } from '../utils/cn';

const Quizzes: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  if (activeQuiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center"><button onClick={() => setActiveQuiz(null)}><X/></button><div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Timer size={20}/> 15:00</div></div>
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
           <h2 className="text-2xl font-bold">What is the capital of React?</h2>
           <div className="mt-8 space-y-4">
             {["State", "Props", "Hooks", "Components"].map(o => (
               <button key={o} className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all font-bold">{o}</button>
             ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_QUIZZES.map(q => (
          <div key={q.id} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><FileQuestion size={32}/></div>
            <h3 className="text-xl font-bold">{q.title}</h3>
            <p className="text-sm text-slate-400 mt-2 font-bold uppercase">{q.questions} Questions • {q.time}</p>
            <button onClick={() => setActiveQuiz(q)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Start Quiz</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;