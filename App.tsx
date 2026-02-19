import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeProfile from './components/EmployeeProfile';
import AttendanceView from './components/AttendanceView';
import PayrollView from './components/PayrollView';
import Login from './components/Login';
import { MOCK_EMPLOYEES, MOCK_ATTENDANCE, MOCK_PAYROLL } from './constants';
import { ViewState, Employee, AttendanceRecord, PayrollRecord, User } from './types';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // App View State
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Application Data State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(MOCK_PAYROLL);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('DASHBOARD');
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCurrentView('PROFILE');
  };

  const handleImportEmployees = (newEmployees: Employee[]) => {
    setEmployees(prev => [...prev, ...newEmployees]);
  };

  const handleImportAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance(prev => [...newRecords, ...prev]);
  };

  const handleImportPayroll = (newRecords: PayrollRecord[]) => {
    setPayroll(prev => [...newRecords, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard employees={employees} />;
      case 'EMPLOYEES':
        return <EmployeeList 
          employees={employees} 
          onSelectEmployee={handleSelectEmployee} 
          onImportEmployees={handleImportEmployees}
        />;
      case 'ATTENDANCE':
        return <AttendanceView 
          data={attendance}
          employees={employees}
          onImportData={handleImportAttendance} 
        />;
      case 'PAYROLL':
        return <PayrollView 
          data={payroll} 
          onImportData={handleImportPayroll} 
        />;
      case 'PROFILE':
        return selectedEmployee ? (
          <EmployeeProfile 
            employee={selectedEmployee} 
            onBack={() => setCurrentView('EMPLOYEES')} 
          />
        ) : (
          <EmployeeList 
            employees={employees} 
            onSelectEmployee={handleSelectEmployee}
            onImportEmployees={handleImportEmployees}
          />
        );
      default:
        return <Dashboard employees={employees} />;
    }
  };

  // Auth Guard
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 transition-all">
        {/* Top Header Mobile */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-2">
             <span className="font-bold">WARON HR</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-slate-300">{user.username}</span>
             <button onClick={handleLogout} className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700">Logout</button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;