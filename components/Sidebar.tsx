import React from 'react';
import { LayoutDashboard, Users, Activity, LogOut, Clock, DollarSign, ShieldCheck, Settings, User as UserIcon } from 'lucide-react';
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
    { id: 'EMPLOYEES', label: 'Karyawan', icon: Users, restricted: true }, // Restricted to Admin/HR
    { id: 'ATTENDANCE', label: 'Absensi', icon: Clock },
    { id: 'PAYROLL', label: 'Gaji', icon: DollarSign },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-zinc-950 text-white min-h-screen fixed left-0 top-0 z-10 shadow-xl border-r border-zinc-900">
      <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Activity className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">WARON</h1>
          <p className="text-xs text-zinc-400">Hospital HR</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Main Menu</p>
        {menuItems.map((item) => {
          // Hide Employees menu if user is STAFF
          if (item.restricted && user.role === 'STAFF') return null;

          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'PROFILE' && item.id === 'EMPLOYEES');
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon size={20} className={`transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-900 bg-zinc-950">
        <button 
          onClick={() => onChangeView('ACCOUNT')}
          className={`w-full flex items-center gap-3 px-2 mb-4 p-2 rounded-lg transition-colors ${currentView === 'ACCOUNT' ? 'bg-zinc-900' : 'hover:bg-zinc-900'}`}
        >
            <img 
                src={user.avatarUrl} 
                alt={user.fullName}
                className="w-10 h-10 rounded-full border-2 border-orange-600"
            />
            <div className="overflow-hidden text-left">
                <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                <div className="flex items-center gap-1 text-xs text-orange-500">
                    <ShieldCheck size={10} />
                    <span>{user.role}</span>
                </div>
            </div>
            <Settings size={16} className="ml-auto text-zinc-500" />
        </button>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-red-950/30 w-full rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;