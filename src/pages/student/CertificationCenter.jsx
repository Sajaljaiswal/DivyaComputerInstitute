import React, { useState, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  Download, 
  Printer, 
  Search, 
  CheckCircle, 
  Star,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function CertificationCenter() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo - Replace with your actual database fetch
  useEffect(() => {
    fetchAcademicRecords();
  }, []);

  const fetchAcademicRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, course, grade, marks_obtained, total_marks, completion_date")
        .eq("status", "completed"); // Only show students who finished

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load academic records");
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Montserrat:wght@400;700&display=swap');
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; }
            .cert-border { width: 900px; height: 650px; padding: 20px; border: 20px solid #f97316; background: white; position: relative; }
            .cert-content { border: 5px solid #1e293b; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 40px; text-align: center; }
            h1 { font-family: 'Cinzel', serif; font-size: 48px; color: #1e293b; margin: 20px 0; }
            h2 { font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 5px; color: #f97316; font-size: 18px; }
            .name { font-family: 'Great Vibes', cursive; font-size: 64px; color: #1e293b; margin: 20px 0; }
            .course { font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: bold; text-decoration: underline; }
            .footer { margin-top: auto; width: 100%; display: flex; justify-content: space-between; padding: 0 60px; }
            .sig { border-top: 1px solid #333; width: 200px; padding-top: 10px; font-family: sans-serif; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="cert-content">
              <h2>Certificate of Excellence</h2>
              <h1>Divya Computer Institute</h1>
              <p>This is to certify that</p>
              <div class="name">${student.full_name}</div>
              <p>has successfully completed the course in</p>
              <div class="course">${student.course}</div>
              <p>with Grade <strong>${student.grade}</strong> on this day ${new Date(student.completion_date).toLocaleDateString()}</p>
              <div class="footer">
                <div class="sig">Director Signature</div>
                <div class="sig">Academic Coordinator</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic <span className="text-orange-500">Hall of Fame</span></h1>
          <p className="text-slate-500 font-medium mt-2">Generate and verify official student credentials.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-orange-50 shadow-sm">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><ShieldCheck size={24}/></div>
            <div className="pr-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISO Verified</p>
                <p className="text-sm font-bold text-slate-800">2026 Standards</p>
            </div>
        </div>
      </div>

      {/* --- Search & Stats Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={20} />
            <input 
              type="text" 
              placeholder="Search graduate by name or roll number..." 
              className="w-full pl-12 pr-4 py-5 bg-white border border-orange-50 rounded-[2rem] outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold shadow-sm"
            />
          </div>
        </div>
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Graduates</p>
                <h3 className="text-2xl font-black">128</h3>
            </div>
            <Award className="text-orange-500" size={32} />
        </div>
      </div>

      {/* --- Student Record Table --- */}
      <div className="bg-white rounded-[3rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                <th className="px-10 py-6">Student Name</th>
                <th className="px-6 py-6">Course Completed</th>
                <th className="px-6 py-6">Performance</th>
                <th className="px-6 py-6">Completion Date</th>
                <th className="px-10 py-6 text-right">Generate Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <Star size={16} fill="currentColor" />
                        </div>
                        <p className="font-black text-slate-800">{student.full_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold text-xs uppercase">{student.course}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900">{student.grade} Grade</span>
                        <span className="text-[10px] font-bold text-slate-400">{student.marks_obtained}/{student.total_marks} Marks</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-500 font-medium">
                    {student.completion_date}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <button 
                            onClick={() => generateCertificate(student)}
                            className="p-3 bg-white border border-orange-100 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                            title="Print Certificate"
                        >
                            <Award size={18} />
                        </button>
                        <button 
                            className="p-3 bg-white border border-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2 font-bold text-xs"
                            title="Download Marksheet"
                        >
                            <FileText size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Footer Guide --- */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
            <h4 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-orange-600" /> Certificate Validation
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
                All certificates issued by Divya Computer Institute contain a unique QR code for online verification by employers and institutions. 
            </p>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                <ExternalLink className="text-orange-500" /> Marksheet Digitization
            </h4>
            <p className="text-white/60 text-sm leading-relaxed font-medium">
                Digital marksheets can be sent directly to the student's registered email once they clear the final course examination.
            </p>
        </div>
      </div>
    </div>
  );
}