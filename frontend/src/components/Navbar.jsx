import React from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'S';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="font-display text-base font-semibold text-slate-800 sm:text-lg">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </p>
          <p className="hidden text-xs text-slate-400 sm:block">Here's what's happening on campus today.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: user?.avatarColor || '#6366f1' }}
        >
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:flex"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
