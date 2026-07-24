import { User, UserRole, Department, ApprovalLevel } from '../App';

export interface Credential {
  email: string;
  password: string;
  user: User;
}

const makeUser = (
  id: string, name: string, email: string,
  role: UserRole, department: Department,
  employeeId: string, designation: string,
  approvalLevel: ApprovalLevel, location: string,
  joiningDate: string,
  permissions: string[],
  reportingTo?: string,
  costCenter?: string,
): User => ({
  id, name, email, role, department, employeeId, designation,
  approvalLevel, location, joiningDate, isActive: true, permissions,
  reportingTo, costCenter,
});

export const ALL_CREDENTIALS: Credential[] = [
  {
    email: 'arjun.mehta@techcorp.com',
    password: 'CFO@2025',
    user: makeUser(
      'usr-cfo-001', 'Arjun Mehta', 'arjun.mehta@techcorp.com',
      'cfo', 'accounts-finance',
      'TC-2015-0001', 'Chief Financial Officer',
      5, 'Mumbai', '2015-06-01',
      [
        'payroll.process.all', 'payroll.approve.level5',
        'reports.financial.all', 'budget.manage.all',
        'settings.salary.manage', 'users.manage.all',
        'compliance.manage.statutory', 'audit.access.all',
        'payroll.approve.level4', 'payroll.approve.level3',
      ],
      undefined, 'CC-FIN-000',
    ),
  },
  {
    email: 'rajesh.kumar@techcorp.com',
    password: 'GM@2025',
    user: makeUser(
      'usr-001', 'Rajesh Kumar', 'rajesh.kumar@techcorp.com',
      'gm-accounts', 'accounts-finance',
      'TC-2019-0048', 'General Manager - Accounts & Finance',
      4, 'Mumbai', '2019-03-15',
      [
        'payroll.process.all', 'payroll.approve.level4',
        'reports.financial.all', 'budget.manage.all',
        'settings.salary.manage', 'users.manage.department',
        'compliance.manage.statutory', 'audit.access.all',
      ],
      'usr-cfo-001', 'CC-FIN-001',
    ),
  },
  {
    email: 'vijay.sharma@techcorp.com',
    password: 'AGM@2025',
    user: makeUser(
      'usr-agm-001', 'Vijay Sharma', 'vijay.sharma@techcorp.com',
      'agm-accounts', 'accounts-finance',
      'TC-2016-0008', 'Assistant General Manager - Accounts',
      3, 'Mumbai', '2016-07-20',
      [
        'payroll.process.all', 'payroll.approve.level3',
        'reports.financial.all', 'budget.manage.all',
        'compliance.manage.statutory', 'audit.access.all',
      ],
      'usr-001', 'CC-FIN-001',
    ),
  },
  {
    email: 'priya.patel@techcorp.com',
    password: 'FC@2025',
    user: makeUser(
      'usr-fc-001', 'Priya Patel', 'priya.patel@techcorp.com',
      'finance-controller', 'accounts-finance',
      'TC-2019-0089', 'Finance Controller',
      3, 'Mumbai', '2019-05-10',
      [
        'payroll.process.all', 'payroll.approve.level3',
        'reports.financial.all', 'budget.manage.all',
        'compliance.manage.statutory', 'audit.access.all',
      ],
      'usr-agm-001', 'CC-FIN-001',
    ),
  },
  {
    email: 'meena.iyer@techcorp.com',
    password: 'AM@2025',
    user: makeUser(
      'usr-am-001', 'Meena Iyer', 'meena.iyer@techcorp.com',
      'accounts-manager', 'accounts-finance',
      'TC-2017-0011', 'Accounts Manager',
      2, 'Mumbai', '2017-09-12',
      [
        'payroll.process.all', 'payroll.approve.level2',
        'reports.financial.all',
      ],
      'usr-agm-001', 'CC-FIN-001',
    ),
  },
  {
    email: 'suresh.nair@techcorp.com',
    password: 'PA@2025',
    user: makeUser(
      'usr-pa-001', 'Suresh Nair', 'suresh.nair@techcorp.com',
      'payroll-admin', 'accounts-finance',
      'TC-2018-0023', 'Senior Payroll Administrator',
      1, 'Bangalore', '2018-02-28',
      [
        'payroll.process.all', 'payroll.approve.level1',
        'compliance.manage.statutory',
      ],
      'usr-am-001', 'CC-FIN-002',
    ),
  },
  {
    email: 'ravi.kumar@techcorp.com',
    password: 'AE@2025',
    user: makeUser(
      'usr-ae-001', 'Ravi Kumar', 'ravi.kumar@techcorp.com',
      'accounts-executive', 'accounts-finance',
      'TC-2021-0145', 'Accounts Executive',
      1, 'Chennai', '2021-06-15',
      ['payroll.view'],
      'usr-am-001', 'CC-FIN-003',
    ),
  },
  {
    email: 'anita.singh@techcorp.com',
    password: 'HH@2025',
    user: makeUser(
      'usr-hh-001', 'Anita Singh', 'anita.singh@techcorp.com',
      'hr-head', 'human-resources',
      'TC-2017-0034', 'Head of Human Resources',
      3, 'Mumbai', '2017-04-01',
      [
        'employees.manage', 'payroll.view',
        'reports.hr', 'users.manage.department',
      ],
      'usr-cfo-001', 'CC-HR-001',
    ),
  },
  {
    email: 'sneha.reddy@techcorp.com',
    password: 'HM@2025',
    user: makeUser(
      'usr-hm-001', 'Sneha Reddy', 'sneha.reddy@techcorp.com',
      'hr-manager', 'human-resources',
      'TC-2018-0045', 'HR Manager',
      2, 'Bangalore', '2018-08-10',
      ['employees.manage', 'payroll.view', 'reports.hr'],
      'usr-hh-001', 'CC-HR-001',
    ),
  },
  {
    email: 'divya.menon@techcorp.com',
    password: 'HE@2025',
    user: makeUser(
      'usr-he-001', 'Divya Menon', 'divya.menon@techcorp.com',
      'hr-executive', 'human-resources',
      'TC-2020-0198', 'HR Executive',
      1, 'Bangalore', '2020-11-05',
      ['employees.view', 'payslips.view'],
      'usr-hm-001', 'CC-HR-001',
    ),
  },
  {
    email: 'arun.mehta@techcorp.com',
    password: 'DH@2025',
    user: makeUser(
      'usr-dh-001', 'Arun Mehta', 'arun.mehta@techcorp.com',
      'department-head', 'information-technology',
      'TC-2016-0067', 'Head of Engineering',
      3, 'Bangalore', '2016-01-15',
      ['employees.view', 'payroll.view', 'reports.department'],
      'usr-cfo-001', 'CC-ENG-001',
    ),
  },
  {
    email: 'rohit.gupta@techcorp.com',
    password: 'MG@2025',
    user: makeUser(
      'usr-mg-001', 'Rohit Gupta', 'rohit.gupta@techcorp.com',
      'manager', 'sales-marketing',
      'TC-2019-0156', 'Sales Manager - North India',
      2, 'Delhi', '2019-07-22',
      ['employees.view', 'payroll.view.team'],
      'usr-dh-001', 'CC-SAL-001',
    ),
  },
  {
    email: 'kiran.nair@techcorp.com',
    password: 'SV@2025',
    user: makeUser(
      'usr-sv-001', 'Kiran Nair', 'kiran.nair@techcorp.com',
      'supervisor', 'operations',
      'TC-2020-0267', 'Operations Supervisor',
      1, 'Pune', '2020-03-18',
      ['employees.view.team', 'payroll.view.self'],
      'usr-mg-001', 'CC-OPS-002',
    ),
  },
  {
    email: 'amit.sharma@techcorp.com',
    password: 'EMP@2025',
    user: makeUser(
      'usr-emp-001', 'Amit Sharma', 'amit.sharma@techcorp.com',
      'employee', 'information-technology',
      'TC-2020-0156', 'Senior Software Engineer',
      1, 'Mumbai', '2020-08-03',
      ['payroll.view.self', 'profile.edit.self'],
      'usr-dh-001', 'CC-ENG-001',
    ),
  },
];

export function authenticate(email: string, password: string): User | null {
  const match = ALL_CREDENTIALS.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
  );
  return match?.user ?? null;
}

export const ROLE_CATEGORIES = [
  {
    label: 'Finance & Accounts',
    color: 'bg-indigo-500',
    roles: [
      { role: 'cfo', label: 'Chief Financial Officer', email: 'arjun.mehta@techcorp.com', password: 'CFO@2025', name: 'Arjun Mehta', level: 5 },
      { role: 'gm-accounts', label: 'GM - Accounts & Finance', email: 'rajesh.kumar@techcorp.com', password: 'GM@2025', name: 'Rajesh Kumar', level: 4 },
      { role: 'agm-accounts', label: 'AGM - Accounts', email: 'vijay.sharma@techcorp.com', password: 'AGM@2025', name: 'Vijay Sharma', level: 3 },
      { role: 'finance-controller', label: 'Finance Controller', email: 'priya.patel@techcorp.com', password: 'FC@2025', name: 'Priya Patel', level: 3 },
      { role: 'accounts-manager', label: 'Accounts Manager', email: 'meena.iyer@techcorp.com', password: 'AM@2025', name: 'Meena Iyer', level: 2 },
      { role: 'payroll-admin', label: 'Payroll Administrator', email: 'suresh.nair@techcorp.com', password: 'PA@2025', name: 'Suresh Nair', level: 1 },
      { role: 'accounts-executive', label: 'Accounts Executive', email: 'ravi.kumar@techcorp.com', password: 'AE@2025', name: 'Ravi Kumar', level: 1 },
    ],
  },
  {
    label: 'Human Resources',
    color: 'bg-emerald-500',
    roles: [
      { role: 'hr-head', label: 'HR Head', email: 'anita.singh@techcorp.com', password: 'HH@2025', name: 'Anita Singh', level: 3 },
      { role: 'hr-manager', label: 'HR Manager', email: 'sneha.reddy@techcorp.com', password: 'HM@2025', name: 'Sneha Reddy', level: 2 },
      { role: 'hr-executive', label: 'HR Executive', email: 'divya.menon@techcorp.com', password: 'HE@2025', name: 'Divya Menon', level: 1 },
    ],
  },
  {
    label: 'Operations & Management',
    color: 'bg-amber-500',
    roles: [
      { role: 'department-head', label: 'Department Head', email: 'arun.mehta@techcorp.com', password: 'DH@2025', name: 'Arun Mehta', level: 3 },
      { role: 'manager', label: 'Manager', email: 'rohit.gupta@techcorp.com', password: 'MG@2025', name: 'Rohit Gupta', level: 2 },
      { role: 'supervisor', label: 'Supervisor', email: 'kiran.nair@techcorp.com', password: 'SV@2025', name: 'Kiran Nair', level: 1 },
    ],
  },
  {
    label: 'Employee',
    color: 'bg-sky-500',
    roles: [
      { role: 'employee', label: 'Employee', email: 'amit.sharma@techcorp.com', password: 'EMP@2025', name: 'Amit Sharma', level: 1 },
    ],
  },
];
