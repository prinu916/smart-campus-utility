import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  CalendarCheck2,
  Megaphone,
  StickyNote,
  CalendarDays,
  UserCircle2,
  GraduationCap,
  MessageSquareWarning,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks & Assignments', icon: ListChecks },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck2 },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/notices', label: 'Notices', icon: Megaphone },
  { to: '/support', label: 'Complaints & Feedback', icon: MessageSquareWarning },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 h-full w-64 shrink-0 transform border-r border-slate-100 bg-white p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center gap-2 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-display text-lg font-semibold text-slate-800">Smart Campus</span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
