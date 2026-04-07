import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

// Sub-components
import StudentHeader from "./StudentHeader";
import StudentTable from "./StudentTable";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import PrintLayout from "./PrintLayout";

export default function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal Visibility State
  const [modals, setModals] = useState({
    view: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---

  const handleUpdate = async (updatedData) => {
    setIsUpdating(true);
    // Strip metadata that shouldn't be updated directly
    const { id, created_at, ...payload } = updatedData;
    
    try {
      const { error } = await supabase
        .from("students")
        .update(payload)
        .eq("id", id);

      if (error) throw error;
      toast.success("Profile updated!");
      setModals((prev) => ({ ...prev, edit: false }));
      fetchStudents();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", selectedStudent.id);

      if (error) throw error;
      toast.success("Record deleted");
      setStudents(students.filter((s) => s.id !== selectedStudent.id));
      setModals((prev) => ({ ...prev, delete: false }));
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = (student) => {
    setSelectedStudent(student);
    // Short timeout to ensure state is updated before browser opens print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // --- Filtering ---
  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 md:p-6 animate-in fade-in duration-500">
      {/* 1. Global Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * { visibility: hidden; }
            #admission-form-print, #admission-form-print * { visibility: visible; }
            #admission-form-print { position: absolute; left: 0; top: 0; width: 100%; }
            @page { size: A4; margin: 0; }
          }
        `
      }} />

      {/* 2. Header Section */}
      <StudentHeader
        count={students.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdd={() => navigate("/students/register")}
      />

      {/* 3. Main Data Table */}
      <StudentTable
        students={filteredStudents}
        loading={loading}
        onPrint={handlePrint}
        onView={(s) => {
          setSelectedStudent(s);
          setModals((prev) => ({ ...prev, view: true }));
        }}
        onEdit={(s) => {
          setSelectedStudent(s);
          setModals((prev) => ({ ...prev, edit: true }));
        }}
        onDelete={(s) => {
          setSelectedStudent(s);
          setModals((prev) => ({ ...prev, delete: true }));
        }}
      />

      {/* 4. Modals Layer */}
      {modals.view && (
        <ViewModal
          student={selectedStudent}
          onClose={() => setModals((prev) => ({ ...prev, view: false }))}
          onPrint={() => handlePrint(selectedStudent)}
        />
      )}

      {modals.edit && (
        <EditModal
          student={selectedStudent}
          isUpdating={isUpdating}
          onClose={() => setModals((prev) => ({ ...prev, edit: false }))}
          onSave={handleUpdate}
        />
      )}

      {modals.delete && (
        <DeleteModal
          studentName={selectedStudent?.full_name}
          isUpdating={isUpdating}
          onClose={() => setModals((prev) => ({ ...prev, delete: false }))}
          onConfirm={confirmDelete}
        />
      )}

      {/* 5. Hidden Print Template */}
      <PrintLayout student={selectedStudent} />
    </div>
  );
}