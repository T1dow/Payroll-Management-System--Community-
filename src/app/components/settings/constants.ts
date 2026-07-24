import { UserRole } from '../../App';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdDate: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  formula: string;
  status: 'active' | 'inactive';
}

export const SYSTEM_USERS: SystemUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'payroll-admin',
    department: 'HR',
    status: 'active',
    lastLogin: '2025-08-01 10:30',
    createdDate: '2024-06-15'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'super-admin',
    department: 'IT',
    status: 'active',
    lastLogin: '2025-08-01 09:15',
    createdDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'hr',
    department: 'HR',
    status: 'active',
    lastLogin: '2025-07-31 16:45',
    createdDate: '2024-08-10'
  }
];

export const SALARY_COMPONENTS: SalaryComponent[] = [
  { id: '1', name: 'Basic Salary', type: 'earning', formula: 'Fixed Amount', status: 'active' },
  { id: '2', name: 'HRA', type: 'earning', formula: '40% of Basic', status: 'active' },
  { id: '3', name: 'Transport Allowance', type: 'earning', formula: 'Fixed Amount', status: 'active' },
  { id: '4', name: 'Medical Allowance', type: 'earning', formula: 'Fixed Amount', status: 'active' },
  { id: '5', name: 'ESI', type: 'deduction', formula: '0.75% of Gross', status: 'active' },
  { id: '6', name: 'PF', type: 'deduction', formula: '12% of Basic', status: 'active' }
];

export const ROLE_LABELS: Record<UserRole, string> = {
  'super-admin': 'Super Admin',
  'payroll-admin': 'Payroll Admin',
  'hr': 'HR',
  'manager': 'Manager',
  'employee': 'Employee'
};