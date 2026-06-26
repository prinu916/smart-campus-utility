import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const emptyForm = { day: 'Monday', subject: '', startTime: '09:00', endTime: '10:00', room: '', faculty: '' };

const Timetable = () => {
  const { isAdmin } = useAuth();
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await api.get('/timetable');
    setEntries(data);
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
    fetchEntries();
    fetchUsers();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isAdmin && selectedUser !== 'all') {
      payload.user = selectedUser;
    }
    await api.post('/timetable', payload);
    setShowModal(false);
    setForm(emptyForm);
    fetchEntries();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    await api.delete(`/timetable/${id}`);
    fetchEntries();
  };

  if (loading) return <Loader />;

  const visibleEntries = entries.filter((e) => selectedUser === 'all' || e.user === selectedUser);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Weekly Timetable</h2>
          <p className="text-sm text-slate-500">Your class schedule for the week.</p>
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
              <Plus size={16} /> Add Class
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {DAYS.map((day) => {
          const dayEntries = visibleEntries.filter((e) => e.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
          return (
            <div key={day} className="rounded-2xl bg-white p-5 shadow-soft">
              <h3 className="font-display mb-3 text-base font-semibold text-slate-800">{day}</h3>
              {dayEntries.length === 0 ? (
                <p className="text-sm text-slate-400">No classes scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {dayEntries.map((e) => (
                    <div key={e._id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{e.subject}</p>
                        <p className="text-xs text-slate-400">{e.startTime} - {e.endTime} {e.room && `· ${e.room}`} {e.faculty && `· ${e.faculty}`}</p>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleDelete(e._id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={15} /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-800">Add Class</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              <div className="grid grid-cols-2 gap-3">
                <input type="time" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
                <input type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                <input placeholder="Faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>
              <button type="submit" className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
