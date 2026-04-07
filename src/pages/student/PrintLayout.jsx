import React from "react";

export default function PrintLayout({ student }) {
  if (!student) return null;

  return (
    <div id="admission-form-print" className="hidden print:block p-10 bg-white text-black font-serif border-[10px] border-double border-slate-800">
      <div className="text-center border-b-2 border-slate-900 pb-4">
        <h4 className="text-sm font-bold">Website: http://www.divya.ndlmindia.com</h4>
        <h1 className="text-4xl font-black text-blue-800 uppercase my-2">Divya Technical Institute, Mardah</h1>
        <div className="flex justify-center gap-10 font-bold text-blue-900">
          <span>Mobile: 9792257501</span>
          <span>eMail: divyacomputer2@gmail.com</span>
        </div>
      </div>

      <div className="bg-black text-white text-center py-2 my-4 font-black text-xl tracking-widest uppercase">
        STUDENT'S ADMISSION FORM
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {[
            { label: "Student Name", value: student.full_name },
            { label: "Guardian Name", value: student.parent_name },
            { label: "Date of Birth", value: student.dob },
            { label: "Mobile 1", value: student.mobile_1 },
            { label: "Course Name", value: student.course_name },
            { label: "Address", value: student.address },
          ].map((item, idx) => (
            <div key={idx} className="flex border-b border-dotted border-slate-400 pb-1">
              <span className="w-40 font-bold text-blue-800">{item.label} :</span>
              <span className="font-bold uppercase">{item.value || "N/A"}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-40 h-48 border-2 border-slate-900 flex items-center justify-center bg-slate-50 text-slate-300 font-bold text-center p-4">
            Paste Photo Here
          </div>
        </div>
      </div>

      <div className="bg-yellow-200 border-y-2 border-black text-center py-1 mt-10 font-black text-lg">
        STUDENT CORNER DETAIL
      </div>
      <table className="w-full border-collapse border border-black text-center mt-2">
        <tbody>
          <tr>
            <td className="border border-black font-black py-2 bg-slate-50 uppercase w-1/2">User Name</td>
            <td className="border border-black font-black text-xl">{student.mobile_1}</td>
          </tr>
          <tr>
            <td className="border border-black font-black py-2 bg-slate-50 uppercase">Password</td>
            <td className="border border-black font-black text-xl">{student.mobile_1?.slice(-4)}</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-3 gap-4 mt-16 text-center">
        <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-[10px] uppercase">Signature of Student</div>
        <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-[10px] uppercase">Thumb</div>
        <div className="pt-20 border border-slate-800 h-32 flex items-end justify-center pb-2 font-bold text-[10px] uppercase">Director / Principal</div>
      </div>
    </div>
  );
}