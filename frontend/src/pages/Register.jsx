import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    adminCode: "",
    rollNumber: "",
    department: "",
    semester: "",
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (user) {
      navigate(getDashboardPath(user), { replace: true });
    }
  }, [user, navigate, getDashboardPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      // Conditional payload: Admin ke liye roll/sem nahi jayega
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        ...(form.role === "admin" ? { adminCode: form.adminCode } : { 
            rollNumber: form.rollNumber, 
            semester: Number(form.semester) || 1 
        }),
      };

      const res = await register(payload);

      navigate(getDashboardPath(res.user), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-amber-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <GraduationCap size={26} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join Smart Campus to organize your student life</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Full name</label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jane Doe" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Email address</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@college.edu" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Department</label>
            <input type="text" name="department" required value={form.department} onChange={handleChange} placeholder="Computer Science" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Register As</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {form.role === "student" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Roll number</label>
                <input type="text" name="rollNumber" required value={form.rollNumber} onChange={handleChange} placeholder="CS21B045" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">Semester</label>
                <input type="number" min="1" max="12" name="semester" required value={form.semester} onChange={handleChange} placeholder="5" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Admin access code</label>
              <input type="text" name="adminCode" required value={form.adminCode} onChange={handleChange} placeholder="Enter approved admin code" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;