import { Search, UserPlus } from "lucide-react";

export default function StudentHeader({ count, searchQuery, setSearchQuery, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm print:hidden">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Student Directory</h1>
        <p className="text-slate-500 text-xs font-medium italic">Total Enrollment: {count}</p>
      </div>
      <div className="flex gap-2">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 w-48 md:w-64"
          />
        </div>
        <button onClick={onAdd} className="p-2 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-all">
          <UserPlus size={20} />
        </button>
      </div>
    </div>
  );
}