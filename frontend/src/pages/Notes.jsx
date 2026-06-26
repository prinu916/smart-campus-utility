import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2, Pin, PinOff } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e9d5ff'];
const emptyForm = { title: '', content: '', color: COLORS[0], pinned: false };

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchNotes = async () => {
    setLoading(true);
    const { data } = await api.get('/notes');
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/notes', form);
    setShowModal(false);
    setForm(emptyForm);
    fetchNotes();
  };

  const togglePin = async (note) => {
    await api.put(`/notes/${note._id}`, { pinned: !note.pinned });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    await api.delete(`/notes/${id}`);
    fetchNotes();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Personal Notes</h2>
          <p className="text-sm text-slate-500">Jot down quick thoughts, reminders, and ideas.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
          <Plus size={16} /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.length === 0 && <p className="text-sm text-slate-400">No notes yet. Create your first one!</p>}
        {notes.map((note) => (
          <div key={note._id} className="rounded-2xl p-5 shadow-soft" style={{ backgroundColor: note.color }}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-slate-800">{note.title}</h3>
              <button onClick={() => togglePin(note)} className="text-slate-600 hover:text-slate-900">
                {note.pinned ? <Pin size={16} fill="currentColor" /> : <PinOff size={16} />}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{note.content}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              <button onClick={() => handleDelete(note._id)} className="flex items-center gap-1 hover:text-rose-600">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-800">New Note</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              <textarea placeholder="Write your note..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" rows={4} />
              <div className="flex items-center gap-2">
                {COLORS.map((c) => (
                  <button type="button" key={c} onClick={() => setForm({ ...form, color: c })}
                    className={`h-7 w-7 rounded-full border-2 ${form.color === c ? 'border-slate-700' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="submit" className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Save Note</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
