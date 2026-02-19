import React from 'react';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'EMPLOYEES', label: 'Karyawan', icon: Users },
    { id: 'ATTENDANCE', label: 'Absensi', icon: Clock },
    { id: 'PAYROLL', label: 'Gaji', icon: DollarSign },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
          <Activity className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">WARON</h1>
          <p className="text-xs text-slate-400">Hospital HR</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'PROFILE' && item.id === 'EMPLOYEES');
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-2 mb-4">
            <img 
                src={user.avatarUrl} 
                alt={user.fullName}
                className="w-10 h-10 rounded-full border-2 border-teal-500"
            />
            <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                <div className="flex items-center gap-1 text-xs text-teal-400">
                    <ShieldCheck size={10} />
                    <span>{user.role}</span>
                </div>
            </div>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 w-full rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;