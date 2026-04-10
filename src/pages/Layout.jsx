import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  Menu, 
  Bell, 
  LogOut, 
  GraduationCap, 
  Settings, 
  Coffee,
  ChevronRight
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

const navItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
  { name: "My Courses", path: "/courses", icon: <BookOpen size={20} /> },
  { name: "Students", path: "/students", icon: <Users size={20} /> },
  { name: "Fee Payments", path: "/fees", icon: <CreditCard size={20} /> },
  { name: "Assignments", path: "/tasks", icon: <Coffee size={20} /> },
  { name: "New Request", path: "/requests", icon: <Coffee size={20} /> },
  { name: "Certificates", path: "/certificates", icon: <GraduationCap size={20} /> },
  { name: "Institute Settings", path: "/settings", icon: <Settings size={20} /> }
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [businessName, setBusinessName] = useState("Divya Institute");
  const [adminDisplayName, setAdminDisplayName] = useState("Instructor");

  useEffect(() => {
    fetchBusinessSettings();
  }, []);

  const fetchBusinessSettings = async () => {
    try {
      const { data } = await supabase
        .from("settings")
        .select("shop_name, admin_name")
        .single();

      if (data) {
        setBusinessName(data.shop_name);
        setAdminDisplayName(data.admin_name);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("See you soon!");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-[#FFFBF7] font-sans text-slate-900">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-white hidden md:flex flex-col border-r border-orange-50 shadow-sm">
        {/* Logo Section */}
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100 font-black text-xl">
            {businessName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-slate-800 leading-none tracking-tight uppercase">
              {businessName}
            </span>
            <span className="text-[10px] font-bold text-orange-500 tracking-widest mt-1">PORTAL</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-orange-500 text-white shadow-xl shadow-orange-200" 
                    : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-orange-500"}`}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade/Ad Section
        <div className="m-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white">
           <p className="text-xs font-bold opacity-70 mb-1">New Update</p>
           <p className="text-[11px] leading-relaxed">V3.0: Cloud backups are now automated every hour.</p>
        </div> */}

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-orange-50 flex items-center justify-between px-10 z-10">
          <button className="md:hidden text-slate-600"><Menu /></button>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-slate-900 capitalize">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Overview Dashboard'}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Divya Computer Institute Admin</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:bg-orange-50 hover:text-orange-500 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900">{adminDisplayName}</p>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Senior Instructor</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-black shadow-sm border border-orange-200">
                  {adminDisplayName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#FFFBF7]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}