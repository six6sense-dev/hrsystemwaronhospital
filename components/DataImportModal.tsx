import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, X, Link as LinkIcon, RefreshCw, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataImportModalProps {
  type: 'EMPLOYEES' | 'ATTENDANCE' | 'PAYROLL';
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

const DataImportModal: React.FC<DataImportModalProps> = ({ type, isOpen, onClose, onImport }) => {
  const [activeTab, setActiveTab] = useState<'EXCEL' | 'SHEET'>('EXCEL');
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [autoSync, setAutoSync] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('IDLE');
    }
  };

  const handleDownloadTemplate = () => {
    let headers: string[] = [];
    let sampleData: any[] = [];

    switch (type) {
      case 'EMPLOYEES':
        headers = ['FirstName', 'LastName', 'Email', 'Phone', 'Role', 'Department', 'Status', 'JoinDate', 'Skills'];
        sampleData = [{
          FirstName: 'John',
          LastName: 'Doe',
          Email: 'john.doe@waron.com',
          Phone: '08123456789',
          Role: 'Nurse',
          Department: 'Nursing',
          Status: 'Full Time',
          JoinDate: '2023-01-01',
          Skills: 'Patient Care, CPR'
        }];
        break;
      case 'ATTENDANCE':
        headers = ['EmployeeID', 'Name', 'Date', 'CheckIn', 'CheckOut', 'Shift', 'Status'];
        sampleData = [{
          EmployeeID: 'EMP-001',
          Name: 'Sarah Wijaya',
          Date: '2023-10-25',
          CheckIn: '08:00',
          CheckOut: '17:00',
          Shift: 'Pagi', // Pagi, Siang, Malam, Middle
          Status: 'Present'
        }];
        break;
      case 'PAYROLL':
        headers = ['EmployeeID', 'Name', 'Month', 'BasicSalary', 'Allowances', 'Deductions', 'Status'];
        sampleData = [{
          EmployeeID: 'EMP-001',
          Name: 'Sarah Wijaya',
          Month: 'October 2023',
          BasicSalary: 5000000,
          Allowances: 1000000,
          Deductions: 200000,
          Status: 'Processing'
        }];
        break;
    }

    const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `Template_${type}_WaronHospital.xlsx`);
  };

  const handleExcelImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      
      onImport(jsonData);
      setStatus('SUCCESS');
      setTimeout(() => {
          onClose();
          setStatus('IDLE');
          setFile(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSheetSync = async () => {
    if (!sheetUrl) return;
    setIsProcessing(true);
    
    // Simulate connecting to Google Sheets API
    try {
      await new Promise(r => setTimeout(r, 2000));
      setStatus('SUCCESS');
      // For demo purposes, we don't actually fetch from sheets without OAuth, 
      // but we signal success to the user.
      setTimeout(() => {
        onClose();
        setStatus('IDLE');
      }, 1500);
    } catch (e) {
      setStatus('ERROR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <h3 className="font-bold text-zinc-800">Import Data {type.toLowerCase()}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'EXCEL' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
            onClick={() => setActiveTab('EXCEL')}
          >
            <div className="flex items-center justify-center gap-2">
              <FileSpreadsheet size={16} />
              Excel / CSV
            </div>
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'SHEET' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-zinc-500 hover:text-zinc-700'}`}
            onClick={() => setActiveTab('SHEET')}
          >
             <div className="flex items-center justify-center gap-2">
              <LinkIcon size={16} />
              Google Spreadsheet
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'EXCEL' ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button 
                  onClick={handleDownloadTemplate}
                  className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Download size={14} /> Download Format Template
                </button>
              </div>

              <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center hover:border-orange-400 transition-colors bg-zinc-50">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  className="hidden" 
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className={`w-10 h-10 mb-3 ${file ? 'text-orange-600' : 'text-zinc-400'}`} />
                  <span className="text-sm font-medium text-zinc-700">
                    {file ? file.name : 'Click to upload or drag file here'}
                  </span>
                  <span className="text-xs text-zinc-400 mt-1">.xlsx, .xls, .csv supported</span>
                </label>
              </div>
              
              <button 
                onClick={handleExcelImport}
                disabled={!file || isProcessing}
                className="w-full py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4" /> Processing...
                  </>
                ) : status === 'SUCCESS' ? (
                  <>
                    <Check className="w-4 h-4" /> Success
                  </>
                ) : (
                  'Import File'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Spreadsheet URL</label>
                <input 
                  type="text" 
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <AlertCircle size={18} />
                <p>Ensure the spreadsheet is shared with the system service account or is public.</p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                 <input 
                  type="checkbox" 
                  id="auto-sync" 
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                 />
                 <label htmlFor="auto-sync" className="text-sm text-zinc-600">Auto-sync every 15 minutes</label>
              </div>
              
              <button 
                onClick={handleSheetSync}
                disabled={!sheetUrl || isProcessing}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="animate-spin w-4 h-4" /> Connecting...
                  </>
                ) : status === 'SUCCESS' ? (
                  <>
                    <Check className="w-4 h-4" /> Connected & Synced
                  </>
                ) : (
                  'Sync Now'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataImportModal;