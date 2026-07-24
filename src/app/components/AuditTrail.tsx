import React, { useState } from 'react';
import { Search, Download, Filter, User, Settings, FileText, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '../utils/download';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { User as UserType, Organization } from '../App';
import { useCurrency } from '../context/CurrencyContext';

interface AuditTrailProps {
  currentUser: UserType;
  organization: Organization;
}

type ActionCategory = 'payroll' | 'employee' | 'settings' | 'compliance' | 'auth' | 'approval';
type ActionSeverity = 'info' | 'warning' | 'critical';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  category: ActionCategory;
  action: string;
  details: string;
  ipAddress: string;
  severity: ActionSeverity;
  location: string;
  recordId?: string;
}

const mockAuditEntries: AuditEntry[] = [
  { id: 'AUD-001', timestamp: '2025-07-31 14:23:11', user: 'Rajesh Kumar', role: 'GM Accounts', category: 'approval', action: 'Approved Payroll Run', details: 'Approved July 2025 payroll run for 2847 employees. Total: ₹4.48Cr', ipAddress: '10.0.1.45', severity: 'info', location: 'Mumbai', recordId: 'APR-2025-0047' },
  { id: 'AUD-002', timestamp: '2025-07-31 11:05:32', user: 'Vijay Sharma', role: 'AGM Accounts', category: 'approval', action: 'Approved Payroll Run', details: 'Level 3 approval completed for July 2025 payroll', ipAddress: '10.0.1.67', severity: 'info', location: 'Mumbai', recordId: 'APR-2025-0047' },
  { id: 'AUD-003', timestamp: '2025-07-30 16:44:22', user: 'Meena Iyer', role: 'Accounts Manager', category: 'payroll', action: 'Payroll Calculation', details: 'Computed payroll for 2847 employees including all deductions', ipAddress: '10.0.1.89', severity: 'info', location: 'Mumbai' },
  { id: 'AUD-004', timestamp: '2025-07-30 09:12:05', user: 'Suresh Nair', role: 'Payroll Admin', category: 'employee', action: 'Employee Record Modified', details: 'Updated bank account details for TC-2023-1456', ipAddress: '10.0.2.12', severity: 'warning', location: 'Bangalore', recordId: 'TC-2023-1456' },
  { id: 'AUD-005', timestamp: '2025-07-29 15:30:18', user: 'Priya Patel', role: 'Finance Manager', category: 'compliance', action: 'ESI Filing Submitted', details: 'Submitted ESI monthly return for June 2025. Amount: ₹87,200', ipAddress: '10.0.1.34', severity: 'info', location: 'Mumbai' },
  { id: 'AUD-006', timestamp: '2025-07-29 10:22:45', user: 'Anita Singh', role: 'HR Manager', category: 'employee', action: 'New Employee Added', details: 'Added employee TC-2025-0892 in Engineering department', ipAddress: '10.0.3.22', severity: 'info', location: 'Bangalore', recordId: 'TC-2025-0892' },
  { id: 'AUD-007', timestamp: '2025-07-28 17:55:33', user: 'System', role: 'System', category: 'payroll', action: 'Payroll Run Initiated', details: 'Automated July 2025 payroll initiation for 2847 employees', ipAddress: '10.0.0.1', severity: 'info', location: 'System' },
  { id: 'AUD-008', timestamp: '2025-07-27 13:10:07', user: 'Rajesh Kumar', role: 'GM Accounts', category: 'settings', action: 'Salary Structure Modified', details: 'Updated HRA component from 40% to 40% of basic (no change - reviewed)', ipAddress: '10.0.1.45', severity: 'warning', location: 'Mumbai' },
  { id: 'AUD-009', timestamp: '2025-07-26 08:45:29', user: 'Suresh Nair', role: 'Payroll Admin', category: 'auth', action: 'Login', details: 'Successful login from corporate network', ipAddress: '10.0.2.12', severity: 'info', location: 'Bangalore' },
  { id: 'AUD-010', timestamp: '2025-07-25 22:14:56', user: 'Unknown', role: 'Unknown', category: 'auth', action: 'Failed Login Attempt', details: 'Multiple failed login attempts detected for payroll-admin account', ipAddress: '203.45.78.12', severity: 'critical', location: 'External' },
  { id: 'AUD-011', timestamp: '2025-07-25 14:30:00', user: 'Vijay Sharma', role: 'AGM Accounts', category: 'compliance', action: 'TDS Challan Generated', details: 'Generated TDS challan for Q1 FY2026. Amount: ₹2,34,500', ipAddress: '10.0.1.67', severity: 'info', location: 'Mumbai' },
  { id: 'AUD-012', timestamp: '2025-07-24 11:20:15', user: 'Meena Iyer', role: 'Accounts Manager', category: 'approval', action: 'Salary Revision Approved', details: 'Approved annual increment for Delhi office employees. Effective Aug 2025', ipAddress: '10.0.1.89', severity: 'info', location: 'Mumbai', recordId: 'APR-2025-0045' },
];

export function AuditTrail({ currentUser, organization }: AuditTrailProps) {
  const { fmt, fmtFull, sym } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const uniqueUsers = Array.from(new Set(mockAuditEntries.map(e => e.user)));

  const handleExport = () => {
    const rows = filtered.map(e => ({
      'Timestamp': e.timestamp,
      'User': e.user,
      'Role': e.role,
      'Category': e.category,
      'Action': e.action,
      'Details': e.details,
      'Location': e.location,
      'IP Address': e.ipAddress,
      'Severity': e.severity,
    }));
    downloadCSV(rows, `Audit_Trail_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success(`Audit log exported`, { description: `${rows.length} entries downloaded as CSV` });
  };

  const filtered = mockAuditEntries.filter(entry => {
    const matchSearch = !searchTerm ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || entry.category === filterCategory;
    const matchSeverity = filterSeverity === 'all' || entry.severity === filterSeverity;
    const matchUser = filterUser === 'all' || entry.user === filterUser;
    return matchSearch && matchCategory && matchSeverity && matchUser;
  });

  const categoryIcon = (category: ActionCategory) => {
    const icons: Record<ActionCategory, React.ReactNode> = {
      payroll: <FileText className="h-4 w-4 text-blue-500" />,
      employee: <User className="h-4 w-4 text-purple-500" />,
      settings: <Settings className="h-4 w-4 text-gray-500" />,
      compliance: <Shield className="h-4 w-4 text-green-500" />,
      auth: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      approval: <FileText className="h-4 w-4 text-indigo-500" />,
    };
    return icons[category];
  };

  const categoryBadge = (category: ActionCategory) => {
    const map: Record<ActionCategory, string> = {
      payroll: 'bg-blue-100 text-blue-800',
      employee: 'bg-purple-100 text-purple-800',
      settings: 'bg-gray-100 text-gray-800',
      compliance: 'bg-green-100 text-green-800',
      auth: 'bg-orange-100 text-orange-800',
      approval: 'bg-indigo-100 text-indigo-800',
    };
    return <Badge className={map[category]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>;
  };

  const severityBadge = (severity: ActionSeverity) => {
    const map: Record<ActionSeverity, string> = {
      info: 'bg-gray-100 text-gray-700',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
    };
    return <Badge className={map[severity]}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Audit Trail</h1>
          <p className="text-muted-foreground">Complete system activity log for compliance and security monitoring</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Audit Log
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Total Entries', mockAuditEntries.length.toString(), 'bg-blue-50 border-blue-200', 'text-blue-700'],
          ['Critical', mockAuditEntries.filter(e => e.severity === 'critical').length.toString(), 'bg-red-50 border-red-200', 'text-red-700'],
          ['Warnings', mockAuditEntries.filter(e => e.severity === 'warning').length.toString(), 'bg-yellow-50 border-yellow-200', 'text-yellow-700'],
          ['Users Active', uniqueUsers.length.toString(), 'bg-green-50 border-green-200', 'text-green-700'],
        ].map(([label, value, bg, text]) => (
          <Card key={label} className={`border ${bg}`}>
            <CardContent className="p-4">
              <p className={`text-sm ${text}`}>{label}</p>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions, users, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Showing {filtered.length} of {mockAuditEntries.length} entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={entry.id} className={entry.severity === 'critical' ? 'bg-red-50' : entry.severity === 'warning' ? 'bg-yellow-50' : ''}>
                  <TableCell className="font-mono text-xs whitespace-nowrap">{entry.timestamp}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{entry.user}</p>
                      <p className="text-xs text-muted-foreground">{entry.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>{categoryBadge(entry.category)}</TableCell>
                  <TableCell className="font-medium text-sm">{entry.action}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate" title={entry.details}>{entry.details}</p>
                  </TableCell>
                  <TableCell className="text-sm">{entry.location}</TableCell>
                  <TableCell className="font-mono text-xs">{entry.ipAddress}</TableCell>
                  <TableCell>{severityBadge(entry.severity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
