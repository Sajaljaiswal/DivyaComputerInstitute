import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/Landingpage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import MyCourses from "./pages/MyCourses";
import StudentManagement from "./pages/student/StudentManagement";
import Settings from "./pages/Settings";
import RegisterStudent from "./pages/student/RegisterStudent";
import FeeManagement from "./pages/FeeManagement";
import AssignmentPage from "./pages/AssignmentPage";
import CertificationCenter from "./pages/certificates/CertificationCenter";
import Request from "./pages/Request";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-[rgb(128,0,64)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Initializing Divya Institute ...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route 
          path="/" 
          element={session ? <Navigate to="/dashboard" /> : <LandingPage />} 
        />
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          element={
            session ? (
              <Layout>
                <Outlet />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/students/register" element={<RegisterStudent   />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/requests" element={<Request />} />
          <Route path="/tasks" element={<AssignmentPage />} />
          <Route path="/certificates" element={<CertificationCenter />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;