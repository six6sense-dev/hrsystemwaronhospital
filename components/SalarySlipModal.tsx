import React from 'react';
import { X, Printer, Download, Activity } from 'lucide-react';
import { PayrollRecord, Employee } from '../types';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
  employees: Employee[];
}

const SalarySlipModal: React.FC<SalarySlipModalProps> = ({ isOpen, onClose, record, employees }) => {
  if (!isOpen || !record) return null;

  // Find employee details to get department/role
  const employee = employees.find(e => e.id === record.employeeId) || {
    department: 'General',
    role: 'Staff',
    joinDate: '-'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8">
        
        {/* Action Buttons (Hidden in Print) */}
        <div className="absolute -top-12 right-0 flex gap-2 no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium transition-colors"
          >
            <Printer size={18} /> Print
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 font-medium transition-colors"
          >
            <X size={18} /> Close
          </button>
        </div>

        {/* Slip Content */}
        <div id="salary-slip-modal" className="bg-white p-8 md:p-12 rounded-xl shadow-2xl text-zinc-800">
          {/* Header */}
          <div className="border-b-2 border-zinc-800 pb-6 mb-8 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center print:bg-orange-600">
                <Activity className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="font-bold text-2xl tracking-wide text-zinc-900">WARON HOSPITAL</h1>
                <p className="text-xs text-zinc-500">Jl. Kesehatan No. 123, Jakarta Selatan</p>
                <p className="text-xs text-zinc-500">Ph: (021) 555-0123 | Email: hr@waronhospital.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-zinc-400 uppercase tracking-widest">Payslip</h2>
              <p className="font-medium text-zinc-600 mt-1">{record.month}</p>
            </div>
          </div>

          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <p className="text-zinc-400 text-xs uppercase font-semibold mb-1">Employee Details</p>
              <div className="font-bold text-lg">{record.employeeName}</div>
              <div className="text-zinc-600">{employee.role}</div>
              <div className="text-zinc-500">{record.employeeId}</div>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-xs uppercase font-semibold mb-1">Department</p>
              <div className="font-bold text-lg">{employee.department}</div>
              <p className="text-zinc-400 text-xs uppercase font-semibold mt-2 mb-1">Status</p>
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${record.status === 'Paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                {record.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            {/* Earnings */}
            <div>
              <h3 className="font-bold text-zinc-700 border-b border-zinc-200 pb-2 mb-4">Earnings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Basic Salary</span>
                  <span className="font-mono font-medium">{formatCurrency(record.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Medical Allowance</span>
                  <span className="font-mono font-medium">{formatCurrency(record.allowances * 0.4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Transport Allowance</span>
                  <span className="font-mono font-medium">{formatCurrency(record.allowances * 0.3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Performance Bonus</span>
                  <span className="font-mono font-medium">{formatCurrency(record.allowances * 0.3)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-100 font-bold text-zinc-800">
                  <span>Total Earnings</span>
                  <span>{formatCurrency(record.basicSalary + record.allowances)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-bold text-zinc-700 border-b border-zinc-200 pb-2 mb-4">Deductions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Tax (PPh 21)</span>
                  <span className="font-mono font-medium text-red-500">-{formatCurrency(record.deductions * 0.6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">BPJS Kesehatan</span>
                  <span className="font-mono font-medium text-red-500">-{formatCurrency(record.deductions * 0.2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">BPJS Ketenagakerjaan</span>
                  <span className="font-mono font-medium text-red-500">-{formatCurrency(record.deductions * 0.2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-100 font-bold text-zinc-800">
                  <span>Total Deductions</span>
                  <span className="text-red-600">-{formatCurrency(record.deductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          <div className="bg-zinc-50 rounded-lg p-6 flex justify-between items-center mb-12 print:bg-zinc-100">
            <div>
              <p className="text-zinc-500 text-sm font-medium">Net Payable Salary</p>
              <p className="text-xs text-zinc-400">Transfer to Bank Account</p>
            </div>
            <div className="text-3xl font-bold text-zinc-900">
              {formatCurrency(record.netSalary)}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end text-sm text-zinc-500 mt-12 pt-8 border-t border-zinc-100">
            <div>
              <p>Generated by Waron HR System</p>
              <p className="text-xs mt-1">This is a computer-generated document. No signature is required.</p>
            </div>
            <div className="text-center w-32">
              <div className="h-16 mb-2 border-b border-zinc-300"></div>
              <p className="text-xs font-medium uppercase">HR Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlipModal;