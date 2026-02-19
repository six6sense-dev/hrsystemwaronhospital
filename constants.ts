import { Employee, Department, EmploymentStatus, AttendanceRecord, PayrollRecord, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'admin',
    fullName: 'Dr. Hendra Gunawan',
    role: 'ADMIN',
    avatarUrl: 'https://ui-avatars.com/api/?name=Hendra+Gunawan&background=0d9488&color=fff'
  },
  {
    id: 'USR-002',
    username: 'hr',
    fullName: 'Linda Kusuma',
    role: 'HR_MANAGER',
    avatarUrl: 'https://picsum.photos/id/338/200/200',
    employeeId: 'EMP-005' // Linked to Linda's employee record
  },
  {
    id: 'USR-003',
    username: 'staff',
    fullName: 'Sarah Wijaya',
    role: 'STAFF',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    employeeId: 'EMP-001' // Linked to Sarah's employee record
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Wijaya',
    email: 'sarah.wijaya@waronhospital.com',
    phone: '+62 812-3456-7890',
    role: 'Senior Cardiologist',
    department: Department.CARDIOLOGY,
    status: EmploymentStatus.FULL_TIME,
    joinDate: '2018-03-15',
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    skills: ['Cardiac Surgery', 'Echocardiography', 'Patient Care', 'Team Leadership'],
    performanceRating: 4.8,
    recentAchievements: ['Led successful heart transplant', 'Published research paper on arrhythmia']
  },
  {
    id: 'EMP-002',
    firstName: 'Budi',
    lastName: 'Santoso',
    email: 'budi.santoso@waronhospital.com',
    phone: '+62 811-2233-4455',
    role: 'Head Nurse',
    department: Department.NURSING,
    status: EmploymentStatus.FULL_TIME,
    joinDate: '2015-06-01',
    avatarUrl: 'https://picsum.photos/id/91/200/200',
    skills: ['Emergency Triage', 'Staff Management', 'ICU Care'],
    performanceRating: 4.9,
    recentAchievements: ['Organized COVID-19 vaccination drive', 'Employee of the month - June 2023']
  },
  {
    id: 'EMP-003',
    firstName: 'Jessica',
    lastName: 'Tan',
    email: 'jessica.tan@waronhospital.com',
    phone: '+62 813-9988-7766',
    role: 'Neurologist',
    department: Department.NEUROLOGY,
    status: EmploymentStatus.PART_TIME,
    joinDate: '2020-01-10',
    avatarUrl: 'https://picsum.photos/id/65/200/200',
    skills: ['Brain Mapping', 'Stroke Rehabilitation', 'Clinical Research'],
    performanceRating: 4.5,
    recentAchievements: []
  },
  {
    id: 'EMP-004',
    firstName: 'Ahmad',
    lastName: 'Fauzi',
    email: 'ahmad.fauzi@waronhospital.com',
    phone: '+62 855-1212-3434',
    role: 'Laboratory Technician',
    department: Department.LABORATORY,
    status: EmploymentStatus.CONTRACT,
    joinDate: '2022-11-20',
    avatarUrl: 'https://picsum.photos/id/177/200/200',
    skills: ['Blood Analysis', 'Equipment Maintenance', 'Safety Protocols'],
    performanceRating: 4.2,
    recentAchievements: ['Optimized lab testing workflow']
  },
  {
    id: 'EMP-005',
    firstName: 'Linda',
    lastName: 'Kusuma',
    email: 'linda.kusuma@waronhospital.com',
    phone: '+62 818-0099-8877',
    role: 'HR Manager',
    department: Department.ADMINISTRATION,
    status: EmploymentStatus.FULL_TIME,
    joinDate: '2019-09-01',
    avatarUrl: 'https://picsum.photos/id/338/200/200',
    skills: ['Recruitment', 'Conflict Resolution', 'Payroll Management'],
    performanceRating: 4.7,
    recentAchievements: ['Implemented new HRIS system']
  },
   {
    id: 'EMP-006',
    firstName: 'Dr. Ryan',
    lastName: 'Pratama',
    email: 'ryan.pratama@waronhospital.com',
    phone: '+62 812-5555-6666',
    role: 'Pediatrician',
    department: Department.PEDIATRICS,
    status: EmploymentStatus.FULL_TIME,
    joinDate: '2021-04-12',
    avatarUrl: 'https://picsum.photos/id/342/200/200',
    skills: ['Child Development', 'Vaccination', 'Pediatric Emergency'],
    performanceRating: 4.6,
    recentAchievements: ['Started free weekend clinic for underprivileged children']
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  // EMP-001 Sarah (Cardiology) - Mostly Pagi
  { id: 'ATT-001', employeeId: 'EMP-001', employeeName: 'Sarah Wijaya', date: '2023-10-25', checkIn: '07:55', checkOut: '16:00', shift: 'Pagi', status: 'Present' },
  { id: 'ATT-001b', employeeId: 'EMP-001', employeeName: 'Sarah Wijaya', date: '2023-10-24', checkIn: '07:50', checkOut: '16:10', shift: 'Pagi', status: 'Present' },
  { id: 'ATT-001c', employeeId: 'EMP-001', employeeName: 'Sarah Wijaya', date: '2023-10-23', checkIn: '08:10', checkOut: '16:00', shift: 'Pagi', status: 'Late' },
  
  // EMP-002 Budi (Nursing) - Shifts
  { id: 'ATT-002', employeeId: 'EMP-002', employeeName: 'Budi Santoso', date: '2023-10-25', checkIn: '07:30', checkOut: '14:30', shift: 'Pagi', status: 'Present' },
  { id: 'ATT-002b', employeeId: 'EMP-002', employeeName: 'Budi Santoso', date: '2023-10-24', checkIn: '14:00', checkOut: '21:00', shift: 'Siang', status: 'Present' },
  { id: 'ATT-002c', employeeId: 'EMP-002', employeeName: 'Budi Santoso', date: '2023-10-23', checkIn: '21:00', checkOut: '07:00', shift: 'Malam', status: 'Present' },

  // EMP-003 Jessica (Neurology) - Middle & Leave
  { id: 'ATT-003', employeeId: 'EMP-003', employeeName: 'Jessica Tan', date: '2023-10-25', checkIn: '10:00', checkOut: '18:00', shift: 'Middle', status: 'Present' },
  { id: 'ATT-003b', employeeId: 'EMP-003', employeeName: 'Jessica Tan', date: '2023-10-24', checkIn: '-', checkOut: '-', shift: 'Pagi', status: 'Leave' },

  // EMP-004 Ahmad (Lab) - Pagi
  { id: 'ATT-004', employeeId: 'EMP-004', employeeName: 'Ahmad Fauzi', date: '2023-10-25', checkIn: '08:00', checkOut: '16:00', shift: 'Pagi', status: 'Present' },
  { id: 'ATT-004b', employeeId: 'EMP-004', employeeName: 'Ahmad Fauzi', date: '2023-10-24', checkIn: '08:00', checkOut: '16:00', shift: 'Pagi', status: 'Present' },

  // EMP-005 Linda (Admin) - Leave
  { id: 'ATT-005', employeeId: 'EMP-005', employeeName: 'Linda Kusuma', date: '2023-10-25', checkIn: '-', checkOut: '-', shift: 'Pagi', status: 'Leave' },
  { id: 'ATT-005b', employeeId: 'EMP-005', employeeName: 'Linda Kusuma', date: '2023-10-24', checkIn: '08:00', checkOut: '17:00', shift: 'Pagi', status: 'Present' },

  // EMP-006 Ryan (Pediatrics) - Mixed
  { id: 'ATT-006', employeeId: 'EMP-006', employeeName: 'Dr. Ryan Pratama', date: '2023-10-25', checkIn: '14:00', checkOut: '21:00', shift: 'Siang', status: 'Present' },
  { id: 'ATT-006b', employeeId: 'EMP-006', employeeName: 'Dr. Ryan Pratama', date: '2023-10-24', checkIn: '14:00', checkOut: '21:00', shift: 'Siang', status: 'Present' },
  { id: 'ATT-006c', employeeId: 'EMP-006', employeeName: 'Dr. Ryan Pratama', date: '2023-10-23', checkIn: '21:00', checkOut: '07:00', shift: 'Malam', status: 'Present' },
];

export const MOCK_PAYROLL: PayrollRecord[] = [
  { id: 'PAY-001', employeeId: 'EMP-001', employeeName: 'Sarah Wijaya', month: 'October 2023', basicSalary: 25000000, allowances: 5000000, deductions: 1000000, netSalary: 29000000, status: 'Paid' },
  { id: 'PAY-002', employeeId: 'EMP-002', employeeName: 'Budi Santoso', month: 'October 2023', basicSalary: 12000000, allowances: 2000000, deductions: 500000, netSalary: 13500000, status: 'Paid' },
  { id: 'PAY-003', employeeId: 'EMP-003', employeeName: 'Jessica Tan', month: 'October 2023', basicSalary: 15000000, allowances: 0, deductions: 200000, netSalary: 14800000, status: 'Processing' },
  { id: 'PAY-004', employeeId: 'EMP-004', employeeName: 'Ahmad Fauzi', month: 'October 2023', basicSalary: 6000000, allowances: 500000, deductions: 200000, netSalary: 6300000, status: 'Pending' },
];

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'EMPLOYEES', label: 'Karyawan', icon: 'Users' },
  { id: 'ATTENDANCE', label: 'Absensi', icon: 'Clock' },
  { id: 'PAYROLL', label: 'Gaji', icon: 'DollarSign' },
];