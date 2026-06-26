import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Tasks from "./pages/Tasks";
import Attendance from "./pages/Attendance";
import Notices from "./pages/Notices";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Timetable from "./pages/Timetable";
import Support from "./pages/Support";

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

const RootRedirect = () => {
  const { user, loading, getDashboardPath } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return <Navigate to={user ? getDashboardPath(user) : "/login"} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Shared Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tasks" element={<ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AppLayout><Attendance /></AppLayout></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><AppLayout><Timetable /></AppLayout></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><AppLayout><Support /></AppLayout></ProtectedRoute>} />

      {/* Shared Protected Routes */}
      <Route path="/notices" element={<ProtectedRoute><AppLayout><Notices /></AppLayout></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

      {/* Root Path Redirect */}
      <Route path="/" element={<RootRedirect />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;