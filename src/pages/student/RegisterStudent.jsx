import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, BookOpen, Calendar, 
  ShieldCheck, Loader2, MapPin, GraduationCap, Hash, Users,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from "react-hot-toast";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    parent_name: "",
    email: "",
    phone: "",
    mobile_1: "",
    mobile_2: "",
    dob: "",
    address: "",
    education: "",
    roll_no: "",
    course_name: "", // Will be set once courses are loaded
    total_fee: null, // Will be set once courses are loaded
    admission_date: new Date().toISOString().split('T')[0],
    status: "active",
    photo_url: null
  });

  // --- Fetch Courses from Backend ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('name, fee')
          .order('name', { ascending: true });

        if (error) throw error;
        
        setAvailableCourses(data || []);
        
        // Set initial course selection if data exists
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, course_name: data[0].name, total_fee: data[0].fee }));
        }
      } catch (err) {
        toast.error("Could not load courses list");
        console.error(err);
      } finally {
        setFetchingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return availableCourses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableCourses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course_name) {
      toast.error("Please select a course");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("students").insert([formData]);
      if (error) throw error;
      toast.success("Student registered successfully!");
      navigate('/students'); 
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all font-semibold text-sm text-slate-700 disabled:opacity-50";
  const labelStyles = "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1";
  const iconStyles = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-4 text-sm font-bold transition-all"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-orange-500 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h1 className="text-2xl font-black italic tracking-tight">Student Enrollment</h1>
                <p className="text-orange-100 text-xs font-medium">Complete the form below to register a new learner.</p>
             </div>
             <User size={100} className="absolute -right-4 -bottom-4 text-orange-400/20 rotate-12" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Section 1: Personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-orange-100 pb-2">
                <User size={16} className="text-orange-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className={labelStyles}>Full Name</label>
                  <div className="relative"><User className={iconStyles} size={16} />
                    <input type="text" required className={inputStyles} placeholder="Student Name"
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                  <label className={labelStyles}>Parent Name</label>
                  <div className="relative"><Users className={iconStyles} size={16} />
                    <input type="text" className={inputStyles} placeholder="Guardian Name"
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                  <label className={labelStyles}>Date of Birth</label>
                  <div className="relative"><Calendar className={iconStyles} size={16} />
                    <input type="date" className={inputStyles}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                  <label className={labelStyles}>Roll Number</label>
                  <div className="relative"><Hash className={iconStyles} size={16} />
                    <input type="text" className={inputStyles} placeholder="DIV-001"
                      onChange={(e) => setFormData({...formData, roll_no: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-orange-100 pb-2">
                <Phone size={16} className="text-orange-500" /> Contact & Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className={labelStyles}>Email</label>
                  <div className="relative"><Mail className={iconStyles} size={16} />
                    <input type="email" required className={inputStyles} placeholder="email@test.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                  <label className={labelStyles}>Primary Mobile</label>
                  <div className="relative"><Phone className={iconStyles} size={16} />
                    <input type="tel" required className={inputStyles} placeholder="+91"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({...formData, mobile_1: val, phone: val});
                      }} />
                  </div>
                </div>
                <div className="group md:col-span-2">
                  <label className={labelStyles}>Full Address</label>
                  <div className="relative"><MapPin className={iconStyles} size={16} />
                    <input type="text" className={inputStyles} placeholder="Street, City, Pin Code"
                      onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Academic */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-orange-100 pb-2">
                <BookOpen size={16} className="text-orange-500" /> Academic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className={labelStyles}>Education</label>
                  <div className="relative"><GraduationCap className={iconStyles} size={16} />
                    <input type="text" className={inputStyles} placeholder="e.g. 12th / BCA"
                      onChange={(e) => setFormData({...formData, education: e.target.value})} />
                  </div>
                </div>
                
                {/* --- Dynamic Course Dropdown --- */}
                <div className="space-y-2">
                  <div className="group">
                    <label className={labelStyles}>Search & Select Course</label>
                    <div className="relative mb-2">
                      <Search className={iconStyles} size={16} />
                      <input 
                        type="text" 
                        placeholder="Search courses..." 
                        className={inputStyles}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <BookOpen className={iconStyles} size={16} />
                      <select 
                        className={`${inputStyles} appearance-none cursor-pointer`}
                        onChange={(e) => setFormData({...formData, course_name: e.target.value, total_fee: availableCourses.find(c => c.name === e.target.value)?.fee || null})}
                        value={formData.course_name}
                        disabled={fetchingCourses}
                      >
                        {fetchingCourses ? (
                          <option>Loading courses...</option>
                        ) : filteredCourses.length > 0 ? (
                          filteredCourses.map((c, index) => (
                            <option key={index} value={c.name}>
                              {c.name} (₹{c.fee})
                            </option>
                          ))
                        ) : (
                          <option>No matches found</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Submit */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                type="submit" disabled={loading || fetchingCourses}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                Register Student
              </button>
              <button 
                type="button" onClick={() => navigate(-1)}
                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}