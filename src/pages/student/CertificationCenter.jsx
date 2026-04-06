import React, { useState, useEffect } from 'react';
import { 
  Award, Search, ShieldCheck, Star, Loader2, 
  X, CheckCircle2, GraduationCap, Trophy, FileText, Printer 
} from 'lucide-react';
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function CertificationCenter() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Graduation Modal States
  const [showGradModal, setShowGradModal] = useState(false);
  const [selectedForGrad, setSelectedForGrad] = useState(null);
  const [gradForm, setGradForm] = useState({ grade: 'Excellent', marks: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleGraduateStudent = async (e) => {
    e.preventDefault();
    if (!gradForm.marks) return toast.error("Please enter marks");

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("students")
        .update({
          status: "completed",
          grade: gradForm.grade,
          marks_obtained: parseInt(gradForm.marks),
          completion_date: new Date().toISOString().split('T')[0]
        })
        .eq("id", selectedForGrad.id);

      if (error) throw error;

      toast.success(`${selectedForGrad.full_name} has graduated!`);
      setShowGradModal(false);
      fetchAcademicRecords();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- OPTION 1: AWARD CERTIFICATE (Image 1 Style) ---
  const printAwardCertificate = (student) => {
    const printWindow = window.open('', '_blank');
    const issueDate = new Date(student.completion_date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${student.full_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@400;700&display=swap');
            body { margin: 0; padding: 20px; font-family: 'Montserrat', sans-serif; display: flex; justify-content: center; background: #f0f0f0; }
            .cert-body { width: 800px; background: #fffdf5; border: 15px double #f97316; padding: 30px; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            .header-top { text-align: center; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; margin-bottom: 20px; }
            .inst-name { font-family: 'Cinzel', serif; font-size: 32px; font-weight: bold; color: #1e293b; margin: 0; }
            .photo-frame { position: absolute; top: 130px; left: 40px; width: 110px; height: 130px; border: 2px solid #ddd; background: #f9f9f9; text-align: center; font-size: 10px; padding-top: 50px; box-sizing: border-box; }
            .cert-title { text-align: center; font-size: 26px; color: #ea580c; font-weight: 800; margin: 20px 0; }
            .main-content { margin-left: 140px; text-align: center; line-height: 2; font-size: 18px; color: #334155; }
            .qr-area { position: absolute; bottom: 80px; left: 40px; width: 100px; height: 100px; }
            .footer-sigs { display: flex; justify-content: flex-end; margin-top: 80px; padding-right: 40px; }
            .sig-line { border-top: 2px solid #1e293b; width: 220px; text-align: center; font-size: 12px; font-weight: bold; padding-top: 5px; }
            .grade-footer { position: absolute; bottom: 15px; width: 90%; left: 5%; border-top: 1px solid #eee; display: flex; justify-content: space-around; font-size: 10px; font-weight: bold; color: #64748b; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="cert-body">
            <div class="header-top">
              <h1 class="inst-name">DIVYA TECHNICAL INSTITUTE</h1>
              <small>Affiliated with Mata Kanti Devi Institute of IT | Reg No: 1380</small>
            </div>
            <div class="photo-frame">STUDENT<br/>PHOTO</div>
            <div class="cert-title">${student.course_name}</div>
            <div class="main-content">
              This is to certify that <b>${student.full_name}</b><br/>
              has been awarded <b>${student.course_name}</b> having<br/>
              completed the curriculum from our center with<br/>
              grade <b>${student.grade}</b> given under our supervision.<br/>
              <br/>
              <b>Certificate issued on: ${issueDate}</b>
            </div>
            <img class="qr-area" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${student.id}" />
            <div class="footer-sigs">
              <div class="sig-line">Director<br/>Santosh Kumar Prajapati</div>
            </div>
            <div class="grade-footer">
              <span>Excellent: 80-100%</span><span>Good: 70-79.9%</span><span>Fair: 60-69.9%</span><span>Satisfactory: 50-59.9%</span>
            </div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- OPTION 2: DETAILED MARKSHEET (Image 2 Style) ---
  const printDetailedMarksheet = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Marksheet - ${student.full_name}</title>
          <style>
            body { padding: 40px; font-family: Arial, sans-serif; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #f97316; margin-bottom: 20px; }
            .details-grid { display: flex; justify-content: space-between; margin: 20px 0; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #444; padding: 12px; text-align: left; }
            th { background: #f8fafc; font-size: 12px; text-transform: uppercase; }
            .result-box { border: 2px solid #1e293b; padding: 15px; margin-top: 20px; display: flex; justify-content: space-between; font-weight: bold; }
            .qr-marksheet { text-align: center; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; font-size: 28px;">DIVYA TECHNICAL INSTITUTE</h1>
            <p style="font-weight: bold; color: #f97316;">Statement of Marks & Evaluation</p>
          </div>
          <div class="details-grid">
            <div>
              <b>Student:</b> ${student.full_name}<br/>
              <b>Course:</b> ${student.course_name}
            </div>
            <div style="text-align: right;">
              <b>Certificate No:</b> 2009${student.id.slice(0,5)}<br/>
              <b>Issue Date:</b> ${new Date().toLocaleDateString()}
            </div>
          </div>
          <table>
            <thead><tr><th>Modules / Subjects</th><th>Max Marks</th><th>Marks Obtained</th></tr></thead>
            <tbody>
              <tr><td>Computer Fundamentals & OS</td><td>100</td><td>${student.marks_obtained}</td></tr>
              <tr><td>MS Office Suite (Word/Excel/PPT)</td><td>100</td><td>84</td></tr>
              <tr><td>Accounting & Tally ERP</td><td>100</td><td>86</td></tr>
              <tr><td>Internet & Web Technology</td><td>100</td><td>82</td></tr>
            </tbody>
          </table>
          <div class="result-box">
            <span>Result: PASS</span>
            <span>Grade: ${student.grade}</span>
            <span>Percentage: ${((student.marks_obtained/100)*100).toFixed(2)}%</span>
          </div>
          <div class="qr-marksheet">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${student.id}" /><br/>
            <small>Scan to verify student credentials online</small>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 italic">Academic <span className="text-orange-500">Hall of Fame</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Credentials & Certification Management</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-orange-100 shadow-sm flex items-center gap-4">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Trophy size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Graduates</p>
            <p className="text-2xl font-black text-slate-900">{students.filter(s => s.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
        <input 
          type="text" placeholder="Search by graduate name..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-8 py-6 bg-white border-2 border-transparent rounded-[2.5rem] shadow-sm outline-none focus:border-orange-500 font-bold transition-all text-xl"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] border border-orange-50 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                <th className="px-10 py-8">Graduate Details</th>
                <th className="px-6 py-8">Status</th>
                <th className="px-6 py-8">Scorecard</th>
                <th className="px-10 py-8 text-right">Print Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/30">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="px-10 py-8">
                    <p className="font-black text-slate-800 text-lg">{student.full_name}</p>
                    <p className="text-sm text-orange-500 font-bold uppercase tracking-tight">{student.course_name}</p>
                  </td>
                  <td className="px-6 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      student.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {student.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-8">
                    {student.status === 'completed' ? (
                      <div>
                        <p className="font-black text-slate-900">Grade: {student.grade}</p>
                        <p className="text-xs font-bold text-slate-400">Score: {student.marks_obtained}</p>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-sm">Processing...</span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    {student.status === 'completed' ? (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => printAwardCertificate(student)}
                          className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-orange-500 transition-all shadow-lg"
                        >
                          <Award size={16} /> Certificate
                        </button>
                        <button onClick={() => printDetailedMarksheet(student)}
                          className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all"
                        >
                          <FileText size={16} /> Marksheet
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setSelectedForGrad(student); setShowGradModal(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs hover:bg-slate-900 transition-all shadow-lg"
                      >
                        <GraduationCap size={18} /> Graduate Student
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graduation Modal */}
      {showGradModal && selectedForGrad && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-orange-100 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black italic">Set Final Result</h3>
                <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">{selectedForGrad.full_name}</p>
              </div>
              <button onClick={() => setShowGradModal(false)} className="p-2 bg-white/10 rounded-2xl hover:bg-white/20"><X size={24}/></button>
            </div>
            <form onSubmit={handleGraduateStudent} className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Grade</label>
                <select className="w-full mt-2 px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none font-bold text-lg"
                  value={gradForm.grade} onChange={(e) => setGradForm({...gradForm, grade: e.target.value})}
                >
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Satisfactory</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Total Marks Secured</label>
                <input type="number" required placeholder="Enter Marks" className="w-full mt-2 px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none font-bold text-lg"
                  value={gradForm.marks} onChange={(e) => setGradForm({...gradForm, marks: e.target.value})}
                />
              </div>
              <button disabled={isSubmitting} className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <><CheckCircle2 size={24}/> Issue Credentials</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}