import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock,
  X,
  ChevronRight
} from 'lucide-react';
import toast from "react-hot-toast";
import { supabase } from '../../lib/supabase';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    course: "Full Stack Development",
    admission_date: new Date().toISOString().split('T')[0],
    status: "active"
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("students").insert([formData]);
      if (error) throw error;
      
      toast.success("Student registered successfully!");
      setShowModal(false);
      fetchStudents(); // Refresh list
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 font-medium">Manage and monitor all enrolled learners.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Register New Student
        </button>
      </div>

      {/* --- Search & Filters --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, course or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-orange-50 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-medium"
          />
        </div>
        <button className="p-4 bg-white border border-orange-50 rounded-2xl text-slate-500 hover:text-orange-500 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* --- Students Table --- */}
      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-orange-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Adm. Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-orange-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm">
                        {student.full_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 leading-tight">{student.full_name}</p>
                        <p className="text-xs text-slate-400 font-medium">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{student.course}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar size={14} className="text-orange-400" />
                      {student.admission_date}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      student.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.status === 'active' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && !loading && (
          <div className="p-20 text-center text-slate-400 font-bold italic">No students found.</div>
        )}
      </div>

      {/* --- Registration Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-orange-500 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">Register Student</h3>
                <p className="text-orange-100 text-sm font-medium">Divya Computer Institute Enrollment</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                  <input 
                    type="tel" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Course</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold appearance-none"
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    <option>Full Stack Development</option>
                    <option>Tally Prime & GST</option>
                    <option>CCC / Basic Computing</option>
                    <option>Graphic Design</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-orange-600 transition-all active:scale-[0.98]"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}