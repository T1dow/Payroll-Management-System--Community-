import React, { useState } from 'react';
import { Search, Plus, Edit, Shield, UserCheck, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User, Organization, UserRole } from '../App';

interface UserManagementProps {
  currentUser: User;
  organization: Organization;
}

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: UserRole;
  department: string;
  location: string;
  approvalLevel: number;
  isActive: boolean;
  lastLogin: string;
  permissions: string[];
}

const mockUsers: ManagedUser[] = [
  { id: '1', name: 'Suresh Nair', email: 'suresh.nair@techcorp.com', employeeId: 'TC-2018-0023', role: 'payroll-admin', department: 'Accounts & Finance', location: 'Bangalore', approvalLevel: 1, isActive: true, lastLogin: '2025-07-31 09:15', permissions: ['payroll.process', 'payroll.approve.level1'] },
  { id: '2', name: 'Meena Iyer', email: 'meena.iyer@techcorp.com', employeeId: 'TC-2017-0011', role: 'accounts-manager', department: 'Accounts & Finance', location: 'Mumbai', approvalLevel: 2, isActive: true, lastLogin: '2025-07-31 10:30', permissions: ['payroll.approve.level2', 'reports.view'] },
  { id: '3', name: 'Vijay Sharma', email: 'vijay.sharma@techcorp.com', employeeId: 'TC-2016-0008', role: 'agm-accounts', department: 'Accounts & Finance', location: 'Mumbai', approvalLevel: 3, isActive: true, lastLogin: '2025-07-31 08:45', permissions: ['payroll.approve.level3', 'reports.financial'] },
  { id: '4', name: 'Anita Singh', email: 'anita.singh@techcorp.com', employeeId: 'TC-2019-0067', role: 'hr-manager', department: 'Human Resources', location: 'Delhi', approvalLevel: 2, isActive: true, lastLogin: '2025-07-30 14:20', permissions: ['employees.manage', 'reports.hr'] },
  { id: '5', name: 'Priya Patel', email: 'priya.patel@techcorp.com', employeeId: 'TC-2019-0089', role: 'finance-controller', department: 'Accounts & Finance', location: 'Mumbai', approvalLevel: 3, isActive: true, lastLogin: '2025-07-29 16:00', permissions: ['compliance.manage', 'reports.financial.all'] },
  { id: '6', name: 'Ravi Kumar', email: 'ravi.kumar@techcorp.com', employeeId: 'TC-2021-0145', role: 'accounts-executive', department: 'Accounts & Finance', location: 'Chennai', approvalLevel: 1, isActive: false, lastLogin: '2025-07-15 11:30', permissions: ['payroll.view'] },
  { id: '7', name: 'Divya Menon', email: 'divya.menon@techcorp.com', employeeId: 'TC-2020-0198', role: 'hr-executive', department: 'Human Resources', location: 'Bangalore', approvalLevel: 1, isActive: true, lastLogin: '2025-07-31 09:00', permissions: ['employees.view', 'payslips.view'] },
];

const roleLabels: Record<string, string> = {
  'cfo': 'CFO',
  'gm-accounts': 'GM Accounts',
  'agm-accounts': 'AGM Accounts',
  'finance-controller': 'Finance Controller',
  'accounts-manager': 'Accounts Manager',
  'payroll-admin': 'Payroll Admin',
  'accounts-executive': 'Accounts Executive',
  'hr-head': 'HR Head',
  'hr-manager': 'HR Manager',
  'hr-executive': 'HR Executive',
  'department-head': 'Department Head',
  'manager': 'Manager',
  'supervisor': 'Supervisor',
  'employee': 'Employee',
};

const roleColors: Record<string, string> = {
  'cfo': 'bg-purple-100 text-purple-800',
  'gm-accounts': 'bg-indigo-100 text-indigo-800',
  'agm-accounts': 'bg-blue-100 text-blue-800',
  'finance-controller': 'bg-cyan-100 text-cyan-800',
  'accounts-manager': 'bg-teal-100 text-teal-800',
  'payroll-admin': 'bg-green-100 text-green-800',
  'accounts-executive': 'bg-emerald-100 text-emerald-800',
  'hr-head': 'bg-orange-100 text-orange-800',
  'hr-manager': 'bg-amber-100 text-amber-800',
  'hr-executive': 'bg-yellow-100 text-yellow-800',
  'department-head': 'bg-red-100 text-red-800',
  'manager': 'bg-pink-100 text-pink-800',
  'employee': 'bg-gray-100 text-gray-800',
};

export function UserManagement({ currentUser, organization }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', employeeId: '', role: 'employee', department: '', location: '' });

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? u.isActive : !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user: ManagedUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      employeeId: newUser.employeeId || `TC-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
      role: newUser.role as UserRole,
      department: newUser.department,
      location: newUser.location,
      approvalLevel: 1,
      isActive: true,
      lastLogin: 'Never',
      permissions: [],
    };
    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', employeeId: '', role: 'employee', department: '', location: '' });
    setShowAddDialog(false);
  };

  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-muted-foreground">Manage system users, roles, and access permissions</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Total Users', users.length, 'bg-blue-50 border-blue-200', 'text-blue-700'],
          ['Active', activeCount, 'bg-green-50 border-green-200', 'text-green-700'],
          ['Inactive', users.length - activeCount, 'bg-red-50 border-red-200', 'text-red-700'],
          ['Roles', Object.keys(roleLabels).filter(r => users.some(u => u.role === r)).length, 'bg-purple-50 border-purple-200', 'text-purple-700'],
        ].map(([label, value, bg, text]) => (
          <Card key={String(label)} className={`border ${bg}`}>
            <CardContent className="p-4">
              <p className={`text-sm ${text}`}>{label}</p>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {Object.entries(roleLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Approval Level</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground font-mono">{user.employeeId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role] || 'bg-gray-100 text-gray-800'}>
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{user.department}</TableCell>
                  <TableCell className="text-sm">{user.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Level {user.approvalLevel}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUser.name}</DialogTitle>
                <DialogDescription>{selectedUser.email} • {selectedUser.employeeId}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Role:</span> <span className="font-medium ml-1">{roleLabels[selectedUser.role]}</span></div>
                  <div><span className="text-muted-foreground">Level:</span> <span className="font-medium ml-1">{selectedUser.approvalLevel}</span></div>
                  <div><span className="text-muted-foreground">Department:</span> <span className="font-medium ml-1">{selectedUser.department}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="font-medium ml-1">{selectedUser.location}</span></div>
                  <div><span className="text-muted-foreground">Last Login:</span> <span className="font-medium ml-1">{selectedUser.lastLogin}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge className={`ml-1 ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selectedUser.isActive ? 'Active' : 'Inactive'}</Badge></div>
                </div>
                {selectedUser.permissions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.permissions.map(p => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1" onClick={() => toggleUserStatus(selectedUser.id)}>
                    {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </Button>
                  <Button variant="outline" className="flex-1">Edit Permissions</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new system user with role and access</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Full Name *</Label>
                <Input placeholder="John Doe" value={newUser.name} onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Email *</Label>
                <Input placeholder="john@company.com" value={newUser.email} onChange={(e) => setNewUser(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Employee ID</Label>
                <Input placeholder="TC-2025-XXXX" value={newUser.employeeId} onChange={(e) => setNewUser(p => ({ ...p, employeeId: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser(p => ({ ...p, role: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Department</Label>
                <Input placeholder="Accounts & Finance" value={newUser.department} onChange={(e) => setNewUser(p => ({ ...p, department: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Location</Label>
                <Select value={newUser.location} onValueChange={(v) => setNewUser(p => ({ ...p, location: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {organization.locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1" onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                Add User
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
