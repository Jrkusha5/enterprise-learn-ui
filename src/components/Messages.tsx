import React, { useState } from 'react';
import { Send, Phone, Video, Info, MoreVertical, Paperclip, Search, Plus } from 'lucide-react';
import { MOCK_MESSAGES } from '../data/mock';
import { cn } from '../utils/cn';

const Messages: React.FC = () => {
  const [inputText, setInputText] = useState('');

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Messages</h2>
            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <button key={i} className={cn(
              "w-full p-4 flex gap-3 hover:bg-white transition-colors text-left",
              i === 1 ? "bg-white border-l-4 border-indigo-600" : ""
            )}>
              <div className="relative">
                <img 
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  alt="" 
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-100" 
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-sm truncate">Dr. Alan Grant</p>
                  <span className="text-[10px] text-slate-400 font-medium">10:40 AM</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-1 font-medium">Excellent. Make sure to try the...</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white">
          <div className="flex items-center gap-3">
             <img src={MOCK_MESSAGES[0].senderAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
             <div>
               <p className="font-bold text-slate-900 text-sm">Dr. Alan Grant</p>
               <p className="text-xs text-emerald-500 font-bold">Online</p>
             </div>
          </div>
          <div className="flex items-center gap-1">
             <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Phone size={20} /></button>
             <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Video size={20} /></button>
             <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Info size={20} /></button>
             <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-3 max-w-[80%]",
              msg.isMe ? "ml-auto flex-row-reverse" : ""
            )}>
              {!msg.isMe && <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full object-cover mt-auto" />}
              <div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.isMe 
                    ? "bg-indigo-600 text-white rounded-br-none" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                )}>
                  {msg.content}
                </div>
                <p className={cn("text-[10px] mt-1.5 font-bold text-slate-400", msg.isMe ? "text-right" : "")}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700"
            />
            <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;