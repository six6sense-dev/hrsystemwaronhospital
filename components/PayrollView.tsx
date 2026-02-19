import React, { useState } from 'react';
import { Search, Filter, Upload, Download, DollarSign, AlertCircle, FileText, Send, Mail, FileDown } from 'lucide-react';
import { PayrollRecord, Employee } from '../types';
import DataImportModal from './DataImportModal';
import SalarySlipModal from './SalarySlipModal';
import { MOCK_EMPLOYEES } from '../constants'; // Fallback if not passed, though normally would come from App state
import * as XLSX from 'xlsx';

interface PayrollViewProps {
  data: PayrollRecord[];
  onImportData: (data: any[]) => void;
}

const PayrollView: React.FC<PayrollViewProps> = ({ data, onImportData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Salary Slip State
  const [viewingSlip, setViewingSlip] = useState<PayrollRecord | null>(null);
  
  // Email Sending State
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  const filteredData = data.filter(item => 
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImport = (newData: any[]) => {
    const mappedData: PayrollRecord[] = newData.map((row, idx) => ({
      id: `PAY-NEW-${idx}`,
      employeeId: row.EmployeeID || row.employeeId || 'Unknown',
      employeeName: row.Name || row.employeeName || 'Unknown',
      month: row.Month || row.month || 'Current Month',
      basicSalary: Number(row.BasicSalary || row.basicSalary || 0),
      allowances: Number(row.Allowances || row.allowances || 0),
      deductions: Number(row.Deductions || row.deductions || 0),
      netSalary: Number(row.NetSalary || row.netSalary || 0),
      status: row.Status || row.status || 'Processing',
    }));
    onImportData(mappedData);
  };

  const handleDownloadTemplate = () => {
    const headers = ['EmployeeID', 'Name', 'Month', 'BasicSalary', 'Allowances', 'Deductions', 'Status'];
    const sampleData = [{
      EmployeeID: 'EMP-001',
      Name: 'Sarah Wijaya',
      Month: 'October 2023',
      BasicSalary: 5000000,
      Allowances: 1000000,
      Deductions: 200000,
      Status: 'Processing'
    }];

    const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Payroll_WaronHospital.xlsx");
  };

  const handleSendAllEmails = () => {
    if (confirm(`Send salary slips to all ${filteredData.length} employees via email?`)) {
      setIsSendingEmails(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsSendingEmails(false);
        setEmailStatus('SUCCESS');
        
        // Reset success message after 3 seconds
        setTimeout(() => setEmailStatus('IDLE'), 3000);
      }, 2000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Cari data gaji..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
           {/* Email Button */}
           <button 
             onClick={handleSendAllEmails}
             disabled={isSendingEmails}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
               emailStatus === 'SUCCESS' 
                 ? 'bg-green-600 text-white' 
                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
             }`}
           >
             {isSendingEmails ? (
               <>
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Sending...
               </>
             ) : emailStatus === 'SUCCESS' ? (
               <>
                 <Send size={16} /> Sent!
               </>
             ) : (
               <>
                 <Mail size={16} /> Email All Slips
               </>
             )}
           </button>

           <button 
             onClick={handleDownloadTemplate}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
             title="Download Excel Template"
           >
              <FileDown size={16} /> Template
           </button>

           <button 
             onClick={() => setIsImportModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
           >
            <Upload size={16} /> Import
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                 <DollarSign size={20} />
               </div>
               <span className="text-slate-500 font-medium text-sm">Total Disbursed</span>
             </div>
             <p className="text-2xl font-bold text-slate-800">
               {formatCurrency(data.filter(d => d.status === 'Paid').reduce((acc, cur) => acc + cur.netSalary, 0))}
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                 <AlertCircle size={20} />
               </div>
               <span className="text-slate-500 font-medium text-sm">Pending Approval</span>
             </div>
             <p className="text-2xl font-bold text-slate-800">
               {data.filter(d => d.status === 'Processing' || d.status === 'Pending').length} Request
             </p>
          </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Basic Salary</th>
                <th className="px-6 py-4">Net Salary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-800">{record.employeeName}</div>
                      <div className="text-xs text-slate-400">{record.employeeId}</div>
                    </div>
                  </td>
                   <td className="px-6 py-4 text-slate-500">{record.month}</td>
                  <td className="px-6 py-4">{formatCurrency(record.basicSalary)}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(record.netSalary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      record.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setViewingSlip(record)}
                      className="text-teal-600 hover:text-teal-800 p-2 hover:bg-teal-50 rounded-lg transition-colors group relative"
                      title="View Salary Slip"
                    >
                      <FileText size={18} />
                      <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        View Slip
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
             <div className="text-center py-12 text-slate-400">
               No payroll records found.
             </div>
          )}
        </div>
      </div>

       <DataImportModal 
        type="PAYROLL" 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      <SalarySlipModal 
        isOpen={!!viewingSlip} 
        onClose={() => setViewingSlip(null)} 
        record={viewingSlip}
        employees={MOCK_EMPLOYEES} // In a real app, pass current employees state here
      />
    </div>
  );
};

export default PayrollView;