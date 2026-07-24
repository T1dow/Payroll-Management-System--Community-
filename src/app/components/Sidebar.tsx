import React, { useState } from 'react';
import {
  LayoutDashboard, Calculator, Users, Minus, FileText, BarChart3,
  Settings as SettingsIcon, ChevronLeft, ChevronRight, Building2,
  Banknote, GitBranch, Shield, FileSearch, TrendingUp, CreditCard,
  UserCheck, Globe, LogOut, AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { UserRole, User, Organization } from '../App';

interface SidebarProps {
  currentUser: User;
  organization: Organization;
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onLogout?: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  category: 'core' | 'finance' | 'admin' | 'compliance';
  requiredPermissions?: string[];
}

const navigationItems: NavigationItem[] = [
  // Core Modules
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'accounts-executive', 'hr-head', 'hr-manager', 'hr-executive', 'department-head', 'manager', 'supervisor', 'employee'],
    category: 'core'
  },
  {
    id: 'payroll-processing',
    label: 'Payroll Processing',
    icon: Calculator,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager'],
    category: 'core',
    requiredPermissions: ['payroll.process.all']
  },
  {
    id: 'employees',
    label: 'Employee Directory',
    icon: Users,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager', 'hr-executive', 'department-head', 'manager'],
    category: 'core'
  },
  {
    id: 'deductions',
    label: 'Deductions & Benefits',
    icon: Minus,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager'],
    category: 'core'
  },

  // Finance Modules
  {
    id: 'budget-management',
    label: 'Budget Management',
    icon: TrendingUp,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller'],
    category: 'finance',
    requiredPermissions: ['budget.manage.all']
  },
  {
    id: 'cost-center',
    label: 'Cost Center Analysis',
    icon: CreditCard,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager'],
    category: 'finance'
  },
  {
    id: 'payslips',
    label: 'Payslip Management',
    icon: FileText,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager', 'hr-executive', 'department-head', 'manager', 'supervisor', 'employee'],
    category: 'finance'
  },
  {
    id: 'financial-reports',
    label: 'Financial Reports',
    icon: Banknote,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager'],
    category: 'finance',
    requiredPermissions: ['reports.financial.all']
  },

  // Administrative Modules
  {
    id: 'approval-workflows',
    label: 'Approval Workflows',
    icon: GitBranch,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'hr-head', 'department-head'],
    category: 'admin'
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: UserCheck,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'hr-head'],
    category: 'admin',
    requiredPermissions: ['users.manage.department']
  },
  {
    id: 'reports',
    label: 'Analytics & Reports',
    icon: BarChart3,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager', 'department-head', 'manager'],
    category: 'admin'
  },

  // Compliance Modules
  {
    id: 'compliance',
    label: 'Compliance Management',
    icon: Shield,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head'],
    category: 'compliance',
    requiredPermissions: ['compliance.manage.statutory']
  },
  {
    id: 'audit-trail',
    label: 'Audit Trail',
    icon: FileSearch,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller'],
    category: 'compliance',
    requiredPermissions: ['audit.access.all']
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: SettingsIcon,
    roles: ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'payroll-admin'],
    category: 'admin'
  }
];

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case 'cfo':
      return 'bg-purple-100 text-purple-800';
    case 'gm-accounts':
      return 'bg-indigo-100 text-indigo-800';
    case 'agm-accounts':
      return 'bg-blue-100 text-blue-800';
    case 'finance-controller':
      return 'bg-cyan-100 text-cyan-800';
    case 'accounts-manager':
      return 'bg-teal-100 text-teal-800';
    case 'payroll-admin':
      return 'bg-green-100 text-green-800';
    case 'accounts-executive':
      return 'bg-emerald-100 text-emerald-800';
    case 'hr-head':
      return 'bg-orange-100 text-orange-800';
    case 'hr-manager':
      return 'bg-amber-100 text-amber-800';
    case 'hr-executive':
      return 'bg-yellow-100 text-yellow-800';
    case 'department-head':
      return 'bg-red-100 text-red-800';
    case 'manager':
      return 'bg-pink-100 text-pink-800';
    case 'supervisor':
      return 'bg-rose-100 text-rose-800';
    case 'employee':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case 'cfo':
      return 'Chief Financial Officer';
    case 'gm-accounts':
      return 'GM - Accounts';
    case 'agm-accounts':
      return 'AGM - Accounts';
    case 'finance-controller':
      return 'Finance Controller';
    case 'accounts-manager':
      return 'Accounts Manager';
    case 'payroll-admin':
      return 'Payroll Admin';
    case 'accounts-executive':
      return 'Accounts Executive';
    case 'hr-head':
      return 'HR Head';
    case 'hr-manager':
      return 'HR Manager';
    case 'hr-executive':
      return 'HR Executive';
    case 'department-head':
      return 'Department Head';
    case 'manager':
      return 'Manager';
    case 'supervisor':
      return 'Supervisor';
    case 'employee':
      return 'Employee';
    default:
      return 'Employee';
  }
};

const getDepartmentLabel = (department: string) => {
  switch (department) {
    case 'accounts-finance':
      return 'Accounts & Finance';
    case 'human-resources':
      return 'Human Resources';
    case 'operations':
      return 'Operations';
    case 'information-technology':
      return 'Information Technology';
    case 'administration':
      return 'Administration';
    case 'production':
      return 'Production';
    case 'sales-marketing':
      return 'Sales & Marketing';
    case 'quality-assurance':
      return 'Quality Assurance';
    case 'legal-compliance':
      return 'Legal & Compliance';
    case 'procurement':
      return 'Procurement';
    default:
      return department;
  }
};

export function Sidebar({
  currentUser,
  organization,
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  onLogout,
}: SidebarProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions) return true;
    return requiredPermissions.some(permission => currentUser.permissions.includes(permission));
  };

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(currentUser.role) && hasPermission(item.requiredPermissions)
  );

  const itemsByCategory = allowedItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allowedItems>);

  const renderNavigationSection = (category: string, title: string, items: typeof allowedItems) => (
    <div key={category} className="space-y-2">
      {!collapsed && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
            onClick={() => onSectionChange(item.id)}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
          >
            <Icon className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        );
      })}
      {!collapsed && items.length > 0 && <Separator className="my-2" />}
    </div>
  );

  return (
    <div className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-semibold">PayrollPro</h1>
                <p className="text-xs text-muted-foreground">Enterprise HRMS</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className="h-8 w-8 p-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium truncate">{organization.name}</p>
              <p className="text-xs text-muted-foreground">{organization.locations.length} Locations • {organization.employeeCount.toLocaleString()} Employees</p>
            </div>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.employeeId}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}
                >
                  {getRoleLabel(currentUser.role)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {getDepartmentLabel(currentUser.department)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {itemsByCategory.core && renderNavigationSection('core', 'Core Modules', itemsByCategory.core)}
          {itemsByCategory.finance && renderNavigationSection('finance', 'Finance & Accounting', itemsByCategory.finance)}
          {itemsByCategory.admin && renderNavigationSection('admin', 'Administration', itemsByCategory.admin)}
          {itemsByCategory.compliance && renderNavigationSection('compliance', 'Compliance & Audit', itemsByCategory.compliance)}
        </div>
      </nav>

      {/* Footer */}
      <div className={`border-t border-border ${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed && (
          <div className="text-xs text-muted-foreground mb-3">
            <p>FY {organization.financialYear.start.substring(0, 4)}-{organization.financialYear.end.substring(2, 4)}</p>
            <p>Level {currentUser.approvalLevel} Access</p>
          </div>
        )}
        {onLogout && (
          <Button
            variant="ghost"
            className={`w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${
              collapsed ? 'px-2 justify-center' : 'justify-start px-3'
            }`}
            onClick={() => setShowLogoutDialog(true)}
            title={collapsed ? 'Sign Out' : undefined}
            aria-label="Sign Out"
          >
            <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </Button>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Sign Out</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 mb-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => { setShowLogoutDialog(false); onLogout?.(); }}
            >
              <LogOut className="h-4 w-4 mr-2" />Sign Out
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}