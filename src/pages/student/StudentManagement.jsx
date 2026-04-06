import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Search,
  Calendar,
  Mail,
  Phone,
  Loader2,
  Edit2,
  Trash2,
  Eye,
  X,
  ShieldCheck,
  MapPin,
  Hash,
  Users,
  GraduationCap,
  AlertTriangle,
  User,
  BookOpen,
  Printer,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
{/* Sub-component for clean rendering */}
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
  )
}

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
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", selectedStudent.id);
      if (error) throw error;
      toast.success("Record deleted");
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
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
    const { id, created_at, pending_balance, total_balance, ...updateData } =
      selectedStudent;
    try {
      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", id);
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

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const inputStyles =
    "w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 transition-all";
  const labelStyles =
    "text-[10px] font-black uppercase text-slate-400 ml-1 mb-1 block";
  const iconStyles = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className="space-y-4 p-4 md:p-6 animate-in fade-in duration-500">
      {/* CSS for Printing */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">
            Student Directory
          </h1>
          <p className="text-slate-500 text-xs font-medium italic">
            Total Enrollment: {students.length}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 w-48 md:w-64"
            />
          </div>
          <button
            onClick={() => navigate("/students/register")}
            className="p-2 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all"
          >
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Phone
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center">
                    <Loader2
                      className="animate-spin text-orange-500 mx-auto"
                      size={24}
                    />
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-6 py-3 font-bold text-sm">
                      {student.full_name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {student.course_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {student.phone}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handlePrint(student)}
                          className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- HIDDEN PRINT FORM (Admission Form Style) --- */}
      {selectedStudent && (
        <div
          id="admission-form-print"
          className="hidden print:block p-10 bg-white text-black font-serif border-[10px] border-double border-slate-800"
        >
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h4 className="text-sm font-bold">
              Website: http://www.divya.ndlmindia.com
            </h4>
            <h1 className="text-4xl font-black text-blue-800 uppercase my-2">
              Divya Technical Institute, Mardah
            </h1>
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
                <span className="w-40 font-bold text-blue-800">
                  Student Name :
                </span>
                <span className="font-bold uppercase">
                  {selectedStudent.full_name}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">
                  Guardian Name :
                </span>
                <span className="font-bold uppercase">
                  {selectedStudent.parent_name}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">
                  Date of Birth :
                </span>
                <span className="font-bold">{selectedStudent.dob}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Mobile 1 :</span>
                <span className="font-bold">{selectedStudent.mobile_1}</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Mobile 2 :</span>
                <span className="font-bold">
                  {selectedStudent.mobile_2 || "N/A"}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">
                  Education :
                </span>
                <span className="font-bold uppercase">
                  {selectedStudent.education}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">
                  Admission Date :
                </span>
                <span className="font-bold">
                  {selectedStudent.admission_date}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">
                  Course Name :
                </span>
                <span className="font-bold text-blue-800 uppercase">
                  {selectedStudent.course_name}
                </span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-40 font-bold text-blue-800">Address :</span>
                <span className="font-bold uppercase">
                  {selectedStudent.address}
                </span>
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
                <td className="border border-black font-black py-2 bg-slate-50 uppercase">
                  User Name
                </td>
                <td className="border border-black font-black text-xl">
                  {selectedStudent.mobile_1}
                </td>
              </tr>
              <tr>
                <td className="border border-black font-black py-2 bg-slate-50 uppercase">
                  Password
                </td>
                <td className="border border-black font-black text-xl">
                  {selectedStudent.mobile_1?.slice(-4)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-3 gap-4 mt-20 text-center">
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">
              Signature of Student
            </div>
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">
              Thumb
            </div>
            <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-xs">
              Director / Principal
            </div>
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
                <h3 className="font-black italic tracking-tight">
                  Edit Student Profile
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelStyles}>Full Name</label>
                  <div className="relative">
                    <User className={iconStyles} size={14} />
                    <input
                      type="text"
                      value={selectedStudent.full_name}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          full_name: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Parent Name</label>
                  <div className="relative">
                    <Users className={iconStyles} size={14} />
                    <input
                      type="text"
                      value={selectedStudent.parent_name || ""}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          parent_name: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Roll Number</label>
                  <div className="relative">
                    <Hash className={iconStyles} size={14} />
                    <input
                      type="text"
                      value={selectedStudent.roll_no || ""}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          roll_no: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Email Address</label>
                  <div className="relative">
                    <Mail className={iconStyles} size={14} />
                    <input
                      type="email"
                      value={selectedStudent.email}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          email: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Primary Mobile</label>
                  <div className="relative">
                    <Phone className={iconStyles} size={14} />
                    <input
                      type="tel"
                      value={selectedStudent.mobile_1}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          mobile_1: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Course</label>
                  <div className="relative">
                    <BookOpen className={iconStyles} size={14} />
                    <select
                      value={selectedStudent.course_name}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          course_name: e.target.value,
                        })
                      }
                      className={`${inputStyles} appearance-none`}
                    >
                      <option>Full Stack Development</option>
                      <option>Tally Prime & GST</option>
                      <option>CCC / Basic Computing</option>
                      <option>Graphic Design</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Status</label>
                  <div className="relative">
                    <ShieldCheck className={iconStyles} size={14} />
                    <select
                      value={selectedStudent.status}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          status: e.target.value,
                        })
                      }
                      className={`${inputStyles} appearance-none`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelStyles}>Full Address</label>
                  <div className="relative">
                    <MapPin className={iconStyles} size={14} />
                    <input
                      type="text"
                      value={selectedStudent.address || ""}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          address: e.target.value,
                        })
                      }
                      className={inputStyles}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  Update Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {isViewModalOpen && selectedStudent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
      
      {/* 1. HEADER AREA */}
      <div className="p-8 bg-slate-900 text-white relative overflow-hidden shrink-0">
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex gap-5 items-center">
            <div className="h-20 w-20 rounded-3xl bg-orange-500 flex items-center justify-center text-3xl font-black shadow-2xl rotate-3">
              {selectedStudent.full_name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">{selectedStudent.full_name}</h3>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/10 px-2 py-1 rounded">
                  Roll: {selectedStudent.roll_no}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                  selectedStudent.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {selectedStudent.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>
        {/* Decorative Background Icon */}
        <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
      </div>

      {/* 2. SCROLLABLE BODY */}
      <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
        
        {/* FINANCIAL SUMMARY LOG (The "Fee Detail" section) */}
        <section>
          <h4 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <BookOpen size={14} /> Fee Settlement Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-[2rem] bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Contracted Total</p>
              <p className="text-2xl font-black text-slate-800">₹{selectedStudent.total_fee}</p>
            </div>
            <div className="p-5 rounded-[2rem] bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Total Amount Paid</p>
              <p className="text-2xl font-black text-emerald-700">₹{selectedStudent.paid_fee}</p>
            </div>
            <div className={`p-5 rounded-[2rem] border ${
              selectedStudent.pending_balance > 0 ? 'bg-rose-50 border-rose-100' : 'bg-blue-50 border-blue-100'
            }`}>
              <p className={`text-[10px] font-black uppercase mb-2 ${
                selectedStudent.pending_balance > 0 ? 'text-rose-600' : 'text-blue-600'
              }`}>Remaining Balance</p>
              <p className={`text-2xl font-black ${
                selectedStudent.pending_balance > 0 ? 'text-rose-700' : 'text-blue-700'
              }`}>₹{selectedStudent.pending_balance}</p>
            </div>
          </div>
          
          {/* Progress Bar Visual */}
          <div className="mt-6 space-y-2 px-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Payment Progress</span>
              <span>{Math.round((selectedStudent.paid_fee / selectedStudent.total_fee) * 100)}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                style={{ width: `${(selectedStudent.paid_fee / selectedStudent.total_fee) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* ACADEMIC & CONTACT INFO */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Contact Record</h4>
            <div className="space-y-4">
              <DetailItem label="Email Address" value={selectedStudent.email} icon={<Mail size={14}/>} />
              <DetailItem label="Primary Phone" value={selectedStudent.phone} icon={<Phone size={14}/>} />
              <DetailItem label="Parent Name" value={selectedStudent.parent_name} icon={<Users size={14}/>} />
              <DetailItem label="Home Address" value={selectedStudent.address} icon={<MapPin size={14}/>} />
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Academic Record</h4>
            <div className="space-y-4">
              <DetailItem label="Enrolled Course" value={selectedStudent.course_name} icon={<BookOpen size={14}/>} />
              <DetailItem label="Current Grade" value={selectedStudent.grade} icon={<GraduationCap size={14}/>} />
              <DetailItem label="Admission Date" value={selectedStudent.admission_date} icon={<Calendar size={14}/>} />
              <DetailItem label="Last Education" value={selectedStudent.education} icon={<GraduationCap size={14}/>} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER */}
      <div className="p-6 bg-slate-50 border-t flex justify-between items-center px-10">
        <div className="flex items-center gap-2 text-slate-400 italic">
          <Loader2 size={12} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Entry UID: {selectedStudent.id.slice(0,13)}</span>
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
)}



      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-slate-500 text-xs font-medium mb-6 px-4">
                This will permanently remove{" "}
                <span className="font-bold text-slate-800">
                  {selectedStudent.full_name}
                </span>{" "}
                from the database.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={confirmDelete}
                  disabled={isUpdating}
                  className="w-full py-3 bg-red-500 text-white rounded-xl font-black text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                >
                  {isUpdating ? "Deleting..." : "Yes, Delete Record"}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs hover:bg-slate-200 transition-all"
                >
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