import React, { useState } from 'react';
import {
  Bell, ChevronDown, LogOut, User, Settings, RefreshCw,
  Building2, Shield, Zap
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { User as UserType } from '../App';
import { ROLE_CATEGORIES, ALL_CREDENTIALS } from '../data/mockUsers';

interface TopBarProps {
  currentUser: UserType;
  organization: { name: string; financialYear: { start: string; end: string } };
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  onSwitchRole: (user: UserType) => void;
  sidebarCollapsed?: boolean;
}

const NOTIFICATIONS = [
  { id: 1, text: 'TDS Challan due on Aug 7th', type: 'critical', time: '2h ago' },
  { id: 2, text: '23 payroll entries pending approval', type: 'warning', time: '4h ago' },
  { id: 3, text: 'August payroll processing started', type: 'info', time: '1d ago' },
];

const ROLE_LEVEL_COLORS: Record<number, { bg: string; text: string }> = {
  5: { bg: 'bg-purple-100', text: 'text-purple-700' },
  4: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  3: { bg: 'bg-blue-100', text: 'text-blue-700' },
  2: { bg: 'bg-teal-100', text: 'text-teal-700' },
  1: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const ROLE_LABELS: Record<string, string> = {
  'cfo': 'CFO', 'gm-accounts': 'GM Accounts', 'agm-accounts': 'AGM Accounts',
  'finance-controller': 'Finance Controller', 'accounts-manager': 'Accounts Manager',
  'payroll-admin': 'Payroll Admin', 'accounts-executive': 'Accounts Executive',
  'hr-head': 'HR Head', 'hr-manager': 'HR Manager', 'hr-executive': 'HR Executive',
  'department-head': 'Dept. Head', 'manager': 'Manager', 'supervisor': 'Supervisor',
  'employee': 'Employee',
};

export function TopBar({ currentUser, organization, onSectionChange, onLogout, onSwitchRole, sidebarCollapsed }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [unread, setUnread] = useState(NOTIFICATIONS.length);

  const levelColors = ROLE_LEVEL_COLORS[currentUser.approvalLevel] || ROLE_LEVEL_COLORS[1];
  const fyStart = organization.financialYear.start.substring(0, 4);
  const fyEnd = organization.financialYear.end.substring(2, 4);

  const handleSwitchRole = (email: string, password: string) => {
    const cred = ALL_CREDENTIALS.find(c => c.email === email);
    if (cred) {
      onSwitchRole(cred.user);
      setShowRoleSwitcher(false);
      toast.success(`Switched to ${cred.user.name}`, { description: `Role: ${ROLE_LABELS[cred.user.role]}` });
    }
  };

  return (
    <header
      className="fixed top-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center px-4 gap-4 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      {/* Breadcrumb / context */}
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-medium truncate">{organization.name}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">FY {fyStart}-{fyEnd}</span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Demo: Role switcher */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs hidden md:flex"
          onClick={() => setShowRoleSwitcher(true)}
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Switch Role
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 relative"
            onClick={() => { setShowNotifications(v => !v); setUnread(0); }}
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                {unread}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="font-medium text-sm">Notifications</p>
                <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground text-xs">Dismiss all</button>
              </div>
              <div className="divide-y divide-border">
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-muted/50 cursor-pointer ${n.type === 'critical' ? 'border-l-2 border-red-500' : n.type === 'warning' ? 'border-l-2 border-amber-500' : 'border-l-2 border-blue-500'}`}>
                    <p className="text-sm">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-border">
                <button className="text-xs text-primary w-full text-center hover:underline">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 flex items-center space-x-2 px-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-medium leading-tight">{currentUser.name.split(' ')[0]}</span>
                <span className="text-xs text-muted-foreground leading-tight">{ROLE_LABELS[currentUser.role]}</span>
              </div>
              <Badge className={`hidden md:flex text-xs ${levelColors.bg} ${levelColors.text} border-0`}>
                L{currentUser.approvalLevel}
              </Badge>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{currentUser.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{currentUser.email}</span>
                <span className="text-xs text-muted-foreground font-normal">{currentUser.employeeId} · {currentUser.location}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSectionChange('settings')}>
              <User className="h-4 w-4 mr-2" />Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSectionChange('payslips')}>
              <Shield className="h-4 w-4 mr-2" />My Payslips
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowRoleSwitcher(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />Switch Role (Demo)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role Switcher Dialog */}
      <Dialog open={showRoleSwitcher} onOpenChange={setShowRoleSwitcher}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Switch Role — Demo Mode</span>
            </DialogTitle>
            <DialogDescription>
              Instantly switch between user roles to explore different dashboards and permission levels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {ROLE_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <div className={`flex items-center space-x-2 mb-2`}>
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat.label}</h4>
                </div>
                <div className="space-y-1">
                  {cat.roles.map(role => {
                    const isCurrent = currentUser.email === role.email;
                    return (
                      <button
                        key={role.email}
                        disabled={isCurrent}
                        onClick={() => handleSwitchRole(role.email, role.password)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                          isCurrent
                            ? 'bg-primary/10 border-primary/30 cursor-not-allowed'
                            : 'border-border hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${cat.color}`}>
                            {role.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{role.name}</p>
                            <p className="text-xs text-muted-foreground">{role.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`text-xs ${ROLE_LEVEL_COLORS[role.level]?.bg || ''} ${ROLE_LEVEL_COLORS[role.level]?.text || ''} border-0`}>
                            Level {role.level}
                          </Badge>
                          {isCurrent && <Badge className="bg-primary/20 text-primary border-0 text-xs">Current</Badge>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
