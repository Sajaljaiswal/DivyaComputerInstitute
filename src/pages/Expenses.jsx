import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { 
  FiPlus, FiTrash2, FiSearch, FiX, 
  FiDollarSign, FiCalendar, FiFileText,
  FiFilter, FiTrendingUp, FiArrowDown
} from "react-icons/fi";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from "recharts";

const CATEGORIES = ["Rent", "Electricity", "Staff Salary", "Transport", "Maintenance", "Tea/Food", "Other"];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [salesProfit, setSalesProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Filter States
  const [activeFilter, setActiveFilter] = useState("last7"); // today, yesterday, last7, last30
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [form, setForm] = useState({ title: "", amount: "", category: "Other" });

  const fetchData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const startISO = new Date(start + "T00:00:00").toISOString();
      const endISO = new Date(end + "T23:59:59").toISOString();

      // 1. Fetch Expenses for range
      const { data: expData } = await supabase
        .from("expenses")
        .select("*")
        .gte("created_at", startISO)
        .lte("created_at", endISO)
        .order("created_at", { ascending: false });

      // 2. Fetch Sales Profit for the same range
      const { data: salesData } = await supabase
        .from("sales")
        .select("total_profit")
        .gte("created_at", startISO)
        .lte("created_at", endISO);

      setExpenses(expData || []);
      const totalP = salesData?.reduce((sum, s) => sum + Number(s.total_profit), 0) || 0;
      setSalesProfit(totalP);

    } catch (err) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(dateRange.start, dateRange.end);
  }, [fetchData]);

  // Handle Quick Filter logic (Native JS)
  const applyQuickFilter = (type) => {
    setActiveFilter(type);
    let start = new Date();
    let end = new Date();

    if (type === "yesterday") {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (type === "last7") {
      start.setDate(start.getDate() - 7);
    } else if (type === "last30") {
      start.setDate(start.getDate() - 30);
    }

    const sStr = start.toISOString().split('T')[0];
    const eStr = end.toISOString().split('T')[0];
    setDateRange({ start: sStr, end: eStr });
    fetchData(sStr, eStr);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return toast.error("Fill required fields");

    const { error } = await supabase.from("expenses").insert([{
      ...form,
      amount: Number(form.amount)
    }]);
    
    if (error) return toast.error(error.message);
    
    toast.success("Expense Recorded");
    setIsModalOpen(false);
    setForm({ title: "", amount: "", category: "Other" });
    fetchData(dateRange.start, dateRange.end);
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete record?")) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      toast.success("Deleted");
      fetchData(dateRange.start, dateRange.end);
    }
  };

  // Calculations
  const filteredExpenses = expenses.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = salesProfit - totalExpense;

  // Graph Data Preparation (Group by Date)
  const chartData = useMemo(() => {
    const daily = {};
    expenses.forEach(e => {
      const day = new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      daily[day] = (daily[day] || 0) + Number(e.amount);
    });
    return Object.keys(daily).map(key => ({ date: key, amount: daily[key] })).reverse();
  }, [expenses]);

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expense Manager</h1>
          <p className="text-slate-500 font-medium">Monitoring outflows & net profitability</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['today', 'yesterday', 'last7', 'last30'].map((f) => (
              <button
                key={f}
                onClick={() => applyQuickFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                  activeFilter === f ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === 'last7' ? '7 Days' : f === 'last30' ? '30 Days' : f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-100 transition-all"
          >
            <FiPlus /> Record Expense
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Expenses</p>
          <h2 className="text-3xl font-black text-rose-600">₹{totalExpense.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium italic">Cash Outflow</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Profit</p>
          <h2 className="text-3xl font-black text-emerald-600">₹{salesProfit.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium italic">From Sales Revenue</p>
        </div>
        <div className={`p-6 rounded-[2rem] border shadow-xl text-white ${netProfit >= 0 ? 'bg-slate-900' : 'bg-rose-500'}`}>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Net Profit</p>
          <h2 className="text-3xl font-black">₹{netProfit.toLocaleString('en-IN')}</h2>
          <p className="text-xs text-white/40 mt-1 font-medium italic">After Deducting Expenses</p>
        </div>
      </div>

      {/* Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-rose-500" /> Expense Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   formatter={(value) => [`₹${value}`, "Amount"]}
                />
                <Area type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search & Mini Info */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-full flex flex-col justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Search Transactions</p>
                <div className="relative">
                    <FiSearch className="absolute left-4 top-4 text-slate-300" />
                    <input 
                        placeholder="e.g. Rent, Salary..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Items Filtered:</span>
                        <span className="text-slate-900">{filteredExpenses.length}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-slate-500">{new Date(exp.created_at).toLocaleDateString('en-IN')}</span>
                </td>
                <td className="px-8 py-5 font-bold text-slate-800">{exp.title}</td>
                <td className="px-8 py-5">
                  <span className="bg-slate-100 text-[10px] font-black text-slate-500 px-3 py-1 rounded-full uppercase">{exp.category}</span>
                </td>
                <td className="px-8 py-5 text-right font-black text-rose-600 text-lg">₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => deleteExpense(exp.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExpenses.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-bold italic">No records found for this period</div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">New Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleAddExpense} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title *</label>
                <input required className="w-full mt-1 px-4 py-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold focus:ring-2 focus:ring-rose-500" placeholder="e.g. Shop Rent" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹) *</label>
                  <input required type="number" className="w-full mt-1 p-3.5 bg-slate-50 border-none rounded-2xl outline-none font-black text-rose-600" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full mt-1 p-3.5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700" value={form.category} onChange={e => setForm({...form, category: e.target.value})} >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all">Confirm & Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}