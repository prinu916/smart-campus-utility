import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const emptyForm = { subject: '', date: new Date().toISOString().slice(0, 10), status: 'present' };

const Attendance = () => {
  const { isAdmin, isStudent } = useAuth();
  const [data, setData] = useState({ records: [], summary: {}, subjectWise: [] });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await api.get('/attendance');
    setData(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isAdmin && selectedUser !== 'all') {
      payload.user = selectedUser;
    }
    await api.post('/attendance', payload);
    setShowModal(false);
    setForm(emptyForm);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await api.delete(`/attendance/${id}`);
    fetchData();
  };

  if (loading) return <Loader />;

  const { summary, subjectWise, records } = data;
  const visibleRecords = (records || []).filter((r) => selectedUser === 'all' || r.user === selectedUser);
  const presentCount = visibleRecords.filter((r) => r.status === 'present').length;
  const totalCount = visibleRecords.length;
  const visibleSummary = {
    percentage: totalCount > 0 ? Number(((presentCount / totalCount) * 100).toFixed(2)) : 0,
    present: presentCount,
    absent: totalCount - presentCount,
  };
  const subjectMap = {};
  visibleRecords.forEach((r) => {
    if (!subjectMap[r.subject]) subjectMap[r.subject] = { present: 0, total: 0 };
    subjectMap[r.subject].total += 1;
    if (r.status === 'present') subjectMap[r.subject].present += 1;
  });
  const visibleSubjectWise = Object.entries(subjectMap).map(([subject, value]) => ({
    subject,
    present: value.present,
    total: value.total,
    percentage: value.total > 0 ? Number(((value.present / value.total) * 100).toFixed(2)) : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Attendance Tracker</h2>
          <p className="text-sm text-slate-500">Monitor your subject-wise attendance percentage.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Students</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          )}
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              <Plus size={16} /> Mark Attendance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Overall Percentage</p>
          <p className="font-display text-3xl font-bold text-primary-600">{visibleSummary.percentage || 0}%</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Classes Attended</p>
          <p className="font-display text-3xl font-bold text-emerald-600">{visibleSummary.present || 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Classes Missed</p>
          <p className="font-display text-3xl font-bold text-rose-500">{visibleSummary.absent || 0}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display mb-4 text-base font-semibold text-slate-800">Subject-wise Breakdown</h3>
        {visibleSubjectWise.length === 0 ? (
          <p className="text-sm text-slate-400">No attendance records yet.</p>
        ) : (
          <div className="space-y-3">
            {visibleSubjectWise.map((s) => (
              <div key={s.subject}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{s.subject}</span>
                  <span className="text-slate-500">{s.present}/{s.total} · {s.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${s.percentage >= 75 ? 'bg-emerald-500' : s.percentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display mb-4 text-base font-semibold text-slate-800">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Subject</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.slice(0, 15).map((r) => (
                <tr key={r._id} className="border-b border-slate-50">
                  <td className="py-2.5 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="py-2.5 text-slate-600">{r.subject}</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${r.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => handleDelete(r._id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-800">Mark Attendance</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
              <button type="submit" className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
