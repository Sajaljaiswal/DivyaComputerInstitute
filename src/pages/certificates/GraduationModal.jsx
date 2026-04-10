import React from 'react';
import { X, FileText, Plus, Trash2, FileStack, Loader2 } from 'lucide-react';

export default function GraduationModal({ 
  student, 
  activeModules, 
  setActiveModules, 
  gradForm, 
  setGradForm, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) {
  const currentTotal = gradForm.moduleMarks.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
  const maxMarks = activeModules.length * 100;

  const addModule = () => {
    setActiveModules([...activeModules, "New Module Name"]);
    setGradForm(prev => ({ 
      ...prev, 
      moduleMarks: [...prev.moduleMarks, 85] 
    }));
  };

  const removeModule = (index) => {
    setActiveModules(activeModules.filter((_, i) => i !== index));
    setGradForm(prev => ({ 
      ...prev, 
      moduleMarks: gradForm.moduleMarks.filter((_, i) => i !== index) 
    }));
  };

  const updateModuleName = (index, newName) => {
    const updated = [...activeModules];
    updated[index] = newName;
    setActiveModules(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden my-8">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic">Curriculum & Result Editor</h3>
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">{student.full_name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-2xl hover:bg-white/20"><X size={24}/></button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-orange-500" /> Module Wise Marks
              </h4>
              <button onClick={addModule} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all">
                <Plus size={14} /> Add Module
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {activeModules.map((name, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-orange-200 transition-colors">
                  <span className="text-[11px] font-black text-slate-300 w-5">{index + 1}</span>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => updateModuleName(index, e.target.value)}
                    className="flex-1 bg-transparent border-none font-bold text-slate-700 outline-none focus:text-orange-600 text-xs"
                  />
                  <input 
                    type="number" 
                    className="w-14 p-2 bg-white border border-slate-200 rounded-lg text-center font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={gradForm.moduleMarks[index] || 0}
                    onChange={(e) => {
                      const newMarks = [...gradForm.moduleMarks];
                      newMarks[index] = parseInt(e.target.value) || 0;
                      setGradForm({...gradForm, moduleMarks: newMarks});
                    }}
                  />
                  <button onClick={() => removeModule(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Performance</label>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-4xl font-black text-slate-900">{currentTotal}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total / {maxMarks}</p>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-500" style={{width: `${(currentTotal/maxMarks)*100}%`}}></div>
                </div>
                <p className="mt-2 text-xs font-black text-orange-500 italic">{((currentTotal/maxMarks)*100).toFixed(2)}% Percentage</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Award Grade</label>
              <select 
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-orange-500"
                value={gradForm.grade} 
                onChange={(e) => setGradForm({...gradForm, grade: e.target.value})}
              >
                <option>Excellent</option><option>Good</option><option>Fair</option><option>Satisfactory</option>
              </select>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={onSubmit}
              className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : (
                <>
                  <FileStack className="group-hover:scale-110 transition-transform" size={22} />
                  Save & Print All
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}