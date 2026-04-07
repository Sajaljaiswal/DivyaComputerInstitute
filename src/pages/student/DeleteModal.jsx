import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteModal({ studentName, isUpdating, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xs rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Are you sure?</h3>
          <p className="text-slate-500 text-xs font-medium mb-6 px-4">
            This will permanently remove <span className="font-bold text-slate-800">{studentName}</span> from the database.
          </p>

          <div className="flex flex-col gap-2">
            <button onClick={onConfirm} disabled={isUpdating} className="w-full py-3 bg-red-500 text-white rounded-xl font-black text-xs hover:bg-red-600 shadow-lg shadow-red-100">
              {isUpdating ? "Deleting..." : "Yes, Delete Record"}
            </button>
            <button onClick={onClose} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}