import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2, ArrowRight, Monitor, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Welcome back to your dashboard!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] p-4 font-sans">
      {/* --- Dynamic Background Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-amber-100 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* --- Back to Home Button --- */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-orange-500 mb-6 transition-colors font-bold text-sm group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Website
        </button>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-orange-900/5 border border-orange-50/50">
          <div className="text-center mb-10">
            <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-200 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
              <Monitor size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Divya Computer Portal</h2>
            <p className="text-slate-500 mt-3 text-sm font-medium">Continue your learning journey today.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* --- Email Input --- */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent text-slate-900 text-sm rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none"
                  placeholder="student@divyainstitute.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* --- Password Input --- */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <button type="button" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent text-slate-900 text-sm rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* --- Remember Me --- */}
            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-5 h-5 rounded-lg border-2 border-slate-200 text-orange-500 focus:ring-orange-500 transition-all cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer select-none">Stay logged in</label>
            </div>

            {/* --- Submit Button --- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-orange-600 text-white font-black py-4 px-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-orange-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* --- Bottom Link --- */}
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-400">
              New to Divya Institute? 
              <button 
                onClick={() => navigate("/register")}
                className="text-orange-500 hover:text-orange-600 ml-2 transition-colors"
              >
                Create Student Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}