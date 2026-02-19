import React, { useState, useEffect } from 'react';
import { X, Shield, Save, UserPlus, UserX, AlertTriangle } from 'lucide-react';
import { Employee, Role, User } from '../types';

interface UserAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  existingUser: User | null;
  onSave: (employeeId: string, role: Role | null) => void;
}

const UserAccessModal: React.FC<UserAccessModalProps> = ({ isOpen, onClose, employee, existingUser, onSave }) => {
  const [selectedRole, setSelectedRole] = useState<Role | 'NO_ACCESS'>('STAFF');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (isOpen && employee) {
      if (existingUser) {
        setSelectedRole(existingUser.role);
        setUsername(existingUser.username);
      } else {
        setSelectedRole('NO_ACCESS');
        // Generate default username
        setUsername(employee.firstName.toLowerCase().replace(/\s/g, ''));
      }
    }
  }, [isOpen, employee, existingUser]);

  if (!isOpen || !employee) return null;

  const handleSave = () => {
    if (selectedRole === 'NO_ACCESS') {
      onSave(employee.id, null); // Null means remove access/user
    } else {
      onSave(employee.id, selectedRole);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-700">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Manage System Access</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <img 
              src={employee.avatarUrl} 
              alt={employee.firstName} 
              className="w-12 h-12 rounded-full border border-slate-200"
            />
            <div>
              <p className="font-bold text-slate-800">{employee.firstName} {employee.lastName}</p>
              <p className="text-xs text-slate-500">{employee.role}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">System Access Level</label>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setSelectedRole('NO_ACCESS')}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                  selectedRole === 'NO_ACCESS' 
                    ? 'border-slate-400 bg-slate-100 text-slate-800 ring-1 ring-slate-400' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserX size={16} />
                  <span>No Access</span>
                </div>
                {selectedRole === 'NO_ACCESS' && <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
              </button>

              <button
                onClick={() => setSelectedRole('STAFF')}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                  selectedRole === 'STAFF' 
                    ? 'border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-500' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>Staff</span>
                </div>
                <span className="text-xs text-slate-400">View own data only</span>
              </button>

              <button
                onClick={() => setSelectedRole('HR_MANAGER')}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                  selectedRole === 'HR_MANAGER' 
                    ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                 <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  <span>HR Manager</span>
                </div>
                <span className="text-xs text-slate-400">Manage Employees & Payroll</span>
              </button>

              <button
                onClick={() => setSelectedRole('ADMIN')}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                  selectedRole === 'ADMIN' 
                    ? 'border-purple-500 bg-purple-50 text-purple-800 ring-1 ring-purple-500' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-purple-600" />
                  <span>Administrator</span>
                </div>
                <span className="text-xs text-slate-400">Full System Access</span>
              </button>
            </div>
          </div>

          {selectedRole !== 'NO_ACCESS' && !existingUser && (
             <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5" />
                <div>
                  <p className="font-bold">New User Account</p>
                  <p>A new account will be created with Username: <strong>{username}</strong> and Password: <strong>{username}</strong></p>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccessModal;