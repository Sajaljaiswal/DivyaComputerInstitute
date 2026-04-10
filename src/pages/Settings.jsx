import React, { useState, useEffect } from 'react';
import { Globe, Save, Lock, FileText, UserCheck, Loader2, Calendar } from 'lucide-react';
import { supabase } from "../lib/supabase"; 
import toast from "react-hot-toast";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const SETTINGS_ID = '00000000-0000-0000-0000-000000000000';
  const [formData, setFormData] = useState({
    institute_name: '', director_name: '', email: '', phone: '', address: '',
    // Post Jan 1, 2022
    run_by: '', reg_no: '', signatory_name: '', signatory_title: '',
    // Pre Jan 1, 2022
    run_by_legacy: '', reg_no_legacy: '', signatory_name_legacy: '', signatory_title_legacy: ''
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('settings').select('*').eq('id', SETTINGS_ID).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) setFormData(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from('settings').upsert({ id: SETTINGS_ID, ...formData });
      if (error) throw error;
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally { setSaving(false); }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex justify-center p-20 text-orange-500"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="bg-white rounded-[3rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          
          <aside className="w-full md:w-64 bg-slate-50 p-6 space-y-2 border-r border-orange-50">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Configuration</p>
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<Globe size={18}/>} label="Institute Profile" />
            <TabButton active={activeTab === 'certificate'} onClick={() => setActiveTab('certificate')} icon={<FileText size={18}/>} label="Certificate Settings" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Lock size={18}/>} label="Security" />
          </aside>

          <main className="flex-1 p-10">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900">Institute Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingInput label="Institute Name" value={formData.institute_name} onChange={(v) => handleChange('institute_name', v)} />
                  <SettingInput label="Founder Name" value={formData.director_name} onChange={(v) => handleChange('director_name', v)} />
                  <SettingInput label="Contact Email" value={formData.email} onChange={(v) => handleChange('email', v)} />
                  <SettingInput label="Phone" value={formData.phone} onChange={(v) => handleChange('phone', v)} />
                  <div className="md:col-span-2">
                    <SettingInput label="Address" value={formData.address} onChange={(v) => handleChange('address', v)} isArea />
                  </div>
                </div>
                <SaveButton onSave={handleSave} loading={saving} />
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className="space-y-12">
                {/* --- CURRENT CONFIG --- */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Calendar size={20}/></div>
                    <div>
                      <h3 className="font-black text-slate-900">Current Configuration</h3>
                      <p className="text-xs text-slate-500 font-bold tracking-wider">AFTER 1 JAN 2022</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingInput label="Run By" value={formData.run_by} onChange={(v) => handleChange('run_by', v)} />
                    <SettingInput label="Reg No." value={formData.reg_no} onChange={(v) => handleChange('reg_no', v)} />
                    <SettingInput label="Signatory Name" value={formData.signatory_name} onChange={(v) => handleChange('signatory_name', v)} />
                    <SettingInput label="Signatory Title" value={formData.signatory_title} onChange={(v) => handleChange('signatory_title', v)} />
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* --- LEGACY CONFIG --- */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Calendar size={20}/></div>
                    <div>
                      <h3 className="font-black text-slate-900">Legacy Configuration</h3>
                      <p className="text-xs text-slate-500 font-bold tracking-wider">BEFORE 1 JAN 2022</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingInput label="Legacy Run By" value={formData.run_by_legacy} onChange={(v) => handleChange('run_by_legacy', v)} />
                    <SettingInput label="Legacy Reg No." value={formData.reg_no_legacy} onChange={(v) => handleChange('reg_no_legacy', v)} />
                    <SettingInput label="Legacy Signatory Name" value={formData.signatory_name_legacy} onChange={(v) => handleChange('signatory_name_legacy', v)} />
                    <SettingInput label="Legacy Title" value={formData.signatory_title_legacy} onChange={(v) => handleChange('signatory_title_legacy', v)} />
                  </div>
                </section>

                <SaveButton onSave={handleSave} loading={saving} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function SaveButton({ onSave, loading }) {
  return (
    <div className="pt-6 border-t border-slate-100 flex justify-end">
      <button disabled={loading} onClick={onSave} className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${active ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-800"}`}>
      {icon} {label}
    </button>
  );
}

function SettingInput({ label, value, onChange, isArea = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {isArea ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all min-h-[100px]" />
      ) : (
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all" />
      )}
    </div>
  );
}