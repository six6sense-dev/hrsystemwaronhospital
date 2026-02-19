import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Lock, Save, Camera, Smartphone, Building, Settings, Plus, Tag } from 'lucide-react';
import { User as UserType, Employee } from '../types';

interface AccountProfileProps {
  user: UserType;
  linkedEmployee?: Employee;
  departments: string[];
  onAddDepartment: (dept: string) => void;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user, linkedEmployee, departments, onAddDepartment }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'SYSTEM'>('GENERAL');
  
  // Mock form states
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Department state
  const [newDept, setNewDept] = useState('');

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDept.trim()) {
      onAddDepartment(newDept.trim());
      setNewDept('');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="h-32 bg-slate-900">
           <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400 to-transparent"></div>
        </div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-end -mt-12 gap-6">
          <div className="relative group">
            <img 
              src={user.avatarUrl} 
              alt={user.fullName} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{user.fullName}</h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
               <ShieldCheck size={16} className="text-teal-600" />
               <span>{user.role} Account</span>
               {user.employeeId && <span className="text-slate-300">|</span>}
               {user.employeeId && <span>ID: {user.employeeId}</span>}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-8 flex gap-6 border-t border-slate-100 mt-4 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('GENERAL')}
             className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'GENERAL' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             General Information
           </button>
           <button 
             onClick={() => setActiveTab('SECURITY')}
             className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SECURITY' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
           >
             Security & Password
           </button>
           {user.role === 'ADMIN' && (
              <button 
                onClick={() => setActiveTab('SYSTEM')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SYSTEM' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                System Settings
              </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Account Summary */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Account Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <User size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Username</p>
                      <p className="font-medium text-slate-700">{user.username}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <ShieldCheck size={20} />
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Role</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {user.role}
                      </span>
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <p className="text-xs text-slate-400 mb-2">Linked Employee Profile</p>
                   {linkedEmployee ? (
                     <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                        <img src={linkedEmployee.avatarUrl} alt="Employee" className="w-8 h-8 rounded-full" />
                        <div className="overflow-hidden">
                           <p className="text-sm font-bold text-slate-700 truncate">{linkedEmployee.firstName} {linkedEmployee.lastName}</p>
                           <p className="text-xs text-slate-500 truncate">{linkedEmployee.department}</p>
                        </div>
                     </div>
                   ) : (
                     <p className="text-sm text-slate-500 italic">No specific employee record linked to this admin account.</p>
                   )}
                </div>
              </div>
           </div>
        </div>

        {/* Right Card: Forms */}
        <div className="md:col-span-2">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              {activeTab === 'GENERAL' && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-slate-800">Personal Information</h3>
                      <button className="text-teal-600 text-sm font-medium hover:underline">Edit Details</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                         <input 
                           type="text" 
                           value={user.fullName}
                           readOnly
                           className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                         <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="email" 
                              value={linkedEmployee?.email || 'admin@waronhospital.com'}
                              readOnly
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                            />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                         <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="text" 
                              value={linkedEmployee?.phone || '-'}
                              readOnly
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                            />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                         <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="text" 
                              value={linkedEmployee?.department || 'Administration'}
                              readOnly
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'SECURITY' && (
                <div className="space-y-6">
                   <h3 className="font-bold text-slate-800 mb-4">Change Password</h3>
                   
                   <div className="space-y-4 max-w-md">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                         <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="password" 
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              placeholder="••••••••"
                            />
                         </div>
                      </div>
                      
                      <div className="pt-2">
                         <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                         <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              placeholder="••••••••"
                            />
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                         <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              placeholder="••••••••"
                            />
                         </div>
                      </div>
                      
                      <div className="pt-4">
                        <button className="flex items-center justify-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors shadow-sm w-full md:w-auto">
                           <Save size={18} /> Update Password
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'SYSTEM' && user.role === 'ADMIN' && (
                 <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-800 mb-4">
                       <Settings className="w-5 h-5" />
                       <h3 className="font-bold">Department Configuration</h3>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                       <h4 className="text-sm font-medium text-slate-700 mb-3">Add New Department</h4>
                       <form onSubmit={handleAddDept} className="flex gap-2">
                          <input 
                             type="text" 
                             value={newDept}
                             onChange={(e) => setNewDept(e.target.value)}
                             placeholder="e.g. Oncology"
                             className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                          />
                          <button 
                             type="submit"
                             className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm flex items-center gap-2"
                          >
                             <Plus size={16} /> Add
                          </button>
                       </form>
                    </div>

                    <div>
                       <h4 className="text-sm font-medium text-slate-700 mb-3">Active Departments</h4>
                       <div className="flex flex-wrap gap-2">
                          {departments.map((dept) => (
                             <div key={dept} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 shadow-sm">
                                <Tag size={14} className="text-teal-500" />
                                <span>{dept}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;