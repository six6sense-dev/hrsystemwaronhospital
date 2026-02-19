import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeProfile from './components/EmployeeProfile';
import AttendanceView from './components/AttendanceView';
import PayrollView from './components/PayrollView';
import AccountProfile from './components/AccountProfile';
import Login from './components/Login';
import { MOCK_EMPLOYEES, MOCK_ATTENDANCE, MOCK_PAYROLL, MOCK_USERS } from './constants';
import { ViewState, Employee, AttendanceRecord, PayrollRecord, User, Role, Department } from './types';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS); // Manage all system users

  // App View State
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Application Data State
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [payroll, setPayroll] = useState<PayrollRecord[]>(MOCK_PAYROLL);
  
  // Settings State
  const [departments, setDepartments] = useState<string[]>(Object.values(Department));

  const handleLogin = (loggedInUser: User) => {
    // Determine the actual current user from the updated state, not just the mock
    const currentUser = users.find(u => u.username === loggedInUser.username) || loggedInUser;
    setUser(currentUser);
    setCurrentView('DASHBOARD');
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
  
  const handleAddDepartment = (newDept: string) => {
    if (!departments.includes(newDept)) {
      setDepartments(prev => [...prev, newDept]);
    }
  };

  // Manage User Access (Admin only feature)
  const handleUpdateUserAccess = (employeeId: string, role: Role | null) => {
    setUsers(prevUsers => {
      // 1. Check if user already exists for this employee
      const existingUserIndex = prevUsers.findIndex(u => u.employeeId === employeeId);
      
      // If role is null, delete the user (Revoke access)
      if (role === null) {
        if (existingUserIndex > -1) {
          const newUsers = [...prevUsers];
          newUsers.splice(existingUserIndex, 1);
          return newUsers;
        }
        return prevUsers;
      }

      // If user exists, update role
      if (existingUserIndex > -1) {
        const newUsers = [...prevUsers];
        newUsers[existingUserIndex] = { ...newUsers[existingUserIndex], role };
        return newUsers;
      }

      // If user does not exist, create new user
      const employee = employees.find(e => e.id === employeeId);
      if (!employee) return prevUsers;

      const newUser: User = {
        id: `USR-${Date.now()}`,
        username: employee.firstName.toLowerCase().replace(/\s/g, ''),
        fullName: `${employee.firstName} ${employee.lastName}`,
        role: role,
        avatarUrl: employee.avatarUrl,
        employeeId: employee.id
      };
      
      return [...prevUsers, newUser];
    });
  };

  const renderContent = () => {
    if (!user) return null;

    // Filter data if user is STAFF
    const isStaff = user.role === 'STAFF';
    
    // For STAFF: Only show their own data
    // For ADMIN/HR: Show all data
    const visibleAttendance = isStaff 
      ? attendance.filter(r => r.employeeId === user.employeeId)
      : attendance;

    const visiblePayroll = isStaff
      ? payroll.filter(r => r.employeeId === user.employeeId)
      : payroll;

    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard employees={employees} />;
      case 'EMPLOYEES':
        return <EmployeeList 
          employees={employees} 
          users={users} // Pass all users to check linking
          currentUser={user} // Pass current user for permission checks
          departments={departments} // Pass dynamic departments
          onSelectEmployee={handleSelectEmployee} 
          onImportEmployees={handleImportEmployees}
          onUpdateAccess={handleUpdateUserAccess}
        />;
      case 'ATTENDANCE':
        return <AttendanceView 
          data={visibleAttendance}
          employees={employees}
          onImportData={handleImportAttendance} 
        />;
      case 'PAYROLL':
        return <PayrollView 
          data={visiblePayroll} 
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
            users={users}
            currentUser={user}
            departments={departments}
            onSelectEmployee={handleSelectEmployee}
            onImportEmployees={handleImportEmployees}
            onUpdateAccess={handleUpdateUserAccess}
          />
        );
      case 'ACCOUNT':
        // Find the linked employee record if available
        const linkedEmployee = user.employeeId 
          ? employees.find(e => e.id === user.employeeId) 
          : undefined;
        return (
          <AccountProfile 
            user={user} 
            linkedEmployee={linkedEmployee} 
            departments={departments}
            onAddDepartment={handleAddDepartment}
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
    <div className="flex min-h-screen bg-zinc-50">
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
        <div className="md:hidden bg-zinc-950 text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-2">
             <span className="font-bold">WARON HR</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-zinc-300">{user.username}</span>
             <button onClick={handleLogout} className="text-xs bg-zinc-800 px-3 py-1 rounded border border-zinc-700">Logout</button>
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