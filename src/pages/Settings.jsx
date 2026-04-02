import React, { useState } from 'react';
import {  Shield, Bell, Globe, Save, Monitor, Lock } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white rounded-[3rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          
          {/* Sidebar Nav */}
          <aside className="w-full md:w-64 bg-slate-50 p-6 space-y-2 border-r border-orange-50">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Configuration</p>
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Globe size={18}/>} label="Institute Profile" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock size={18}/>} label="Security" />
            <TabButton active={activeTab === 'display'} onClick={() => setActiveTab('display')} icon={<Monitor size={18}/>} label="Display" />
          </aside>

          {/* Form Content */}
          <main className="flex-1 p-10">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Institute Profile</h2>
                  <p className="text-slate-500 text-sm font-medium">Update your public identity and contact info.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingInput label="Institute Name" placeholder="Divya Computer Institute" />
                  <SettingInput label="Founder/Director Name" placeholder="Admin Name" />
                  <SettingInput label="Contact Email" placeholder="support@divya.com" />
                  <SettingInput label="Official Phone" placeholder="+91 98765 43210" />
                  <div className="md:col-span-2">
                    <SettingInput label="Office Address" placeholder="Main Road, Sector 5..." isArea />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
        active ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-800"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function SettingInput({ label, placeholder, isArea = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {isArea ? (
        <textarea placeholder={placeholder} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all min-h-[100px]" />
      ) : (
        <input type="text" placeholder={placeholder} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all" />
      )}
    </div>
  );
}