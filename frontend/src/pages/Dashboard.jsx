import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck2, ListChecks, Megaphone, Clock3, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({ summary: { percentage: 0, present: 0, total: 0 } });
  const [tasks, setTasks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [attRes, taskRes, noticeRes, ttRes] = await Promise.all([
          api.get('/attendance'),
          api.get('/tasks'),
          api.get('/notices'),
          api.get('/timetable'),
        ]);
        setAttendance(attRes.data);
        setTasks(taskRes.data);
        setNotices(noticeRes.data);
        setTimetable(ttRes.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const todaysClasses = timetable
    .filter((t) => t.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pct = attendance.summary?.percentage || 0;
  const pieData = [
    { name: 'Present', value: pct },
    { name: 'Remaining', value: 100 - pct },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck2} label="Attendance" value={`${pct}%`} accent="emerald" sub={`${attendance.summary?.present || 0}/${attendance.summary?.total || 0} classes`} />
        <StatCard icon={ListChecks} label="Pending Tasks" value={pendingTasks.length} accent="amber" sub={`${tasks.length} total`} />
        <StatCard icon={Megaphone} label="Notices" value={notices.length} accent="rose" sub="Stay updated" />
        <StatCard icon={Clock3} label="Today's Classes" value={todaysClasses.length} accent="primary" sub={todayName} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance chart */}
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <h3 className="font-display mb-4 text-base font-semibold text-slate-800">Attendance Overview</h3>
          <div className="relative mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={75} startAngle={90} endAngle={-270}>
                  <Cell fill="#4f46e5" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold text-slate-800">{pct}%</span>
              <span className="text-xs text-slate-400">Overall</span>
            </div>
          </div>
          <Link to="/attendance" className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:underline">
            View details <ArrowRight size={14} />
          </Link>
        </div>

        {/* Pending tasks */}
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-slate-800">Pending Tasks</h3>
            <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">View all</Link>
          </div>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-400">You're all caught up. 🎉</p>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <li key={task._id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.subject || task.type}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    task.priority === 'high' ? 'bg-rose-50 text-rose-600' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notices */}
        <div className="rounded-2xl bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-slate-800">Latest Notices</h3>
            <Link to="/notices" className="text-sm font-medium text-primary-600 hover:underline">View all</Link>
          </div>
          {notices.length === 0 ? (
            <p className="text-sm text-slate-400">No notices yet.</p>
          ) : (
            <ul className="space-y-3">
              {notices.slice(0, 4).map((n) => (
                <li key={n._id} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-medium text-slate-700">{n.title}</p>
                  <p className="line-clamp-2 text-xs text-slate-400">{n.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Today's timetable */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-slate-800">Today's Timetable — {todayName}</h3>
          <Link to="/timetable" className="text-sm font-medium text-primary-600 hover:underline">Full timetable</Link>
        </div>
        {todaysClasses.length === 0 ? (
          <p className="text-sm text-slate-400">No classes scheduled for today.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {todaysClasses.map((c) => (
              <div key={c._id} className="min-w-[180px] rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-medium text-primary-600">{c.startTime} - {c.endTime}</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{c.subject}</p>
                <p className="text-xs text-slate-400">{c.room} {c.faculty && `· ${c.faculty}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
