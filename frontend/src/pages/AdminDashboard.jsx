import React, { useEffect, useState } from 'react';
import { Users, Bell, Calendar, BookOpen, Settings, Plus, MessageSquareWarning, MessageCircleMore } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const [complaintsRes, feedbackRes] = await Promise.all([
          api.get('/support/complaints'),
          api.get('/support/feedback'),
        ]);
        setComplaints(complaintsRes.data || []);
        setFeedback(feedbackRes.data || []);
      } catch (error) {
        console.error('Failed to load support data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportData();
  }, []);

  const stats = [
    { title: "Total Students", value: "1,240", icon: Users, color: "text-blue-600" },
    { title: "Active Notices", value: "12", icon: Bell, color: "text-amber-600" },
    { title: "Timetable Updated", value: "Today", icon: Calendar, color: "text-emerald-600" },
    { title: "Course Notes", value: "48", icon: BookOpen, color: "text-purple-600" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
          <Plus size={20} /> Add New Entry
        </button>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Support Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareWarning size={18} className="text-rose-500" />
            <h2 className="text-lg font-semibold text-slate-800">Student Complaints</h2>
          </div>
          <div className="space-y-3">
            {complaints.length === 0 && <p className="text-sm text-slate-500">No complaints received.</p>}
            {complaints.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium capitalize text-amber-700">{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircleMore size={18} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-slate-800">Student Feedback</h2>
          </div>
          <div className="space-y-3">
            {feedback.length === 0 && <p className="text-sm text-slate-500">No feedback received.</p>}
            {feedback.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-semibold text-slate-700">{item.subject}</p>
                <p className="mt-1 text-sm text-slate-500">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Student Management</h2>
          <p className="text-slate-600 mb-4">Manage student profiles, enrollment, and verification.</p>
          <button className="text-blue-600 font-medium hover:underline">View All Students →</button>
        </div>

        {/* Notice Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Notice Management</h2>
          <p className="text-slate-600 mb-4">Broadcast announcements to students and staff.</p>
          <button className="text-blue-600 font-medium hover:underline">Create Notice →</button>
        </div>

        {/* Timetable Management */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Timetable Management</h2>
          <p className="text-slate-600 mb-4">Update weekly lecture schedules and exam dates.</p>
          <button className="text-blue-600 font-medium hover:underline">Modify Timetable →</button>
        </div>

        {/* Admin Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">System Settings</h2>
          <p className="text-slate-600 mb-4">Control global access and system configurations.</p>
          <button className="text-slate-700 font-medium flex items-center gap-2 hover:text-blue-600">
            <Settings size={18} /> Configure System
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;