import React from "react";
import { 
  X, Mail, Phone, Users, MapPin, BookOpen, 
  GraduationCap, Calendar, ShieldCheck, Loader2 
} from "lucide-react";

function DetailItem({ label, value, icon }) {
  return (
    <div className="group">
      <label className="text-[9px] uppercase font-black text-slate-400 flex items-center gap-1.5 mb-1">
        {icon} {label}
      </label>
      <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-orange-600 transition-colors">
        {value || '—'}
      </p>
    </div>
  );
}

export default function ViewModal({ student, onClose }) {
  if (!student) return null;

  // Calculate progress percentage safely
  const progress = student.total_fee > 0 
    ? Math.round((student.paid_fee / student.total_fee) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* 1. HEADER AREA */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-5 items-center">
              <div className="h-20 w-20 rounded-3xl bg-orange-500 flex items-center justify-center text-3xl font-black shadow-2xl rotate-3">
                {student.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">{student.full_name}</h3>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/10 px-2 py-1 rounded">
                    Roll: {student.roll_no}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                    student.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={28} />
            </button>
          </div>
          {/* Decorative Background Icon */}
          <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
        </div>

        {/* 2. SCROLLABLE BODY */}
        <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
          
          {/* FINANCIAL SUMMARY */}
          <section>
            <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <BookOpen size={14} /> Fee Settlement Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Contracted Total</p>
                <p className="text-2xl font-black text-slate-800">₹{student.total_fee}</p>
              </div>
              <div className="p-5 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Total Amount Paid</p>
                <p className="text-2xl font-black text-emerald-700">₹{student.paid_fee}</p>
              </div>
              <div className={`p-5 rounded-[2rem] border ${
                student.pending_balance > 0 ? 'bg-rose-50 border-rose-100' : 'bg-blue-50 border-blue-100'
              }`}>
                <p className={`text-[10px] font-black uppercase mb-2 ${
                  student.pending_balance > 0 ? 'text-rose-600' : 'text-blue-600'
                }`}>Remaining Balance</p>
                <p className={`text-2xl font-black ${
                  student.pending_balance > 0 ? 'text-rose-700' : 'text-blue-700'
                }`}>₹{student.pending_balance}</p>
              </div>
            </div>
            
            {/* Progress Bar Visual */}
            <div className="mt-6 space-y-2 px-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Payment Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>

          {/* ACADEMIC & CONTACT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Contact Record</h4>
              <div className="space-y-4">
                <DetailItem label="Email Address" value={student.email} icon={<Mail size={14}/>} />
                <DetailItem label="Primary Phone" value={student.phone} icon={<Phone size={14}/>} />
                <DetailItem label="Parent Name" value={student.parent_name} icon={<Users size={14}/>} />
                <DetailItem label="Home Address" value={student.address} icon={<MapPin size={14}/>} />
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Academic Record</h4>
              <div className="space-y-4">
                <DetailItem label="Enrolled Course" value={student.course_name} icon={<BookOpen size={14}/>} />
                <DetailItem label="Current Grade" value={student.grade} icon={<GraduationCap size={14}/>} />
                <DetailItem label="Admission Date" value={student.admission_date} icon={<Calendar size={14}/>} />
                <DetailItem label="Last Education" value={student.education} icon={<GraduationCap size={14}/>} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOOTER */}
        <div className="p-6 bg-slate-50 border-t flex justify-between items-center px-10 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 italic">
            <Loader2 size={12} className="animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Entry UID: {student.id?.slice(0,13)}
            </span>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
          >
            Generate PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}