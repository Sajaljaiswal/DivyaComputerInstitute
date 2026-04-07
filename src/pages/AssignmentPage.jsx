import React, { useState } from 'react';
import { 
  Coffee, 
  Plus, 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Download
} from 'lucide-react';
import toast from "react-hot-toast";

const INITIAL_ASSIGNMENTS = [
  { id: 1, title: "React Components & Props", course: "Web Dev", deadline: "2026-04-10", submissions: 12, status: "Active" },
  { id: 2, title: "GST Ledger Entry Task", course: "Tally Prime", deadline: "2026-04-05", submissions: 28, status: "Urgent" },
  { id: 3, title: "Python Loops & Logic", course: "Data Science", deadline: "2026-04-15", submissions: 5, status: "Draft" }
];

export default function AssignmentPage() {
  const [tasks, setTasks] = useState(INITIAL_ASSIGNMENTS);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignment <span className="text-orange-500">Vault</span></h1>
          <p className="text-slate-500 font-medium">Create and track practical tasks for your students.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-orange-500 transition-all shadow-xl shadow-slate-100">
          <Plus size={20} /> Create New Task
        </button>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <FileText size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                task.status === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {task.status}
              </span>
            </div>
            
            <h3 className="text-lg font-black text-slate-800 mb-2">{task.title}</h3>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-tighter mb-6">{task.course}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Calendar size={14} /> Due: {task.deadline}
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Users size={14} /> {task.submissions} Submissions
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50">
              <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-orange-50 hover:text-orange-600 transition-colors">View All</button>
              <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-orange-500"><Download size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}