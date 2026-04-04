import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Search, Filter, Calendar, CheckCircle, 
  Clock, ChevronRight, Mail, Phone, Loader2,
  Edit2, Trash2, Eye, X, ShieldCheck, MapPin, Hash, Users, GraduationCap, AlertTriangle,
  User, BookOpen, Printer
} from 'lucide-react';
import toast from "react-hot-toast";
import { supabase } from '../../lib/supabase';

export default function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handlePrint = (student) => {
    setSelectedStudent(student);
    // Short timeout to ensure state is updated before print dialog
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const confirmDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("students").delete().eq("id", selectedStudent.id);
      if (error) throw error;
      toast.success("Record deleted");
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const { id, created_at, pending_balance, total_balance, ...updateData } = selectedStudent;
    try {
      const { error } = await supabase.from("students").update(updateData).eq("id", id);
      if (error) throw error;
      toast.success("Profile updated!");
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputStyles = "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all";
  const labelStyles = "text-[10px] font-black uppercase text-slate-400 ml-1 mb-1 block";
  const iconStyles = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className="space-y-4 p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* CSS for Printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #admission-form-print, #admission-form-print * { visibility: visible; }
          #admission-form-print { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            height: auto;
          }
          @page { size: A4; margin: 0; }
        }
      `}} />

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Student Directory</h1>
          <p className="text-slate-500 text-xs font-medium italic">Total Enrollment: {students.length}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" placeholder="Search..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 w-48 md:w-64"
            />
          </div>
          <button onClick={() => navigate('/students/register')} className="p-2 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all"><UserPlus size={20}/></button>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="3" className="py-12 text-center"><Loader2 className="animate-spin text-orange-500 mx-auto" size={24} /></td></tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-3 font-bold text-sm">{student.full_name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{student.course_name}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handlePrint(student)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all"><Printer size={16} /></button>
                      <button onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"><Eye size={16} /></button>
                      <button onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => { setSelectedStudent(student); setIsDeleteModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- HIDDEN PRINT FORM (Admission Form Style) --- */}
      {selectedStudent && (
        <div id="admission-form-print" className="hidden print:block p-10 bg-white text-black font-serif border-[10px] border-double border-slate-800">
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h4 className="text-sm font-bold">Website: http://www.divya.ndlmindia.com</h4>
            <h1 className="text-4xl font-black text-blue-800 uppercase my-2">Divya Technical Institute, Mardah</h1>
            <div className="flex justify-center gap-10 font-bold text-blue-900">
               <span>Mobile: 9792257501</span>
               <span>eMail: divyacomputer2@gmail.com</span>
            </div>
          </div>

          <div className="bg-black text-white text-center py-2 my-4 font-black text-xl tracking-widest uppercase">
            STUDENT'S ADMISSION FORM
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Student Name :</span>
                <span className="font-bold uppercase">{selectedStudent.full_name}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Guardian Name :</span>
                <span className="font-bold uppercase">{selectedStudent.parent_name}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Date of Birth :</span>
                <span className="font-bold">{selectedStudent.dob}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Mobile 1 :</span>
                <span className="font-bold">{selectedStudent.mobile_1}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Mobile 2 :</span>
                <span className="font-bold">{selectedStudent.mobile_2 || 'N/A'}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Education :</span>
                <span className="font-bold uppercase">{selectedStudent.education}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Admission Date :</span>
                <span className="font-bold">{selectedStudent.admission_date}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Course Name :</span>
                <span className="font-bold text-blue-800 uppercase">{selectedStudent.course_name}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Address :</span>
                <span className="font-bold uppercase">{selectedStudent.address}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 h-56 border-2 border-slate-900 flex items-center justify-center bg-slate-50 text-slate-300 font-bold">
                Paste Photo Here
              </div>
            </div>
          </div>

          <div className="bg-yellow-200 border-y-2 border-black text-center py-1 mt-10 font-black text-lg">
            STUDENT CORNER DETAIL
          </div>
          <table className="w-full border-collapse border border-black text-center">
            <tbody>
              <tr>
                <td className="border border-black font-black py-2 bg-slate-50 uppercase">User Name</td>
                <td className="border border-black font-black text-xl">{selectedStudent.mobile_1}</td>
              </tr>
              <tr>
                <td className="border border-black font-black py-2 bg-slate-50 uppercase">Password</td>
                <td className="border border-black font-black text-xl">{selectedStudent.mobile_1?.slice(-4)}</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-3 gap-4 mt-20 text-center">
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">Signature of Student</div>
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">Thumb</div>
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">Director / Principal</div>
          </div>
        </div>
      )}

      {/* --- Full Edit Modal --- */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Edit2 size={18} className="text-orange-500" />
                <h3 className="font-black italic tracking-tight">Edit Student Profile</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelStyles}>Full Name</label>
                  <div className="relative"><User className={iconStyles} size={14} /><input type="text" value={selectedStudent.full_name} onChange={(e) => setSelectedStudent({...selectedStudent, full_name: e.target.value})} className={inputStyles} /></div>
                </div>
                <div>
                  <label className={labelStyles}>Parent Name</label>
                  <div className="relative"><Users className={iconStyles} size={14} /><input type="text" value={selectedStudent.parent_name || ''} onChange={(e) => setSelectedStudent({...selectedStudent, parent_name: e.target.value})} className={inputStyles} /></div>
                </div>
                <div>
                  <label className={labelStyles}>Roll Number</label>
                  <div className="relative"><Hash className={iconStyles} size={14} /><input type="text" value={selectedStudent.roll_no || ''} onChange={(e) => setSelectedStudent({...selectedStudent, roll_no: e.target.value})} className={inputStyles} /></div>
                </div>
                <div>
                  <label className={labelStyles}>Email Address</label>
                  <div className="relative"><Mail className={iconStyles} size={14} /><input type="email" value={selectedStudent.email} onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})} className={inputStyles} /></div>
                </div>
                <div>
                  <label className={labelStyles}>Primary Mobile</label>
                  <div className="relative"><Phone className={iconStyles} size={14} /><input type="tel" value={selectedStudent.mobile_1} onChange={(e) => setSelectedStudent({...selectedStudent, mobile_1: e.target.value})} className={inputStyles} /></div>
                </div>
                <div>
                  <label className={labelStyles}>Course</label>
                  <div className="relative"><BookOpen className={iconStyles} size={14} />
                    <select value={selectedStudent.course_name} onChange={(e) => setSelectedStudent({...selectedStudent, course_name: e.target.value})} className={`${inputStyles} appearance-none`}>
                      <option>Full Stack Development</option><option>Tally Prime & GST</option><option>CCC / Basic Computing</option><option>Graphic Design</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Status</label>
                  <div className="relative"><ShieldCheck className={iconStyles} size={14} />
                    <select value={selectedStudent.status} onChange={(e) => setSelectedStudent({...selectedStudent, status: e.target.value})} className={`${inputStyles} appearance-none`}>
                      <option value="active">Active</option><option value="pending">Pending</option><option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyles}>Full Address</label>
                  <div className="relative"><MapPin className={iconStyles} size={14} /><input type="text" value={selectedStudent.address || ''} onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})} className={inputStyles} /></div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button type="submit" disabled={isUpdating} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                  Update Record
                </button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* --- View Details Modal --- */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 tracking-tight">Student Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-center pb-4">
                <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-3xl font-black italic border-4 border-white shadow-lg">
                  {selectedStudent.full_name?.charAt(0)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div><label className="text-[10px] uppercase font-black text-slate-400 block">Roll No</label><p className="font-bold">{selectedStudent.roll_no || 'N/A'}</p></div>
                <div><label className="text-[10px] uppercase font-black text-slate-400 block">Status</label><p className="font-bold capitalize text-emerald-600">{selectedStudent.status}</p></div>
                <div className="col-span-2"><label className="text-[10px] uppercase font-black text-slate-400 block">Full Name</label><p className="font-bold">{selectedStudent.full_name}</p></div>
                <div className="col-span-2"><label className="text-[10px] uppercase font-black text-slate-400 block">Parent Name</label><p className="font-bold">{selectedStudent.parent_name || 'N/A'}</p></div>
                <div className="col-span-2"><label className="text-[10px] uppercase font-black text-slate-400 block">Email</label><p className="font-bold">{selectedStudent.email || 'N/A'}</p></div>

                <div><label className="text-[10px] uppercase font-black text-slate-400 block">Mobile</label><p className="font-bold">{selectedStudent.mobile_1}</p></div>
                <div><label className="text-[10px] uppercase font-black text-slate-400 block">Course</label><p className="font-bold">{selectedStudent.course_name}</p></div>
                <div className="col-span-2"><label className="text-[10px] uppercase font-black text-slate-400 block">Address</label><p className="font-bold">{selectedStudent.address || 'N/A'}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Are you sure?</h3>
              <p className="text-slate-500 text-xs font-medium mb-6 px-4">This will permanently remove <span className="font-bold text-slate-800">{selectedStudent.full_name}</span> from the database.</p>
              
              <div className="flex flex-col gap-2">
                <button onClick={confirmDelete} disabled={isUpdating} className="w-full py-3 bg-red-500 text-white rounded-xl font-black text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100">
                  {isUpdating ? "Deleting..." : "Yes, Delete Record"}
                </button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}