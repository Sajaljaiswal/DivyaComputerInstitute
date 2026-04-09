import React, { useState, useEffect } from 'react';
import { 
  Award, Search, ShieldCheck, Star, Loader2, 
  X, CheckCircle2, GraduationCap, Trophy, FileText, Printer, FileStack, Plus, Trash2
} from 'lucide-react';
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

const DEFAULT_MODULES = [
  "Introduction to Computer Hardware", "Operating System, Fundamental, MS DOS, Windows 10",
  "MS Office - 2003, 2007, 2010", "Page Maker", "CorelDRAW", "Tally ERP 9 & Tally Prime",
  "PhotoShop", "5th Term (Communication Technology, Hindi & English Typing)",
  "E-Mail & Internet Technology", "File and Printer Sharing", "HTML and Internet",
  "Adobe Reader", "C Language", "Basic Accounts", "Foxpro", "Internet Operation"
];

export default function CertificationCenter() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Graduation Modal States
  const [showGradModal, setShowGradModal] = useState(false);
  const [selectedForGrad, setSelectedForGrad] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic Module State
  const [activeModules, setActiveModules] = useState([]);
  const [gradForm, setGradForm] = useState({
    grade: 'Excellent',
    moduleMarks: []
  });

  useEffect(() => {
    fetchAcademicRecords();
  }, []);

  const fetchAcademicRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("full_name", { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  // --- MODULE MANIPULATION ---
  const addModule = () => {
    setActiveModules([...activeModules, "New Module Name"]);
    setGradForm(prev => ({ 
      ...prev, 
      moduleMarks: [...prev.moduleMarks, 85] 
    }));
  };

  const removeModule = (index) => {
    const updatedModules = activeModules.filter((_, i) => i !== index);
    const updatedMarks = gradForm.moduleMarks.filter((_, i) => i !== index);
    setActiveModules(updatedModules);
    setGradForm(prev => ({ ...prev, moduleMarks: updatedMarks }));
  };

  const updateModuleName = (index, newName) => {
    const updated = [...activeModules];
    updated[index] = newName;
    setActiveModules(updated);
  };

  // Calculate Total Marks Dynamically
  const currentTotal = gradForm.moduleMarks.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
  const maxMarks = activeModules.length * 100;

  // --- PRINT LOGIC ---
  const printCombinedDoc = (student, modulesList, marksArray) => {
    const printWindow = window.open('', '_blank');
    const issueDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const totalSecured = marksArray.reduce((a, b) => a + b, 0);
    const totalPossible = modulesList.length * 100;
    const percentage = ((totalSecured / totalPossible) * 100).toFixed(2);

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate+Marksheet - ${student.full_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; display: flex; justify-content: center; background: #fff; }
            .cert-container { width: 210mm; height: 297mm; border: 10px double #8b5e3c; padding: 15px 25px; background: #fffdf0; box-sizing: border-box; position: relative; display: flex; flex-direction: column; }
            .header { text-align: center; margin-bottom: 5px; }
            .inst-name { font-size: 28px; font-weight: 900; color: #7c2d12; margin: 0; }
            .badge-text { display: inline-block; background: #ea580c; color: white; padding: 1px 15px; border-radius: 20px; font-weight: bold; font-size: 13px; margin: 5px 0; font-family: 'Montserrat', sans-serif;}
            .photo-box { position: absolute; top: 85px; left: 35px; width: 100px; height: 125px; border: 2px solid #ccc; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #777; z-index: 10;}
            .content-text { text-align: center; font-style: italic; font-size: 16px; line-height: 1.4; margin: 10px 0 10px 130px; }
            .content-text b { font-style: normal; color: #1e40af; text-decoration: underline; }
            .info-row { display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0; font-size: 12px; }
            .marks-table { width: 100%; border-collapse: collapse; font-size: 10.5px; border: 1px solid #000; }
            .marks-table th, .marks-table td { border: 1px solid #000; padding: 3.5px 8px; text-align: left; }
            .marks-table th { background: #fdf2e9; }
            .summary-panel { border-left: 1px solid #000; padding: 8px; vertical-align: top; width: 180px;}
            .footer { margin-top: auto; margin-bottom: 40px; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 10px; }
            .grade-scale { position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; font-size: 10px; font-weight: bold; text-align: center; color: white; }
            .scale-box { flex: 1; padding: 4px; }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="header">
              <div style="display:flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
                <div style="text-align:left;">Run by BSSST</div>
                <div style="text-align:right;">UP/Govt/Reg.No. IN-UP58033026783122W</div>
              </div>
              <h1 class="inst-name">DIVYA TECHNICAL INSTITUTE</h1>
              <div class="badge-text">Certificate + Marksheet</div>
              <p style="font-size: 11px; font-weight: bold; margin: 2px 0;">Vill.+Post Mardah, Distt. Ghazipur (U.P.) — 233226</p>
              <h2 style="color: #ea580c; font-size: 20px; margin: 10px 0;">${student.course_name}</h2>
            </div>
            <div class="photo-box">STUDENT PHOTO</div>
            <div class="content-text">
              This is to certify that <b>${student.full_name}</b> has been awarded 
              <b>${student.course_name}</b> having completed the 
              curriculum from our center with grade <b>${student.grade}</b>.
            </div>
            <div class="info-row">
              <div>Issue Date: ${issueDate}</div>
              <div style="text-align: right;">Roll No: 133935</div>
            </div>
            <table class="marks-table">
              <thead>
                <tr>
                  <th style="width: 55%">Subject / Course / Modules</th>
                  <th style="width: 10%">Max</th>
                  <th style="width: 10%">Secured</th>
                  <th style="width: 25%">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="3" style="padding:0">
                    <table style="width: 100%; border-collapse: collapse; border:none;">
                      ${modulesList.map((name, i) => `
                        <tr>
                          <td style="border:none; border-bottom: 1px solid #000; width: 73.5%;">${name}</td>
                          <td style="border:none; border-left: 1px solid #000; border-bottom: 1px solid #000; width: 13.5%; text-align:center;">100</td>
                          <td style="border:none; border-left: 1px solid #000; border-bottom: 1px solid #000; width: 13%; text-align:center;">${marksArray[i] || 0}</td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                  <td class="summary-panel">
                    <div style="margin-bottom: 8px;"><b>Total: ${totalSecured} / ${totalPossible}</b></div>
                    <div style="margin-bottom: 8px;"><b>Percentage: ${percentage}%</b></div>
                    <div style="margin-bottom: 8px;"><b>Result: PASS</b></div>
                    <div style="margin-bottom: 8px;"><b>Grade: ${student.grade}</b></div>
                    <img style="width:80px; margin-top:15px;" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.id}" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <div style="text-align: center;"><small>Official Seal</small></div>
              <div style="text-align: center; border-top: 1px solid #000; width: 200px; padding-top: 5px;">
                  <b>Santosh Kumar Prajapati</b><br/>(Director)
              </div>
            </div>
            <div class="grade-scale">
               <div class="scale-box" style="background: #1e3a8a;">Excellent: 80-100%</div>
               <div class="scale-box" style="background: #1e40af;">Good: 70-79.9%</div>
               <div class="scale-box" style="background: #1e3a8a;">Fair: 60-69.9%</div>
               <div class="scale-box" style="background: #1e40af;">Satisfactory: 50-59.9%</div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- ACTIONS ---
  const handleIssueAndPrint = async () => {
    setIsSubmitting(true);
    try {
      // Map modules and marks together for JSONB storage
      const moduleDataToSave = activeModules.map((name, index) => ({
        name,
        marks: gradForm.moduleMarks[index] || 0
      }));

      const updateData = {
        status: "completed",
        grade: gradForm.grade,
        marks_obtained: currentTotal,
        completion_date: new Date().toISOString().split('T')[0],
        module_data: moduleDataToSave
      };

      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", selectedForGrad.id);

      if (error) throw error;

      printCombinedDoc({...selectedForGrad, ...updateData}, activeModules, gradForm.moduleMarks);

      toast.success("Student Graduated & Data Saved!");
      setShowGradModal(false);
      fetchAcademicRecords();
    } catch (err) {
      toast.error(err.message || "Database Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic">Academic <span className="text-orange-500">Hall of Fame</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Certification Center</p>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
        <input 
          type="text" placeholder="Search graduates..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent rounded-3xl shadow-sm outline-none focus:border-orange-500 font-bold transition-all"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-10 py-6">Student Details</th>
              <th className="px-6 py-6">Status</th>
              <th className="px-10 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-orange-50/20 transition-colors">
                <td className="px-10 py-6">
                  <p className="font-black text-slate-800 text-lg">{student.full_name}</p>
                  <p className="text-xs text-orange-500 font-bold uppercase">{student.course_name}</p>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                    student.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {student.status || 'Active'}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  {student.status === 'completed' ? (
                    <button 
                      onClick={() => {
                        const savedMods = student.module_data?.map(m => m.name) || DEFAULT_MODULES;
                        const savedMarks = student.module_data?.map(m => m.marks) || [];
                        printCombinedDoc(student, savedMods, savedMarks);
                      }}
                      className="p-3 bg-slate-100 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <Printer size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => { 
                        setSelectedForGrad(student);
                        // Check if student already has a curriculum saved
                        if (student.module_data && student.module_data.length > 0) {
                          setActiveModules(student.module_data.map(m => m.name));
                          setGradForm({
                            grade: student.grade || 'Excellent',
                            moduleMarks: student.module_data.map(m => m.marks)
                          });
                        } else {
                          setActiveModules(DEFAULT_MODULES);
                          setGradForm({ grade: 'Excellent', moduleMarks: Array(DEFAULT_MODULES.length).fill(85) });
                        }
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

      {showGradModal && selectedForGrad && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden my-8">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic">Curriculum & Result Editor</h3>
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">{selectedForGrad.full_name}</p>
              </div>
              <button onClick={() => setShowGradModal(false)} className="p-2 bg-white/10 rounded-2xl hover:bg-white/20"><X size={24}/></button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} className="text-orange-500" /> Module Wise Marks (Max 100)
                  </h4>
                  <button onClick={addModule} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all">
                    <Plus size={14} /> Add Module
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeModules.map((name, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-orange-200 transition-colors">
                      <span className="text-[11px] font-black text-slate-300 w-5">{index + 1}</span>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => updateModuleName(index, e.target.value)}
                        className="flex-1 bg-transparent border-none font-bold text-slate-700 outline-none focus:text-orange-600 text-xs"
                      />
                      <input 
                        type="number" 
                        max="100"
                        className="w-14 p-2 bg-white border border-slate-200 rounded-lg text-center font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500/20"
                        value={gradForm.moduleMarks[index] || 0}
                        onChange={(e) => {
                          const newMarks = [...gradForm.moduleMarks];
                          newMarks[index] = parseInt(e.target.value) || 0;
                          setGradForm({...gradForm, moduleMarks: newMarks});
                        }}
                      />
                      <button onClick={() => removeModule(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Performance</label>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                    <p className="text-4xl font-black text-slate-900">{currentTotal}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Marks / {maxMarks}</p>
                    <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 transition-all duration-500" style={{width: `${(currentTotal/maxMarks)*100}%`}}></div>
                    </div>
                    <p className="mt-2 text-xs font-black text-orange-500 italic">{((currentTotal/maxMarks)*100).toFixed(2)}% Percentage</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Award Grade</label>
                  <select 
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-orange-500"
                    value={gradForm.grade} onChange={(e) => setGradForm({...gradForm, grade: e.target.value})}
                  >
                    <option>Excellent</option><option>Good</option><option>Fair</option><option>Satisfactory</option>
                  </select>
                </div>

                <button 
                  disabled={isSubmitting}
                  onClick={handleIssueAndPrint}
                  className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black shadow-2xl shadow-orange-500/30 hover:bg-slate-900 hover:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      <FileStack className="group-hover:scale-110 transition-transform" size={22} />
                      Save & Print All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}