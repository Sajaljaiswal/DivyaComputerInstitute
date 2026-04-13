import React, { useEffect, useState } from 'react';
import { FiTrash2, FiPhone, FiMapPin, FiRefreshCw, FiBook, FiSearch, FiMessageSquare } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function Request() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Requests - Matching your schema columns
  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('student_requests')
      .select('id, created_at, name, phone, address, course, description')
      .order('created_at', { ascending: false });

    if (!error) {
      setRequests(data);
    } else {
      console.error("Error fetching requests:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const deleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const { error } = await supabase
        .from('student_requests')
        .delete()
        .eq('id', id);

      
      if (!error) {
        setRequests(requests.filter(r => r.id !== id));
      } else {
        alert("Failed to delete request");
      }
    }
  };

  // Filter logic using schema-specific fields
  const filteredRequests = requests.filter(req => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    // Use optional chaining (?.) for nullable fields like address/description
    return (
      req.name?.toLowerCase().includes(term) || 
      req.course?.toLowerCase().includes(term) ||
      req.phone?.includes(term) ||
      req.address?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Admin Panel
              </span>
              <span className="text-slate-400 text-sm font-medium">
                {requests.length} Total Applications
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Student <span className="text-orange-500">Inquiries.</span></h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search name, course, city..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchRequests}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* List Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-50">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-slate-500">Syncing with database...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
            <FiMessageSquare size={32} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-400">No requests found</h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all"
              >
                {/* Applied Date (from created_at) */}
                <div className="flex flex-col items-center justify-center bg-slate-50 px-4 py-3 rounded-xl min-w-[100px]">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Applied on</span>
                  <span className="text-sm font-bold text-slate-700">
                    {new Date(request.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                {/* Info Section (Name, Course, Phone, Address) */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-800"> {request.name || "No Name"}</h3>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase rounded-full border border-orange-100">
                     <FiBook /> {request.course || "No Course"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                    <a href={`tel:${request.phone}`} className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                      <FiPhone className="text-orange-400" />{request.phone || "No Phone"}
                    </a>
                    <span className="flex items-center gap-2">
                      <FiMapPin className="text-orange-400" /> {request.address || "No address provided"}
                    </span>
                  </div>
                </div>

                {/* Description (Nullable field) */}
                <div className="md:max-w-xs w-full bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    {request.description ? `"${request.description}"` : "No specific inquiry message."}
                  </p>
                </div>

                {/* Actions */}
                <button 
                  onClick={() => deleteRequest(request.id)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}