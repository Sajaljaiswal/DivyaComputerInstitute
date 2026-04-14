import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, BookOpen, Calendar, 
  ShieldCheck, Loader2, MapPin, GraduationCap, Users,
  Search, Camera, X, FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from "react-hot-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function RegisterStudent() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [fetchingCourses, setFetchingCourses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Image States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: "Mr.",
    full_name: "",
    gender: "Male",
    parent_name: "",
    email: "",
    phone: "",
    mobile_1: "",
    mobile_2: "",
    dob: "",
    address: "",
    education: "",
    course_name: "", 
    total_fee: 0, 
    admission_date: today,
    status: "active",
    photo_url: null
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('name, fee')
          .order('name', { ascending: true });

        if (error) throw error;
        setAvailableCourses(data || []);
        
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, course_name: data[0].name, total_fee: data[0].fee }));
        }
      } catch (err) {
        toast.error("Could not load courses list");
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle Title and Auto-Gender
  const handleTitleChange = (val) => {
    let gender = "Male";
    if (val === "Ms." || val === "Mrs.") gender = "Female";
    setFormData({ ...formData, title: val, gender: gender });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('DivyaInstitite')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('DivyaInstitite')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const generatePDF = (data, imageUrl) => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 100); // Outer border

    doc.setFontSize(10);
    doc.setTextColor(0, 51, 153);
    doc.text("Website : https://divyacomputer.com", 105, 15, { align: "center" });
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Divya Technical Institute, Mardah", 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Mobile: ${data.mobile_1}`, 10, 35);
    doc.text(`Email: divyacomputer@gmail.com`, 10, 40);
    doc.text(`Date: ${data.admission_date}`, 140, 35);
    doc.text(`Reg No: ${Math.floor(1000 + Math.random() * 9000)}`, 140, 40);

    // Blue Bar
    doc.setFillColor(0, 51, 153);
    doc.rect(5, 45, 200, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text("STUDENT ADMISSION RECEIPT", 105, 50, { align: "center" });

    // Student Photo
    if (imageUrl) {
        doc.addImage(imageUrl, 'JPEG', 10, 58, 35, 40);
    }
    doc.setDrawColor(0);
    doc.rect(10, 58, 35, 40);

    // Details
    doc.setTextColor(0, 51, 153);
    doc.setFontSize(11);
    doc.text(`Name: ${data.title} ${data.full_name}`, 55, 65);
    doc.text(`Guardian: ${data.parent_name}`, 55, 73);
    doc.text(`Course: ${data.course_name}`, 55, 81);
    doc.text(`Gender: ${data.gender}`, 55, 89);
    doc.text(`Total Fee: Rs. ${data.total_fee}`, 55, 97);

    doc.save(`${data.full_name}_Admission.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let publicImageUrl = null;
      if (imageFile) {
        publicImageUrl = await uploadImage(imageFile);
      }

      const finalData = {
        ...formData,
        photo_url: publicImageUrl
      };

      const { error } = await supabase.from("students").insert([finalData]);
      if (error) throw error;

      toast.success("Student registered successfully!");
      generatePDF(finalData, imagePreview);
      navigate('/students'); 
    } catch (err) {
      toast.error(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return availableCourses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableCourses]);

  const inputStyles = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all font-semibold text-sm text-slate-700 disabled:opacity-50";
  const labelStyles = "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1";
  const iconStyles = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-500 hover:text-orange-600 mb-4 text-sm font-bold transition-all">
          <ArrowLeft size={16} /> Back to Directory
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-orange-500 text-white relative overflow-hidden flex justify-between items-center">
             <div className="relative z-10">
                <h1 className="text-2xl font-black italic tracking-tight">Student Enrollment</h1>
                <p className="text-orange-100 text-xs font-medium">Admission Date: {formData.admission_date}</p>
             </div>
             
             <div className="relative z-10">
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 hidden 
                 accept="image/*" 
                 onChange={handleImageChange} 
               />
               <div 
                 onClick={() => fileInputRef.current.click()}
                 className="w-20 h-20 rounded-2xl bg-orange-400/30 border-2 border-dashed border-orange-200 flex items-center justify-center cursor-pointer hover:bg-orange-400/50 transition-all overflow-hidden relative group"
               >
                 {imagePreview ? (
                   <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Camera size={20} className="text-white" />
                    </div>
                   </>
                 ) : (
                   <Camera size={24} className="text-orange-100" />
                 )}
               </div>
               {imagePreview && (
                 <button 
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-all"
                 >
                   <X size={12} />
                 </button>
               )}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-orange-100 pb-2">
                <User size={16} className="text-orange-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className={labelStyles}>Title</label>
                  <div className="relative">
                    <User className={iconStyles} size={16} />
                    <select 
                      className={`${inputStyles} appearance-none cursor-pointer`}
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                  </div>
                </div>
                <div className="group">
                  <label className={labelStyles}>Full Name</label>
                  <div className="relative"><User className={iconStyles} size={16} />
                    <input type="text" required className={inputStyles} placeholder="Student Name"
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
                  </div>
                </div>
                <div className="group">
                   <label className={labelStyles}>Gender (Auto)</label>
                   <div className="relative"><ShieldCheck className={iconStyles} size={16} />
                    <input type="text" readOnly className={`${inputStyles} bg-slate-100`} value={formData.gender} />
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
                  <label className={labelStyles}>Admission Date</label>
                  <div className="relative"><Calendar className={iconStyles} size={16} />
                    <input 
                      type="date" 
                      className={inputStyles}
                      value={formData.admission_date}
                      onChange={(e) => setFormData({...formData, admission_date: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>

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
                    <input type="tel" required maxLength={10} className={inputStyles} placeholder="+91"
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
                        onChange={(e) => setFormData({...formData, course_name: e.target.value, total_fee: availableCourses.find(c => c.name === e.target.value)?.fee || 0})}
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

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                type="submit" disabled={loading}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                Register & Download PDF
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