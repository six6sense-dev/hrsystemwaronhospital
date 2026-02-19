export enum Department {
  CARDIOLOGY = 'Cardiology',
  NEUROLOGY = 'Neurology',
  PEDIATRICS = 'Pediatrics',
  EMERGENCY = 'Emergency',
  ADMINISTRATION = 'Administration',
  NURSING = 'Nursing',
  LABORATORY = 'Laboratory'
}

export enum EmploymentStatus {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  CONTRACT = 'Contract',
  ON_LEAVE = 'On Leave'
}

export type Role = 'ADMIN' | 'STAFF' | 'HR_MANAGER';
export type ShiftType = 'Pagi' | 'Siang' | 'Malam' | 'Middle' | 'Off';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: Role;
  avatarUrl: string;
  employeeId?: string; // Links the user account to a specific employee record
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string; // Changed from Department enum to string to allow dynamic additions
  status: EmploymentStatus;
  joinDate: string;
  avatarUrl: string;
  skills: string[];
  bio?: string;
  performanceRating?: number; // 1-5
  recentAchievements?: string[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  shift: ShiftType;
  status: 'Present' | 'Late' | 'Absent' | 'Leave';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending' | 'Processing';
}

export type ViewState = 'DASHBOARD' | 'EMPLOYEES' | 'PROFILE' | 'ATTENDANCE' | 'PAYROLL' | 'ACCOUNT';

export interface AIResponse {
  content: string;
  error?: string;
}