import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Layers, Star, Search, Code, 
  Database, Layout, FileText, ChevronRight,
  Filter, Plus, X, ShieldCheck, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from "react-hot-toast";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for New Course
  const [formData, setFormData] = useState({
    name: "",
    category: "Development",
    duration: "",
    course_fee: 0,
    modules_count: 0,
    description: ""
  });

  const navigate = useNavigate();
  const categories = ['All', 'Development', 'Office Skills', 'Design', 'General'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Ensure numeric fields are numbers
      const submissionData = {
        ...formData,
        course_fee: parseFloat(formData.course_fee),
        fee: parseFloat(formData.course_fee), // Mapping to 'fee' as per your schema default
        modules_count: parseInt(formData.modules_count)
      };

      const { error } = await supabase.from("courses").insert([submissionData]);
      if (error) throw error;

      toast.success("Course added successfully!");
      setShowAddModal(false);
      fetchCourses(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Error adding course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'All' || course.category === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Dynamic Icon Helper
  const getIcon = (cat) => {
    switch (cat) {
      case 'Development': return <Code className="text-orange-500" />;
      case 'Design': return <Layout className="text-rose-500" />;
      case 'Office Skills': return <FileText className="text-amber-500" />;
      default: return <Layers className="text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Explore <span className="text-orange-500">Courses</span></h1>
          <p className="text-slate-500 font-medium">Manage and offer industry-recognized certification programs.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {/* --- Search & Filter Tabs --- */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="p-1.5 bg-white border border-orange-100 rounded-2xl flex flex-wrap gap-2 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === cat ? "bg-orange-500 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative group flex-1 w-full lg:max-w-md ml-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by course name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-sm shadow-sm"
          />
        </div>
      </div>

      {/* --- Course Grid --- */}
      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <p className="text-slate-400 font-bold italic">Fetching academy courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-[2.5rem] border border-orange-50 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                  {getIcon(course.category)}
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider rounded-lg">
                  {course.category}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight truncate">
                {course.name}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 h-8">
                {course.description || "No description provided for this course."}
              </p>

              <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                  <Clock size={14} className="text-orange-400" /> {course.duration}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                  <BookOpen size={14} className="text-orange-400" /> {course.modules_count} Modules
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tuition Fee</p>
                  <p className="text-xl font-black text-slate-900">₹{course.course_fee || course.fee}</p>
                </div>
                <button className="bg-slate-100 text-slate-400 p-2.5 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Add Course Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic tracking-tight text-orange-500">New Academy Course</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Define Curriculum</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Course Name</label>
                <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none focus:border-orange-500" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none appearance-none" 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option>Development</option>
                    <option>Office Skills</option>
                    <option>Design</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Duration (e.g. 6 Months)</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none" 
                    onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Fee (₹)</label>
                  <input required type="number" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none" 
                    onChange={(e) => setFormData({...formData, course_fee: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Modules</label>
                  <input required type="number" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none" 
                    onChange={(e) => setFormData({...formData, modules_count: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Short Description</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm outline-none focus:border-orange-500" 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {isSubmitting ? "Saving..." : "Deploy Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}