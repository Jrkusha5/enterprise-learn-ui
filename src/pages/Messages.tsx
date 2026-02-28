import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Plus,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  CheckCheck,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isMe: boolean;
  time: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  online: boolean;
  unread: number;
}

const initialContacts: Contact[] = [
  { id: 1, name: 'Dr. Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=sarah', lastMsg: 'I reviewed your last assignment...', time: '10:45 AM', online: true, unread: 2 },
  { id: 2, name: 'Support Team', avatar: 'https://i.pravatar.cc/150?u=support', lastMsg: 'How can we help you today?', time: 'Yesterday', online: false, unread: 0 },
  { id: 3, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john', lastMsg: 'The React 19 notes are great!', time: '2 days ago', online: true, unread: 0 },
  { id: 4, name: 'Marketing Group', avatar: 'https://i.pravatar.cc/150?u=group', lastMsg: 'Meeting at 3 PM', time: 'Mon', online: false, unread: 0 },
];

const initialMessagesByContact: Record<number, Message[]> = {
  1: [
    { id: 'm1', content: "Hi Alex! I've just finished reviewing your latest React assignment. Your use of the new useActionState hook was impressive.", isMe: false, time: '10:45 AM' },
    { id: 'm2', content: "Thank you, Dr. Wilson! I found that hook really helpful for managing form states. Did you have any feedback on the server actions part?", isMe: true, time: '10:48 AM' },
    { id: 'm3', content: "Yes, the server actions were well-structured, but you might want to consider more robust error handling for edge cases. I'll send you a link to some documentation.", isMe: false, time: '10:50 AM' },
  ],
  2: [],
  3: [],
  4: [],
};

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export const Messages = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact>(initialContacts[0]);
  const [message, setMessage] = useState('');
  const [messagesByContact, setMessagesByContact] = useState<Record<number, Message[]>>(initialMessagesByContact);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = messagesByContact[selectedContact.id] ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (message.trim()) {
      setTypingIndicator(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingIndicator(false), 2000);
    } else {
      setTypingIndicator(false);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [message]);

  const filteredContacts = searchQuery.trim()
    ? contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : contacts;

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      content: text,
      isMe: true,
      time: formatTime(),
    };
    setMessagesByContact(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] ?? []), newMsg],
    }));
    setMessage('');
    setTypingIndicator(false);
    setContacts(prev =>
      prev.map(c =>
        c.id === selectedContact.id
          ? { ...c, lastMsg: text, time: 'Just now', unread: 0 }
          : c
      )
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex h-[calc(100vh-160px)] animate-in zoom-in-95 duration-500">
      <div className="w-80 border-r border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No conversations match your search.</div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 flex gap-4 transition-colors border-b border-gray-50 dark:border-gray-700/50 ${
                  selectedContact.id === contact.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="relative">
                  <img src={contact.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{contact.name}</h4>
                    <span className="text-[10px] text-gray-400">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.lastMsg}</p>
                    {contact.unread > 0 && (
                      <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={selectedContact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{selectedContact.name}</h3>
              <p className="text-[10px] text-green-500 font-medium">{selectedContact.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-gray-900/30">
          <div className="flex flex-col items-center">
            <span className="px-3 py-1 bg-white dark:bg-gray-800 text-[10px] font-bold text-gray-400 rounded-full border border-gray-100 dark:border-gray-700 uppercase tracking-widest">Today</span>
          </div>

          {messages.map((msg) =>
            msg.isMe ? (
              <div key={msg.id} className="flex gap-4 flex-row-reverse">
                <div className="max-w-[70%] bg-indigo-600 p-4 rounded-2xl rounded-br-none shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 text-white">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span className="text-[10px] opacity-80">{msg.time}</span>
                    <CheckCheck className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex gap-4">
                <img src={selectedContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-auto" />
                <div className="max-w-[70%] bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">{msg.time}</span>
                </div>
              </div>
            )
          )}

          {typingIndicator && (
            <div className="flex gap-4">
              <img src={selectedContact.avatar} alt="" className="w-8 h-8 rounded-full object-cover mt-auto" />
              <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 italic">typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 px-4 rounded-2xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Plus className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Smile className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`p-2 rounded-xl transition-all ${
                  message.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30' : 'bg-gray-200 dark:bg-gray-700 text-white'
                }`}
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
