import React from 'react';
import { X, FileText, Plus, Trash2, FileStack, Loader2, Calendar, Layout } from 'lucide-react';

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
  // Logic for calculations
  const currentTotal = gradForm.moduleMarks.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
  const maxMarks = activeModules.length * 100;
  const percentage = maxMarks > 0 ? ((currentTotal / maxMarks) * 100).toFixed(2) : 0;

  // Handlers for Module Management
  const addModule = () => {
    setActiveModules([...activeModules, "New Module Name"]);
    setGradForm(prev => ({ 
      ...prev, 
      moduleMarks: [...prev.moduleMarks, 0] 
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

  const updateMark = (index, value) => {
    const newMarks = [...gradForm.moduleMarks];
    newMarks[index] = parseInt(value) || 0;
    setGradForm({ ...gradForm, moduleMarks: newMarks });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden my-8">
        
        {/* --- Header --- */}
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic">Curriculum & Result Editor</h3>
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              {student?.full_name || "Student Record"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <X size={24}/>
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Module Editor --- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-orange-500" /> Module Wise Marks
              </h4>
              <button 
                onClick={addModule} 
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus size={14} /> Add Module
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {activeModules.map((name, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-orange-200 transition-colors">
                  <span className="text-[11px] font-black text-slate-300 w-5">{index + 1}</span>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => updateModuleName(index, e.target.value)}
                    className="flex-1 bg-transparent border-none font-bold text-slate-700 outline-none focus:text-orange-600 text-xs"
                    placeholder="Enter Module Name"
                  />
                  <input 
                    type="number" 
                    className="w-16 p-2 bg-white border border-slate-200 rounded-lg text-center font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={gradForm.moduleMarks[index] || 0}
                    onChange={(e) => updateMark(index, e.target.value)}
                  />
                  <button 
                    onClick={() => removeModule(index)} 
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column: Configuration & Print Options --- */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
            
            {/* Performance Stats */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Performance</label>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                <p className="text-4xl font-black text-slate-900">{currentTotal}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total / {maxMarks}</p>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-500" 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs font-black text-orange-500 italic">{percentage}% Percentage</p>
              </div>
            </div>

            {/* Issue Date Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-slate-500"/> Issue Date
              </label>
              <input 
                type="date"
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-orange-500 transition-all"
                value={gradForm.issueDate || ''} 
                onChange={(e) => setGradForm({...gradForm, issueDate: e.target.value})}
              />
            </div>

            {/* Document Type Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layout size={14} className="text-slate-500"/> Document Selection
              </label>
              <select 
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-orange-500 transition-all"
                value={gradForm.printType || 'both'} 
                onChange={(e) => setGradForm({...gradForm, printType: e.target.value})}
              >
                <option value="certificate">Certificate Only</option>
                <option value="marksheet">Marksheet Only</option>
                <option value="both">Certificate + Marksheet</option>
              </select>
            </div>

            {/* Grade Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Award Grade</label>
              <select 
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:border-orange-500 transition-all"
                value={gradForm.grade} 
                onChange={(e) => setGradForm({...gradForm, grade: e.target.value})}
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Satisfactory</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              disabled={isSubmitting}
              onClick={onSubmit}
              className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black shadow-xl hover:bg-slate-900 hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <FileStack className="group-hover:scale-110 transition-transform" size={22} />
                  <span>
                    {gradForm.printType === 'certificate' && 'Save & Print Certificate'}
                    {gradForm.printType === 'marksheet' && 'Save & Print Marksheet'}
                    {(gradForm.printType === 'both' || !gradForm.printType) && 'Save & Print All'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}