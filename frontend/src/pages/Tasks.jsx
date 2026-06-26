import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const emptyForm = { title: '', description: '', type: 'task', subject: '', dueDate: '', priority: 'medium', status: 'pending' };

const Tasks = () => {
  const { isAdmin, isStudent } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await api.get('/tasks');
    setTasks(data);
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
    fetchTasks();
    fetchUsers();
  }, [isAdmin]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (task) => {
    setForm({ ...task, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' });
    setEditingId(task._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isAdmin && selectedUser !== 'all') {
      payload.user = selectedUser;
    }

    if (editingId) {
      await api.put(`/tasks/${editingId}`, payload);
    } else {
      await api.post('/tasks', payload);
    }
    setShowModal(false);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed';
    await api.put(`/tasks/${task._id}`, { status });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const visibleTasks = tasks.filter((t) => selectedUser === 'all' || t.user === selectedUser);
  const filtered = visibleTasks.filter((t) => filter === 'all' || t.status === filter);

  if (loading) return <Loader />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-slate-800">Tasks & Assignments</h2>
          <p className="text-sm text-slate-500">Stay on top of your academic to-dos.</p>
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
            <button onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              <Plus size={16} /> New Task
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && <p className="text-sm text-slate-400">No tasks found.</p>}
        {filtered.map((task) => (
          <div key={task._id} className="rounded-2xl bg-white p-5 shadow-soft">
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 capitalize">{task.type}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                task.priority === 'high' ? 'bg-rose-50 text-rose-600' :
                task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>{task.priority}</span>
            </div>
            <h3 className={`font-display text-base font-semibold text-slate-800 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
            {task.subject && <p className="text-xs text-slate-400">{task.subject}</p>}
            {task.description && <p className="mt-2 text-sm text-slate-500 line-clamp-2">{task.description}</p>}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{task.dueDate ? `Due ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}</span>
              <span className="capitalize">{task.status.replace('-', ' ')}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              {isAdmin ? (
                <>
                  <button onClick={() => toggleStatus(task)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50">
                    <CheckCircle2 size={14} /> {task.status === 'completed' ? 'Reopen' : 'Complete'}
                  </button>
                  <button onClick={() => openEdit(task)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </>
              ) : (
                <span className="text-xs font-medium text-slate-500">View only</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-800">{editingId ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                  <option value="task">Task</option>
                  <option value="assignment">Assignment</option>
                </select>
                <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit" className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
                {editingId ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
