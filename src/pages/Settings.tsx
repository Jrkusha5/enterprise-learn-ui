import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  ChevronRight,
  Camera
} from 'lucide-react';

export const Settings = () => {
  const sections = [
    { id: 'profile', label: 'Profile Information', icon: User, desc: 'Update your photo and personal details.' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Manage your password and account protection.' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control which alerts you receive.' },
    { id: 'privacy', label: 'Privacy', icon: Shield, desc: 'Configure how your data is shared.' },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard, desc: 'Manage your subscriptions and payments.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and system configuration.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-6">
             <div className="relative group">
               <img 
                 src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/1fd75570-b0d4-4a6c-8569-b2f6b662e289/student-profile-1-e114f209-1772004547190.webp" 
                 alt="" 
                 className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" 
               />
               <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-6 h-6 text-white" />
               </button>
             </div>
             <div>
               <h3 className="text-xl font-bold text-gray-900">Alex Johnson</h3>
               <p className="text-sm text-gray-500">alex.j@example.com</p>
               <div className="mt-3 flex gap-2">
                 <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">Change Photo</button>
                 <button className="px-4 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">Remove</button>
               </div>
             </div>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {sections.map((section) => (
            <button key={section.id} className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl transition-colors">
                   <section.icon className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-900 group-hover:text-indigo-900">{section.label}</h4>
                   <p className="text-xs text-gray-500">{section.desc}</p>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex items-center justify-between">
         <div>
           <h4 className="font-bold text-red-900">Deactivate Account</h4>
           <p className="text-xs text-red-700 opacity-80">This will permanently delete your data and access to all courses.</p>
         </div>
         <button className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
           Deactivate
         </button>
      </div>
    </div>
  );
};