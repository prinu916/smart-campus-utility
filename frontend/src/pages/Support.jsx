import React, { useEffect, useState } from 'react';
import { MessageSquareWarning, Send, MessageCircleMore, Star } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const emptyComplaint = { title: '', description: '', category: 'other' };
const emptyFeedback = { subject: '', message: '', rating: 5, category: 'general' };

const Support = () => {
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complaintForm, setComplaintForm] = useState(emptyComplaint);
  const [feedbackForm, setFeedbackForm] = useState(emptyFeedback);
  const [complaintMessage, setComplaintMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchData();
  }, []);

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support/complaints', complaintForm);
      setComplaintForm(emptyComplaint);
      setComplaintMessage('Complaint submitted successfully.');
      fetchData();
    } catch (error) {
      setComplaintMessage(error?.response?.data?.message || 'Failed to submit complaint.');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support/feedback', feedbackForm);
      setFeedbackForm(emptyFeedback);
      setFeedbackMessage('Feedback submitted successfully.');
      fetchData();
    } catch (error) {
      setFeedbackMessage(error?.response?.data?.message || 'Failed to submit feedback.');
    }
  };

  const updateStatus = async (id, status) => {
    if (!isAdmin) return;
    try {
      await api.put(`/support/complaints/${id}`, { status });
      fetchData();
    } catch (error) {
      console.error('Failed to update complaint status', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-800">Complaints & Feedback</h2>
        <p className="text-sm text-slate-500">Raise issues or share your experience with the campus.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareWarning size={18} className="text-rose-500" />
            <h3 className="font-display text-lg font-semibold text-slate-800">Add Complaint</h3>
          </div>
          <form onSubmit={submitComplaint} className="space-y-3">
            <input required placeholder="Title" value={complaintForm.title} onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
            <textarea required rows={4} placeholder="Describe the issue" value={complaintForm.description} onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
            <select value={complaintForm.category} onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
              <option value="academic">Academic</option>
              <option value="facility">Facility</option>
              <option value="hostel">Hostel</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              <Send size={16} /> Submit Complaint
            </button>
            {complaintMessage && <p className="text-sm text-slate-500">{complaintMessage}</p>}
          </form>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircleMore size={18} className="text-primary-600" />
            <h3 className="font-display text-lg font-semibold text-slate-800">Share Feedback</h3>
          </div>
          <form onSubmit={submitFeedback} className="space-y-3">
            <input required placeholder="Subject" value={feedbackForm.subject} onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
            <textarea required rows={4} placeholder="Your feedback" value={feedbackForm.message} onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none" />
            <select value={feedbackForm.category} onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
              <option value="general">General</option>
              <option value="teaching">Teaching</option>
              <option value="facility">Facility</option>
              <option value="event">Event</option>
            </select>
            <select value={feedbackForm.rating} onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none">
              {[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'Star' : 'Stars'}</option>)}
            </select>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">
              <Send size={16} /> Submit Feedback
            </button>
            {feedbackMessage && <p className="text-sm text-slate-500">{feedbackMessage}</p>}
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-800">Recent Complaints</h3>
          <div className="space-y-3">
            {complaints.length === 0 && <p className="text-sm text-slate-400">No complaints submitted yet.</p>}
            {complaints.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{item.title}</p>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 capitalize">{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                {isAdmin && (
                  <div className="mt-2 flex gap-2">
                    {['open', 'in-progress', 'resolved'].map((status) => (
                      <button key={status} onClick={() => updateStatus(item._id, status)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs capitalize text-slate-600 hover:bg-slate-50">
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-display text-lg font-semibold text-slate-800">Recent Feedback</h3>
          <div className="space-y-3">
            {feedback.length === 0 && <p className="text-sm text-slate-400">No feedback submitted yet.</p>}
            {feedback.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700">{item.subject}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
