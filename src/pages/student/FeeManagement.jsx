import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  History,
  Check,
  X,
  IndianRupee,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function FeeManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select(
          "id, full_name, course_name, total_fee, paid_fee, pending_balance",
        )
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
    const payAmount = Number(amount);

    // 1. Validation
    if (!payAmount || payAmount <= 0)
      return toast.error("Enter a valid amount");

    // Safety check: ensure we don't over-collect
    if (payAmount > selectedStudent.pending_balance) {
      return toast.error(
        `Payment exceeds pending balance of ₹${selectedStudent.pending_balance}`,
      );
    }

    try {
      setIsSubmitting(true);

      // 2. Calculate New Totals
      const currentPaid = Number(selectedStudent.paid_fee || 0);
      const newPaidTotal = currentPaid + payAmount;

     
      // 3. Update Supabase
      const { error } = await supabase
        .from("students")
        .update({
          paid_fee: newPaidTotal,
        })
        .eq("id", selectedStudent.id);

      if (error) throw error;

      // 4. UI Success Feedback
      toast.success(
        `Collected ₹${payAmount} from ${selectedStudent.full_name}`,
      );

      // Pass the snapshot of data to the printer before state resets
      handlePrint(
        {
          ...selectedStudent,
          paid_fee: newPaidTotal,
        },
        payAmount,
      );

      // 5. Cleanup
      setShowPaymentModal(false);
      setAmount("");
      fetchFinancialData(); // Refresh the table with new values
    } catch (err) {
      console.error(err);
      toast.error("Payment update failed. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = (student, currentPaid) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${student.full_name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px double #f97316; padding-bottom: 20px; }
            .details { margin: 30px 0; line-height: 2.2; font-size: 16px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #999; border-top: 1px solid #eee; pt: 10px; }
            .stamp { border: 4px solid #10b981; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10b981; font-weight: 900; font-size: 24px; transform: rotate(-15deg); margin-left: auto; margin-top: -60px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; color:#0f172a;">DIVYA COMPUTER INSTITUTE</h1>
            <p style="margin:5px 0; color:#f97316; font-weight:bold;">Student Fee Acknowledgement Receipt</p>
          </div>
          <div class="details">
            <p><strong>Receipt Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
            <p><strong>Student Name:</strong> ${student.full_name}</p>
            <p><strong>Course:</strong> ${student.course_name}</p>
            <p><strong>Total Course Fee:</strong> ₹${student.total_fee}</p>
            <p><strong>Amount Now Received:</strong> ₹${currentPaid}</p>
            <p><strong>Remaining Balance:</strong> ₹${student.total_fee - (Number(student.paid_fee) + Number(currentPaid))}</p>
          </div>
          <div class="stamp">PAID</div>
          <div class="footer italic">This is an electronically generated receipt. No physical signature is required.</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Financial Stats Calculation
  const totalCollected = students.reduce(
    (a, b) => a + (Number(b.paid_fee) || 0),
    0,
  );
  const totalPending = students.reduce(
    (a, b) => a + (Number(b.pending_balance) || 0),
    0,
  );
  const collectionRate =
    students.length > 0
      ? ((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* --- Dashboard Summary --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Collected
            </p>
            <h3 className="text-xl font-black text-slate-900">
              ₹{totalCollected.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <History size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Pending
            </p>
            <h3 className="text-xl font-black text-slate-900">
              ₹{totalPending.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-white/10 rounded-2xl text-orange-400">
            <Check size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Recovery Rate
            </p>
            <h3 className="text-xl font-black">{collectionRate}%</h3>
          </div>
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className="bg-white rounded-[2rem] border border-orange-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-orange-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight italic">
              Fee Records Management
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Academic Session 2026
            </p>
          </div>
          <div className="relative w-full md:w-72 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-transparent rounded-xl focus:border-orange-500 shadow-sm outline-none font-bold text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-sm font-bold text-slate-400 italic">
                Syncing financial data...
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                  <th className="px-8 py-4">Student Details</th>
                  <th className="px-6 py-4">Course Fee</th>
                  <th className="px-6 py-4">Paid Amt</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50/50">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-orange-50/20 transition-all group"
                  >
                    <td className="px-8 py-4">
                      <p className="font-black text-slate-800 text-sm">
                        {student.full_name}
                      </p>
                      <p className="text-[10px] text-orange-500 font-black uppercase tracking-tighter">
                        {student.course_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                      ₹{student.total_fee}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-black text-sm">
                      ₹{student.paid_fee || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${student.pending_balance > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
                      >
                        {student.pending_balance > 0 ? (
                          <AlertCircle size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                        ₹{student.pending_balance || 0}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowPaymentModal(true);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-slate-200"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- Enhanced Payment Modal --- */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-50">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic tracking-tight">
                  Record Fee Payment
                </h3>
                <p className="text-orange-400 text-[10px] font-black uppercase">
                  {selectedStudent.full_name}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase block">
                    Total Fee
                  </span>
                  <span className="font-black text-slate-800">
                    ₹{selectedStudent.total_fee}
                  </span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-black text-slate-400 uppercase block">
                    Already Paid
                  </span>
                  <span className="font-black text-emerald-600">
                    ₹{selectedStudent.paid_fee || 0}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-rose-500 uppercase">
                      Max Payable Now
                    </span>
                    <span className="text-lg font-black text-rose-600 underline">
                      ₹{selectedStudent.pending_balance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  New Payment Amount (₹)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-orange-500 font-black">
                    ₹
                  </div>
                  <input
                    type="number"
                    required
                    autoFocus
                    min="1"
                    max={selectedStudent.pending_balance} // Prevents typing more than allowed
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none font-black text-2xl transition-all"
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-md shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <IndianRupee size={20} /> Collect & Print Receipt
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
