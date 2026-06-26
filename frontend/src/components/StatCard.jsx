import React from 'react';

const StatCard = ({ icon: Icon, label, value, accent = 'primary', sub }) => {
  const accentMap = {
    primary: 'bg-primary-50 text-primary-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="font-display text-2xl font-semibold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
