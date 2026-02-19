import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, MapPin, Upload } from 'lucide-react';
import { Employee, Department } from '../types';
import DataImportModal from './DataImportModal';

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  onImportEmployees: (data: any[]) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onSelectEmployee, onImportEmployees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleImport = (newData: any[]) => {
      // Basic mapping - in production needs validation
      const mapped: Employee[] = newData.map((row, idx) => ({
          id: `EMP-IMP-${Date.now()}-${idx}`,
          firstName: row.firstName || row.FirstName || 'Unknown',
          lastName: row.lastName || row.LastName || '',
          email: row.email || row.Email || '',
          phone: row.phone || row.Phone || '',
          role: row.role || row.Role || 'Staff',
          department: row.department || row.Department || Department.ADMINISTRATION,
          status: row.status || row.Status || 'Full Time',
          joinDate: row.joinDate || row.JoinDate || new Date().toISOString().split('T')[0],
          avatarUrl: `https://ui-avatars.com/api/?name=${row.firstName || 'U'}+${row.lastName || 'N'}&background=random`,
          skills: row.skills ? row.skills.split(',') : [],
          performanceRating: 0
      }));
      onImportEmployees(mapped);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Cari karyawan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <select 
               className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-teal-500 appearance-none cursor-pointer"
               value={selectedDept}
               onChange={(e) => setSelectedDept(e.target.value)}
             >
               <option value="All">All Departments</option>
               {Object.values(Department).map(dept => (
                 <option key={dept} value={dept}>{dept}</option>
               ))}
             </select>
          </div>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
             <Upload size={16} /> Import
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            + Add Employee
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div 
            key={employee.id}
            onClick={() => onSelectEmployee(employee)}
            className="group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="text-slate-400 hover:text-teal-600" />
            </div>

            <div className="flex items-center gap-4">
              <img 
                src={employee.avatarUrl} 
                alt={employee.firstName} 
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-teal-500 transition-colors"
              />
              <div>
                <h3 className="font-bold text-slate-800">{employee.firstName} {employee.lastName}</h3>
                <p className="text-sm text-teal-600 font-medium">{employee.role}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span>{employee.department}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-50 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'Full Time' ? 'bg-green-100 text-green-700' :
                  employee.status === 'On Leave' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {employee.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">Performance</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                   <span>★</span>
                   <span>{employee.performanceRating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p>Tidak ada karyawan ditemukan.</p>
        </div>
      )}

      <DataImportModal 
        type="EMPLOYEES" 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default EmployeeList;