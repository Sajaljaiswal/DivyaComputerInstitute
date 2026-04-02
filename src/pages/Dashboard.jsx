import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, Wallet, BookOpen, AlertCircle, 
  ArrowRight, UserPlus, Users, RefreshCcw, 
  Calendar, Filter, CheckCircle, TrendingUp 
} from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import { format } from "date-fns/format";
import { subDays } from "date-fns/subDays";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";

const COLORS = ["#f97316", "#fbbf24", "#6366f1", "#10b981", "#f43f5e"];

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingFees: 0,
    activeStudents: 0,
    newEnrollments: 0
  });
  const [feeReminders, setFeeReminders] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("last30");
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  });

  const fetchDashboardData = useCallback(async (start, end) => {
    try {
      setLoading(true);
      const startISO = startOfDay(new Date(start)).toISOString();
      const endISO = endOfDay(new Date(end)).toISOString();

      // Queries for the Institute
      const [paymentsRes, studentsRes, coursesRes] = await Promise.all([
        supabase.from("payments").select("amount, created_at").gte("created_at", startISO).lte("created_at", endISO),
        supabase.from("students").select("status, course_name, pending_balance, created_at"),
        supabase.from("courses").select("name, fee")
      ]);

      if (paymentsRes.error || studentsRes.error) throw new Error();

      // Calculate Revenue
      const revenue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      
      // Calculate Pending Fees & Active Students
      const pending = studentsRes.data?.reduce((sum, s) => sum + Number(s.pending_balance || 0), 0) || 0;
      const active = studentsRes.data?.filter(s => s.status === 'active').length || 0;
      const newJoins = studentsRes.data?.filter(s => s.created_at >= startISO).length || 0;

      // Group students by course for the Pie Chart
      const courseMap = {};
      studentsRes.data?.forEach(s => {
        courseMap[s.course_name] = (courseMap[s.course_name] || 0) + 1;
      });
      const formattedCourseData = Object.keys(courseMap).map(key => ({ name: key, value: courseMap[key] }));

      // Students with high pending balance
      const reminders = studentsRes.data?.filter(s => Number(s.pending_balance) > 0)
        .sort((a, b) => b.pending_balance - a.pending_balance).slice(0, 5) || [];

      setStats({
        totalRevenue: revenue,
        pendingFees: pending,
        activeStudents: active,
        newEnrollments: newJoins
      });
      setFeeReminders(reminders);
      setCourseData(formattedCourseData);
    } catch (err) {
      toast.error("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const applyQuickFilter = (type) => {
    setActiveFilter(type);
    let start = new Date();
    if (type === "last7") start.setDate(start.getDate() - 7);
    else if (type === "last30") start.setDate(start.getDate() - 30);
    
    const sStr = start.toISOString().split('T')[0];
    const eStr = new Date().toISOString().split('T')[0];
    setDateRange({ start: sStr, end: eStr });
    fetchDashboardData(sStr, eStr);
  };

  useEffect(() => {
    fetchDashboardData(dateRange.start, dateRange.end);
  }, []);

  if (loading && stats.totalRevenue === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold">Loading Academic Insights...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Institute Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, Admin. Here is what's happening.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-orange-50 p-1.5 rounded-2xl">
            {['last7', 'last30'].map((id) => (
              <button
                key={id}
                onClick={() => applyQuickFilter(id)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  activeFilter === id ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {id === 'last7' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <button onClick={() => fetchDashboardData(dateRange.start, dateRange.end)} className="p-3 text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<TrendingUp />} color="text-orange-600" bg="bg-orange-50" label="Total Students" value={`₹${stats.totalRevenue}`} />
        <StatCard icon={<AlertCircle />} color="text-rose-600" bg="bg-rose-50" label="Pending Fees" value={`₹${stats.pendingFees}`} />
        <StatCard icon={<Users />} color="text-indigo-600" bg="bg-indigo-50" label="Active Students" value={stats.activeStudents} />
        <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl">
          <div className="p-3 bg-white/10 rounded-2xl w-fit mb-4"><UserPlus size={24} /></div>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">New Enrollments</p>
          <h2 className="text-2xl font-black">{stats.newEnrollments} Students</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6">Revenue Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'Target', val: stats.totalRevenue + stats.pendingFees}, {name: 'Collected', val: stats.totalRevenue}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#fff7ed'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="val" fill="#f97316" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6">Student Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {courseData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FEE REMINDERS */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
            <Wallet className="text-orange-500" size={20} /> Fee Collection Alerts
          </h3>
          <div className="space-y-4">
            {feeReminders.map((student, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{student.course_name}</p>
                  <p className="text-[10px] text-orange-600 font-black uppercase">₹{student.pending_balance} Overdue</p>
                </div>
                <button className="p-2 bg-white text-orange-500 rounded-xl shadow-sm border border-orange-100 transition-transform hover:scale-110">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
            {feeReminders.length === 0 && <p className="text-center py-10 text-slate-400 font-bold italic">All fees collected!</p>}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionCard 
            onClick={() => navigate('/students')} 
            icon={<GraduationCap size={32} />} 
            title="Register Student" 
            desc="Add a new student to a course"
            bg="bg-orange-500" 
          />
          <ActionCard 
            onClick={() => navigate('/fees')} 
            icon={<CheckCircle size={32} />} 
            title="Collect Fee" 
            desc="Record a payment entry"
            bg="bg-slate-800" 
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, bg, label, value }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm">
      <div className={`p-3 ${bg} ${color} rounded-2xl w-fit mb-4`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h2 className="text-2xl font-black text-slate-900">{value}</h2>
    </div>
  );
}

function ActionCard({ onClick, icon, title, desc, bg }) {
  return (
    <div onClick={onClick} className={`group ${bg} p-8 rounded-[2.5rem] text-white cursor-pointer shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between h-48`}>
      <div className="opacity-20 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div>
        <h4 className="text-2xl font-black">{title}</h4>
        <p className="text-white/70 text-sm">{desc}</p>
      </div>
    </div>
  );
}