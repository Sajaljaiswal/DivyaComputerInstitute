import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Printer } from 'lucide-react';
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import GraduationModal from './GraduationModal';
import { printCombinedDoc } from './printService';

const DEFAULT_MODULES = [
  "Introduction to Computer Hardware", "Operating System, Fundamental, MS DOS, Windows 10",
  "MS Office - 2003, 2007, 2010", "Page Maker", "CorelDRAW", "Tally ERP 9 & Tally Prime",
  "PhotoShop", "5th Term (Communication Technology, Hindi & English Typing)",
  "E-Mail & Internet Technology", "File and Printer Sharing", "HTML and Internet",
  "Adobe Reader", "C Language", "Basic Accounts", "Foxpro", "Internet Operation"
];

export default function CertificationCenter() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGradModal, setShowGradModal] = useState(false);
  const [selectedForGrad, setSelectedForGrad] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeModules, setActiveModules] = useState([]);
  const [gradForm, setGradForm] = useState({ grade: 'Excellent', moduleMarks: [] });

  useEffect(() => { fetchAcademicRecords(); }, []);

  const fetchAcademicRecords = async () => {
    try {
      const { data, error } = await supabase.from("students").select("*").order("full_name", { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) { toast.error("Failed to load records"); }
  };

  const handleIssueAndPrint = async () => {
    setIsSubmitting(true);
    try {
      const currentTotal = gradForm.moduleMarks.reduce((a, b) => a + (parseInt(b) || 0), 0);
      const moduleDataToSave = activeModules.map((name, index) => ({
        name, marks: gradForm.moduleMarks[index] || 0
      }));

      const updateData = {
        status: "completed",
        grade: gradForm.grade,
        marks_obtained: currentTotal,
        completion_date: new Date().toISOString().split('T')[0],
        module_data: moduleDataToSave
      };

      const { error } = await supabase.from("students").update(updateData).eq("id", selectedForGrad.id);
      if (error) throw error;

      printCombinedDoc({...selectedForGrad, ...updateData}, activeModules, gradForm.moduleMarks);
      toast.success("Student Graduated!");
      setShowGradModal(false);
      fetchAcademicRecords();
    } catch (err) { toast.error(err.message || "Error saving"); } 
    finally { setIsSubmitting(false); }
  };

  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-slate-900 italic">Academic <span className="text-orange-500">Hall of Fame</span></h1>
      
      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
        <input 
          type="text" placeholder="Search graduates..." 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent rounded-3xl shadow-sm focus:border-orange-500 font-bold outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr><th className="px-10 py-6">Student</th><th className="px-6 py-6">Status</th><th className="px-10 py-6 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-orange-50/20">
                <td className="px-10 py-6">
                  <p className="font-black text-slate-800 text-lg">{student.full_name}</p>
                  <p className="text-xs text-orange-500 font-bold uppercase">{student.course_name}</p>
                </td>
                <td className="px-6 py-6 text-[10px] font-black uppercase">
                   {student.status || 'Active'}
                </td>
                <td className="px-10 py-6 text-right">
                  {student.status === 'completed' ? (
                    <button onClick={() => printCombinedDoc(student, student.module_data?.map(m => m.name) || DEFAULT_MODULES, student.module_data?.map(m => m.marks) || [])} className="p-3 bg-slate-100 rounded-xl hover:bg-orange-500 hover:text-white">
                      <Printer size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => { 
                        setSelectedForGrad(student);
                        const hasData = student.module_data?.length > 0;
                        setActiveModules(hasData ? student.module_data.map(m => m.name) : DEFAULT_MODULES);
                        setGradForm({ grade: student.grade || 'Excellent', moduleMarks: hasData ? student.module_data.map(m => m.marks) : Array(DEFAULT_MODULES.length).fill(85) });
                        setShowGradModal(true); 
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs hover:bg-slate-900 transition-all shadow-lg"
                    >
                      <GraduationCap size={18} /> Graduate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showGradModal && (
        <GraduationModal 
          student={selectedForGrad}
          activeModules={activeModules}
          setActiveModules={setActiveModules}
          gradForm={gradForm}
          setGradForm={setGradForm}
          onClose={() => setShowGradModal(false)}
          onSubmit={handleIssueAndPrint}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}