import React, { useState } from 'react';
import { Save } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Profile = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const showAcademicFields = !isAdmin && user?.role === 'student';
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    phone: user?.phone || '',
    rollNumber: user?.rollNumber || '',
    semester: user?.semester || 1,
    profileImage: user?.profileImage || '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = { ...form };
      if (!showAcademicFields) {
        delete payload.rollNumber;
        delete payload.semester;
      }
      if (!payload.password) delete payload.password;
      const { data } = await api.put('/users/profile', payload);
      updateUser(data);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'S';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-800">My Profile</h2>
        <p className="text-sm text-slate-500">Manage your personal and academic details.</p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex h-16 w-16 overflow-hidden rounded-full border border-slate-200 text-xl font-semibold text-white" style={{ backgroundColor: user?.avatarColor || '#6366f1' }}>
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user?.name || 'Profile'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">{initials}</div>
          )}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <p className="mt-1 text-sm text-slate-500">{isAdmin ? 'Administrator' : user?.role === 'student' ? 'Student' : 'Staff'} · Joined: {formatDate(user?.createdAt)}</p>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-primary-50 px-4 py-2.5 text-sm text-primary-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Full name</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Joining date:</span> {formatDate(user?.createdAt)}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Department</label>
          <input name="department" value={form.department} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        {showAcademicFields && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Roll number</label>
              <input name="rollNumber" value={form.rollNumber} onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Semester</label>
              <input type="number" min="1" max="8" name="semester" value={form.semester} onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Phone number</label>
          <input name="phone" value={form.phone} onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">Profile picture URL</label>
          <input name="profileImage" value={form.profileImage} onChange={handleChange} placeholder="https://example.com/photo.jpg"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">New password (optional)</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>

        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
