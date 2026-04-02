import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Printer, 
  Plus, 
  History, 
  Download, 
  Check,
  X,
  IndianRupee,
  User,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from "react-hot-toast";

export default function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, course, total_fee, paid_fee, pending_balance")
        .order("full_name");
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error("Error loading financial records");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");

    try {
      const newPaid = Number(selectedStudent.paid_fee) + Number(amount);
      const newPending = Number(selectedStudent.total_fee) - newPaid;

      const { error } = await supabase
        .from("students")
        .update({ paid_fee: newPaid, pending_balance: newPending })
        .eq("id", selectedStudent.id);

      if (error) throw error;

      toast.success("Payment recorded!");
      setShowPaymentModal(false);
      setAmount("");
      fetchFinancialData();
      handlePrint(selectedStudent, amount);
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  const handlePrint = (student, currentPaid) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${student.full_name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
            .details { margin: 30px 0; line-height: 2; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; }
            .stamp { border: 2px solid #f97316; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #f97316; font-weight: bold; transform: rotate(-15deg); margin-left: auto; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>DIVYA COMPUTER INSTITUTE</h1>
            <p>Quality Education | Excellence in Development</p>
          </div>
          <div class="details">
            <p><strong>Receipt No:</strong> RCPT-${Date.now().toString().slice(-6)}</p>
            <p><strong>Student Name:</strong> ${student.full_name}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Amount Received:</strong> ₹${currentPaid}</p>
            <p><strong>Current Pending Balance:</strong> ₹${student.total_fee - (student.paid_fee + Number(currentPaid))}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="stamp">PAID</div>
          <div class="footer">This is a computer-generated receipt. No signature required.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- Summary Bar --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><IndianRupee size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Collected</p>
            <h3 className="text-xl font-black text-slate-900">₹{students.reduce((a, b) => a + b.paid_fee, 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><History size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
            <h3 className="text-xl font-black text-slate-900">₹{students.reduce((a, b) => a + b.pending_balance, 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl"><Check size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Collection Rate</p>
            <h3 className="text-xl font-black">92.4%</h3>
          </div>
        </div>
      </div>

      {/* --- Main Fee Table --- */}
      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-orange-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fee Records</h2>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500" size={18} />
            <input type="text" placeholder="Find student..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none font-bold text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                <th className="px-8 py-5">Student</th>
                <th className="px-6 py-5">Total Fee</th>
                <th className="px-6 py-5">Paid</th>
                <th className="px-6 py-5">Balance</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-orange-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800">{student.full_name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{student.course}</p>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-600">₹{student.total_fee}</td>
                  <td className="px-6 py-5 text-emerald-600 font-black">₹{student.paid_fee}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${student.pending_balance > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      ₹{student.pending_balance}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => {setSelectedStudent(student); setShowPaymentModal(true);}}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
                    >
                      <Plus size={14} /> Update Fee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Payment Modal --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">Record Payment</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{selectedStudent?.full_name}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20"><X size={20}/></button>
            </div>
            
            <form onSubmit={handlePayment} className="p-10 space-y-8">
              <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 space-y-4">
                 <div className="flex justify-between">
                    <span className="text-xs font-black text-orange-500 uppercase">Course Fee</span>
                    <span className="font-black text-slate-800">₹{selectedStudent?.total_fee}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-xs font-black text-orange-500 uppercase">Total Paid</span>
                    <span className="font-black text-slate-800">₹{selectedStudent?.paid_fee}</span>
                 </div>
                 <div className="pt-4 border-t border-orange-200 flex justify-between">
                    <span className="text-xs font-black text-rose-600 uppercase">Current Balance</span>
                    <span className="font-black text-rose-600">₹{selectedStudent?.pending_balance}</span>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-black">₹</div>
                  <input 
                    type="number" required autoFocus
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-black text-xl transition-all"
                  />
                </div>
              </div>

              <button className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                 Collect & Print Receipt <ArrowRight size={20}/>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}