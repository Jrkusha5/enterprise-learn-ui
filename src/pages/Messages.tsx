import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  CheckCheck
} from 'lucide-react';

const contacts = [
  { id: 1, name: 'Dr. Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah', lastMsg: 'I reviewed your last assignment...', time: '10:45 AM', online: true, unread: 2 },
  { id: 2, name: 'Support Team', avatar: 'https://i.pravatar.cc/150?u=support', lastMsg: 'How can we help you today?', time: 'Yesterday', online: false, unread: 0 },
  { id: 3, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john', lastMsg: 'The React 19 notes are great!', time: '2 days ago', online: true, unread: 0 },
  { id: 4, name: 'Marketing Group', avatar: 'https://i.pravatar.cc/150?u=group', lastMsg: 'Meeting at 3 PM', time: 'Mon', online: false, unread: 0 },
];

export const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex h-[calc(100vh-160px)] animate-in zoom-in-95 duration-500">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex gap-4 transition-colors border-b border-gray-50/50 ${
                selectedContact.id === contact.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img src={contact.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{contact.name}</h4>
                  <span className="text-[10px] text-gray-400">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                    <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={selectedContact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
             <div>
               <h3 className="font-bold text-gray-900 text-sm">{selectedContact.name}</h3>
               <p className="text-[10px] text-green-500 font-medium">Online</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
           <div className="flex flex-col items-center">
             <span className="px-3 py-1 bg-white text-[10px] font-bold text-gray-400 rounded-full border border-gray-100 uppercase tracking-widest">Today</span>
           </div>
           
           <div className="flex gap-4">
              <img src={selectedContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-auto" />
              <div className="max-w-[70%] bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Hi Alex! I've just finished reviewing your latest React assignment. Your use of the new useActionState hook was impressive.
                </p>
                <span className="text-[10px] text-gray-400 mt-2 block">10:45 AM</span>
              </div>
           </div>

           <div className="flex gap-4 flex-row-reverse">
              <div className="max-w-[70%] bg-indigo-600 p-4 rounded-2xl rounded-br-none shadow-lg shadow-indigo-100 text-white">
                <p className="text-sm leading-relaxed">
                  Thank you, Dr. Wilson! I found that hook really helpful for managing form states. Did you have any feedback on the server actions part?
                </p>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-[10px] opacity-80">10:48 AM</span>
                  <CheckCheck className="w-3 h-3" />
                </div>
              </div>
           </div>

           <div className="flex gap-4">
              <img src={selectedContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-auto" />
              <div className="max-w-[70%] bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Yes, the server actions were well-structured, but you might want to consider more robust error handling for edge cases. I'll send you a link to some documentation.
                </p>
                <span className="text-[10px] text-gray-400 mt-2 block">10:50 AM</span>
              </div>
           </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 p-2 px-4 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
            />
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 rounded-xl transition-all ${
                  message.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-200 text-white'
                }`}
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};