import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Star, 
  Search, 
  Code, 
  Database, 
  Layout, 
  FileText, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COURSES = [
  {
    id: 1,
    title: "Full Stack Web Development",
    category: "Development",
    duration: "6 Months",
    modules: 12,
    rating: 4.9,
    price: "₹15,000",
    icon: <Code className="text-orange-500" />,
    desc: "Master HTML, CSS, JavaScript, React, and Node.js with real-world projects."
  },
  {
    id: 2,
    title: "Advanced Tally Prime & GST",
    category: "Office Skills",
    duration: "3 Months",
    modules: 8,
    rating: 4.8,
    price: "₹8,000",
    icon: <FileText className="text-amber-500" />,
    desc: "Professional accounting with GST filing, payroll, and inventory management."
  },
  {
    id: 3,
    title: "Python Data Science",
    category: "Development",
    duration: "4 Months",
    modules: 10,
    rating: 4.7,
    price: "₹12,000",
    icon: <Database className="text-indigo-500" />,
    desc: "Learn Python basics to advanced data visualization and machine learning."
  },
  {
    id: 4,
    title: "Graphic Design (UI/UX)",
    category: "Design",
    duration: "3 Months",
    modules: 9,
    rating: 4.9,
    price: "₹10,000",
    icon: <Layout className="text-rose-500" />,
    desc: "Design stunning interfaces using Figma, Photoshop, and Illustrator."
  },
  {
    id: 5,
    title: "CCC & Basic Computing",
    category: "Office Skills",
    duration: "2 Months",
    modules: 6,
    rating: 4.6,
    price: "₹3,500",
    icon: <Layers className="text-emerald-500" />,
    desc: "Perfect for beginners. Learn Windows, MS Office, and Internet basics."
  }
];

export default function MyCourses() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Development', 'Office Skills', 'Design'];

  const filteredCourses = COURSES.filter(course => {
    const matchesFilter = filter === 'All' || course.category === filter;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explores <span className="text-orange-500">Courses</span></h1>
          <p className="text-slate-500 font-medium mt-2">Elevate your skills with our industry-recognized certification programs.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm"
          />
        </div>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="p-1.5 bg-orange-50 rounded-2xl flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === cat 
                  ? "bg-white text-orange-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-2 ml-auto text-slate-400 text-xs font-bold uppercase tracking-widest">
          <Filter size={14} /> {filteredCourses.length} Courses Found
        </div>
      </div>

      {/* --- Course Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-[2.5rem] border border-orange-50 p-2 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all group overflow-hidden"
          >
            <div className="p-6">
              {/* Icon & Category */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                  {course.icon}
                </div>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  {course.category}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                {course.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                {course.desc}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock size={14} className="text-orange-400" />
                  <span className="text-xs font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <BookOpen size={14} className="text-orange-400" />
                  <span className="text-xs font-bold">{course.modules} Modules</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-black text-slate-900">{course.rating}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Course Fee</p>
                  <p className="text-xl font-black text-slate-900">{course.price}</p>
                </div>
                <button 
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-slate-900 text-white p-3 rounded-2xl group-hover:bg-orange-500 transition-all shadow-lg shadow-slate-100 group-hover:shadow-orange-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Empty State --- */}
      {filteredCourses.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-orange-200">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800">No courses found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filter settings.</p>
          <button 
            onClick={() => {setFilter('All'); setSearchQuery('');}}
            className="mt-6 text-orange-500 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* --- Bottom CTA --- */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-orange-200">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black mb-2">Not sure which path to pick?</h2>
          <p className="text-orange-50 font-medium">Talk to our career counselor for a free guidance session.</p>
        </div>
        <button className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">
          Request Callback
        </button>
      </div>
    </div>
  );
}