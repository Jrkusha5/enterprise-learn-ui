import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Globe, Camera, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { MOCK_USER } from '../data/mock';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 space-y-1">
          {['profile', 'account', 'notifications', 'privacy'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-xl transition-all capitalize",
                activeTab === tab ? "bg-white shadow-sm border border-slate-200 text-indigo-600" : "text-slate-500"
              )}
            >
              <span className="text-sm font-semibold">{tab}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input type="text" defaultValue={MOCK_USER.STUDENT.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" defaultValue={MOCK_USER.STUDENT.email} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>
            <div className="mt-10 flex justify-end gap-3">
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;