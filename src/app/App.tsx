import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PersonalDashboard } from './components/PersonalDashboard';
import { PayrollProcessing } from './components/PayrollProcessing';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { DeductionsManagement } from './components/DeductionsManagement';
import { PayslipGeneration } from './components/PayslipGeneration';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { BudgetManagement } from './components/BudgetManagement';
import { ApprovalWorkflows } from './components/ApprovalWorkflows';
import { ComplianceManagement } from './components/ComplianceManagement';
import { AuditTrail } from './components/AuditTrail';
import { CostCenterAnalysis } from './components/CostCenterAnalysis';
import { FinancialReports } from './components/FinancialReports';
import { UserManagement } from './components/UserManagement';
import { LoginPage } from './components/LoginPage';
import { TopBar } from './components/TopBar';
import { Toaster } from './components/ui/sonner';
import { CurrencyProvider } from './context/CurrencyContext';

export type UserRole =
  | 'cfo'
  | 'gm-accounts'
  | 'agm-accounts'
  | 'finance-controller'
  | 'accounts-manager'
  | 'payroll-admin'
  | 'accounts-executive'
  | 'hr-head'
  | 'hr-manager'
  | 'hr-executive'
  | 'department-head'
  | 'manager'
  | 'supervisor'
  | 'employee';

export type Department =
  | 'accounts-finance'
  | 'human-resources'
  | 'operations'
  | 'information-technology'
  | 'administration'
  | 'production'
  | 'sales-marketing'
  | 'quality-assurance'
  | 'legal-compliance'
  | 'procurement';

export type ApprovalLevel = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  employeeId: string;
  designation: string;
  reportingTo?: string;
  approvalLevel: ApprovalLevel;
  costCenter?: string;
  location: string;
  joiningDate: string;
  isActive: boolean;
  permissions: string[];
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  locations: string[];
  financialYear: { start: string; end: string };
  currency: string;
  timezone: string;
}

const ORGANIZATION: Organization = {
  id: 'org-001',
  name: 'TechCorp Industries Ltd.',
  industry: 'Technology & Manufacturing',
  employeeCount: 2847,
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad'],
  financialYear: { start: '2025-04-01', end: '2026-03-31' },
  currency: 'INR',
  timezone: 'Asia/Kolkata',
};

/** Roles that use the personal/team dashboard instead of the executive one */
const PERSONAL_DASHBOARD_ROLES: UserRole[] = [
  'accounts-executive', 'hr-executive', 'department-head',
  'manager', 'supervisor', 'employee',
];

/** Default section per role after login */
function defaultSectionForRole(role: UserRole): string {
  if (role === 'employee') return 'payslips';
  return 'dashboard';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('payrollpro_user');
      if (saved) {
        const user: User = JSON.parse(saved);
        setCurrentUser(user);
        setActiveSection(defaultSectionForRole(user.role));
      }
    } catch {
      localStorage.removeItem('payrollpro_user');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveSection(defaultSectionForRole(user.role));
    try { localStorage.setItem('payrollpro_user', JSON.stringify(user)); } catch {}
  };

  const handleSwitchRole = (user: User) => {
    setCurrentUser(user);
    setActiveSection(defaultSectionForRole(user.role));
    try { localStorage.setItem('payrollpro_user', JSON.stringify(user)); } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('dashboard');
    try { localStorage.removeItem('payrollpro_user'); } catch {}
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentUser) {
    return (
      <CurrencyProvider>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </CurrencyProvider>
    );
  }

  const usePersonalDashboard = PERSONAL_DASHBOARD_ROLES.includes(currentUser.role);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return usePersonalDashboard
          ? <PersonalDashboard currentUser={currentUser} organization={ORGANIZATION} onSectionChange={handleSectionChange} />
          : <Dashboard currentUser={currentUser} organization={ORGANIZATION} onSectionChange={handleSectionChange} />;
      case 'payroll-processing':
        return <PayrollProcessing currentUser={currentUser} organization={ORGANIZATION} />;
      case 'employees':
        return <EmployeeDirectory currentUser={currentUser} organization={ORGANIZATION} />;
      case 'deductions':
        return <DeductionsManagement currentUser={currentUser} organization={ORGANIZATION} />;
      case 'payslips':
        return <PayslipGeneration currentUser={currentUser} organization={ORGANIZATION} />;
      case 'reports':
        return <Reports currentUser={currentUser} organization={ORGANIZATION} />;
      case 'settings':
        return <Settings currentUser={currentUser} organization={ORGANIZATION} />;
      case 'budget-management':
        return <BudgetManagement currentUser={currentUser} organization={ORGANIZATION} />;
      case 'approval-workflows':
        return <ApprovalWorkflows currentUser={currentUser} organization={ORGANIZATION} />;
      case 'compliance':
        return <ComplianceManagement currentUser={currentUser} organization={ORGANIZATION} />;
      case 'audit-trail':
        return <AuditTrail currentUser={currentUser} organization={ORGANIZATION} />;
      case 'cost-center':
        return <CostCenterAnalysis currentUser={currentUser} organization={ORGANIZATION} />;
      case 'financial-reports':
        return <FinancialReports currentUser={currentUser} organization={ORGANIZATION} />;
      case 'user-management':
        return <UserManagement currentUser={currentUser} organization={ORGANIZATION} />;
      default:
        return usePersonalDashboard
          ? <PersonalDashboard currentUser={currentUser} organization={ORGANIZATION} onSectionChange={handleSectionChange} />
          : <Dashboard currentUser={currentUser} organization={ORGANIZATION} onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <CurrencyProvider initialCode={ORGANIZATION.currency}>
    <div className="min-h-screen bg-background">
      <TopBar
        currentUser={currentUser}
        organization={ORGANIZATION}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        sidebarCollapsed={sidebarCollapsed}
      />
      <div className="flex pt-14">
        <Sidebar
          currentUser={currentUser}
          organization={ORGANIZATION}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          onLogout={handleLogout}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <div className="min-h-screen">
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
    </CurrencyProvider>
  );
}
