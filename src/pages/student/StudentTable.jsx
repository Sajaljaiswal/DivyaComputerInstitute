import { Loader2, Printer, Eye, Edit2, Trash2 } from "lucide-react";

export default function StudentTable({ students, loading, onPrint, onView, onEdit, onDelete }) {
  if (loading) return (
    <div className="py-12 text-center bg-white rounded-[1.5rem] border border-slate-100">
      <Loader2 className="animate-spin text-orange-500 mx-auto" size={24} />
    </div>
  );

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden print:hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Date</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-all">
                <td className="px-6 py-3 font-bold text-sm">{student.full_name}</td>
                <td className="px-6 py-3 font-bold text-sm">{student.admission_date}</td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{student.course_name}</td>
                <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{student.status}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onPrint(student)} className="p-1.5 text-slate-400 hover:text-orange-600"><Printer size={16} /></button>
                    <button onClick={() => onView(student)} className="p-1.5 text-slate-400 hover:text-blue-500"><Eye size={16} /></button>
                    <button onClick={() => onEdit(student)} className="p-1.5 text-slate-400 hover:text-orange-500"><Edit2 size={16} /></button>
                    <button onClick={() => onDelete(student)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}