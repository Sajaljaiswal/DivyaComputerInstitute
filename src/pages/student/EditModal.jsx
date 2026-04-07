import React, { useState } from "react";
import { X, User, Users, Hash, Mail, Phone, BookOpen, ShieldCheck, MapPin, Loader2, Edit2 } from "lucide-react";

export default function EditModal({ student, isUpdating, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...student });

  const inputStyles = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all";
  const labelStyles = "text-[10px] font-black uppercase text-slate-400 ml-1 mb-1 block";
  const iconStyles = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Edit2 size={18} className="text-orange-500" />
            <h3 className="font-black italic tracking-tight">Edit Student Profile</h3>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelStyles}>Full Name</label>
              <div className="relative">
                <User className={iconStyles} size={14} />
                <input type="text" value={formData.full_name || ""} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={inputStyles} />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Parent Name</label>
              <div className="relative">
                <Users className={iconStyles} size={14} />
                <input type="text" value={formData.parent_name || ""} 
                  onChange={(e) => setFormData({...formData, parent_name: e.target.value})} className={inputStyles} />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Roll Number</label>
              <div className="relative">
                <Hash className={iconStyles} size={14} />
                <input type="text" value={formData.roll_no || ""} 
                  onChange={(e) => setFormData({...formData, roll_no: e.target.value})} className={inputStyles} />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Email</label>
              <div className="relative">
                <Mail className={iconStyles} size={14} />
                <input type="email" value={formData.email || ""} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} className={inputStyles} />
              </div>
            </div>
            <div>
              <label className={labelStyles}>Course</label>
              <div className="relative">
                <BookOpen className={iconStyles} size={14} />
                <select value={formData.course_name} 
                  onChange={(e) => setFormData({...formData, course_name: e.target.value})} className={`${inputStyles} appearance-none`}>
                  <option>Full Stack Development</option>
                  <option>Tally Prime & GST</option>
                  <option>CCC / Basic Computing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 flex items-center justify-center gap-2">
              {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              Update Record
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}