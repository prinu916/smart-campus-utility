import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Megaphone } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const emptyForm = { title: '', content: '', category: 'general' };

const categoryStyles = {
  general: 'bg-slate-100 text-slate-600',
  exam: 'bg-rose-50 text-rose-600',
  event: 'bg-primary-50 text-primary-600',
  holiday: 'bg-emerald-50 text-emerald-600',
  urgent: 'bg-amber-100 text-amber-700',
};

const Notices = () => {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchNotices = async () => {
    setLoading(true);
    const { data } = await api.get('/notices');
    setNotices(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/notices', form);
    setShowModal(false);
    setForm(emptyForm);
    fetchNotices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await api.delete(`/notices/${id}`);
    fetchNotices();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Campus Notices</h2>
          <p className="text-sm text-slate-500">Stay informed about exams, events, and announcements.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
            <Plus size={16} /> Post Notice
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notices.length === 0 && <p className="text-sm text-slate-400">No notices posted yet.</p>}
        {notices.map((n) => (
          <div key={n._id} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Megaphone size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-slate-800">{n.title}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${categoryStyles[n.category]}`}>{n.category}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{n.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(n.createdAt).toLocaleString()}</span>
                {isAdmin && (
                  <button onClick={() => handleDelete(n._id)} className="flex items-center gap-1 text-rose-500 hover:underline">
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-800">Post Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              <textarea required placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" rows={4} />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="event">Event</option>
                <option value="holiday">Holiday</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit" className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
