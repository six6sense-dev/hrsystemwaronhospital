import React, { useState } from 'react';
import { Search, Filter, Upload, Briefcase, Sun, Moon, Sunset, Coffee, CalendarCheck, CalendarX, Building2, FileDown } from 'lucide-react';
import { AttendanceRecord, Employee, Department } from '../types';
import DataImportModal from './DataImportModal';
import * as XLSX from 'xlsx';

interface AttendanceViewProps {
  data: AttendanceRecord[];
  employees: Employee[];
  onImportData: (data: any[]) => void;
}

interface AttendanceSummary {
  employee: Employee;
  totalWorkDays: number;
  totalLeave: number;
  shifts: {
    Pagi: number;
    Siang: number;
    Malam: number;
    Middle: number;
  };
}

const AttendanceView: React.FC<AttendanceViewProps> = ({ data, employees, onImportData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleImport = (newData: any[]) => {
    // Map generic JSON to AttendanceRecord structure
    const mappedData: AttendanceRecord[] = newData.map((row, idx) => ({
      id: `ATT-NEW-${idx}`,
      employeeId: row.EmployeeID || row.employeeId || 'Unknown',
      employeeName: row.Name || row.employeeName || 'Unknown',
      date: row.Date || row.date || new Date().toISOString().split('T')[0],
      checkIn: row.CheckIn || row.checkIn || '-',
      checkOut: row.CheckOut || row.checkOut || '-',
      shift: row.Shift || row.shift || 'Pagi',
      status: row.Status || row.status || 'Absent',
    }));

    onImportData(mappedData);
  };

  const handleDownloadTemplate = () => {
    const headers = ['EmployeeID', 'Name', 'Date', 'CheckIn', 'CheckOut', 'Shift', 'Status'];
    const sampleData = [{
      EmployeeID: 'EMP-001',
      Name: 'Sarah Wijaya',
      Date: '2023-10-25',
      CheckIn: '08:00',
      CheckOut: '17:00',
      Shift: 'Pagi', // Pagi, Siang, Malam, Middle
      Status: 'Present'
    }];
    
    const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Attendance_WaronHospital.xlsx");
  };

  // 1. Group employees by Department
  const employeesByDept: Record<string, Employee[]> = {};
  Object.values(Department).forEach(dept => {
    employeesByDept[dept] = [];
  });
  
  // Filter employees based on search before grouping
  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredEmployees.forEach(emp => {
    if (!employeesByDept[emp.department]) {
      employeesByDept[emp.department] = [];
    }
    employeesByDept[emp.department].push(emp);
  });

  // 2. Calculate Stats per Employee
  const calculateEmployeeStats = (employeeId: string): AttendanceSummary | null => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return null;

    const records = data.filter(r => r.employeeId === employeeId);
    
    const stats = {
      employee,
      totalWorkDays: records.filter(r => r.status === 'Present' || r.status === 'Late').length,
      totalLeave: records.filter(r => r.status === 'Leave').length,
      shifts: {
        Pagi: records.filter(r => r.shift === 'Pagi').length,
        Siang: records.filter(r => r.shift === 'Siang').length,
        Malam: records.filter(r => r.shift === 'Malam').length,
        Middle: records.filter(r => r.shift === 'Middle').length,
      }
    };

    return stats;
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header & Controls */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Cari karyawan..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-zinc-700 placeholder-zinc-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          
          <button 
             onClick={handleDownloadTemplate}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors"
             title="Download Excel Template"
           >
            <FileDown size={16} /> Template
          </button>

           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
           >
            <Upload size={16} /> Import / Sync
          </button>
        </div>
      </div>

      {/* Grouped Data */}
      <div className="space-y-8">
        {Object.entries(employeesByDept).map(([dept, deptEmployees]) => {
          if (deptEmployees.length === 0) return null;

          return (
            <div key={dept} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2">
                <Building2 className="text-orange-600 w-5 h-5" />
                <h2 className="font-bold text-zinc-800 text-lg">{dept}</h2>
                <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-medium">
                  {deptEmployees.length} Staff
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="bg-white text-xs uppercase font-semibold text-zinc-500 border-b border-zinc-100">
                    <tr>
                      <th className="px-6 py-4 w-1/4">Nama Karyawan</th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <CalendarCheck className="w-4 h-4 mb-1 text-green-600" />
                          <span>Hari Kerja</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <CalendarX className="w-4 h-4 mb-1 text-red-500" />
                          <span>Total Cuti</span>
                        </div>
                      </th>
                      <th className="px-6 py-4">
                        <div className="flex justify-center gap-8">
                           <div className="flex flex-col items-center" title="Pagi">
                              <Sun className="w-4 h-4 mb-1 text-amber-500" />
                              <span>Pagi</span>
                           </div>
                           <div className="flex flex-col items-center" title="Siang">
                              <Sunset className="w-4 h-4 mb-1 text-orange-500" />
                              <span>Siang</span>
                           </div>
                           <div className="flex flex-col items-center" title="Malam">
                              <Moon className="w-4 h-4 mb-1 text-indigo-500" />
                              <span>Malam</span>
                           </div>
                           <div className="flex flex-col items-center" title="Middle">
                              <Coffee className="w-4 h-4 mb-1 text-zinc-500" />
                              <span>Middle</span>
                           </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {deptEmployees.map(emp => {
                      const stats = calculateEmployeeStats(emp.id);
                      if (!stats) return null;

                      return (
                        <tr key={emp.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={emp.avatarUrl} 
                                alt={emp.firstName} 
                                className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                              />
                              <div>
                                <div className="font-medium text-zinc-800">{emp.firstName} {emp.lastName}</div>
                                <div className="text-xs text-zinc-400">{emp.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-bold text-zinc-800 text-lg">{stats.totalWorkDays}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`font-bold text-lg ${stats.totalLeave > 0 ? 'text-red-500' : 'text-zinc-300'}`}>
                               {stats.totalLeave}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-8 text-center font-medium">
                               <div className="w-8">
                                  {stats.shifts.Pagi > 0 ? (
                                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-md">{stats.shifts.Pagi}</span>
                                  ) : <span className="text-zinc-200">-</span>}
                               </div>
                               <div className="w-8">
                                  {stats.shifts.Siang > 0 ? (
                                    <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{stats.shifts.Siang}</span>
                                  ) : <span className="text-zinc-200">-</span>}
                               </div>
                               <div className="w-8">
                                  {stats.shifts.Malam > 0 ? (
                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{stats.shifts.Malam}</span>
                                  ) : <span className="text-zinc-200">-</span>}
                               </div>
                               <div className="w-8">
                                  {stats.shifts.Middle > 0 ? (
                                    <span className="text-zinc-600 bg-zinc-100 px-2 py-1 rounded-md">{stats.shifts.Middle}</span>
                                  ) : <span className="text-zinc-200">-</span>}
                               </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
           <div className="text-center py-12 text-zinc-400 bg-white rounded-xl border border-zinc-200">
             <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No employees found matching your search.</p>
           </div>
        )}
      </div>

      <DataImportModal 
        type="ATTENDANCE" 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default AttendanceView;