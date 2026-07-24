import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, User, Mail, Phone, MapPin,
  Briefcase, Calendar, Edit, Trash2, Eye, Save, AlertTriangle, Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { User as UserType } from '../App';
import { downloadCSV } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';

interface EmployeeDirectoryProps {
  currentUser: UserType;
  organization?: { locations: string[] };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employeeId: string;
  joiningDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  location: string;
  manager: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    phone: '+91 98765 43210',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    employeeId: 'EMP001',
    joiningDate: '2022-03-15',
    salary: 95000,
    status: 'active',
    location: 'Bangalore',
    manager: 'Sarah Wilson'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+91 98765 43211',
    department: 'Marketing',
    designation: 'Marketing Manager',
    employeeId: 'EMP002',
    joiningDate: '2021-11-22',
    salary: 78000,
    status: 'active',
    location: 'Mumbai',
    manager: 'David Brown'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@company.com',
    phone: '+91 98765 43212',
    department: 'Sales',
    designation: 'Sales Executive',
    employeeId: 'EMP003',
    joiningDate: '2023-01-10',
    salary: 68000,
    status: 'on-leave',
    location: 'Delhi',
    manager: 'Lisa Anderson'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    phone: '+91 98765 43213',
    department: 'HR',
    designation: 'HR Business Partner',
    employeeId: 'EMP004',
    joiningDate: '2020-08-05',
    salary: 82000,
    status: 'active',
    location: 'Bangalore',
    manager: 'Robert Chen'
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@company.com',
    phone: '+91 98765 43214',
    department: 'Engineering',
    designation: 'Product Manager',
    employeeId: 'EMP005',
    joiningDate: '2022-09-12',
    salary: 110000,
    status: 'active',
    location: 'Hyderabad',
    manager: 'Sarah Wilson'
  }
];

export function EmployeeDirectory({ currentUser, organization }: EmployeeDirectoryProps) {
  const { fmtFull } = useCurrency();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '', email: '', phone: '', department: '', designation: '', location: '', manager: '', salary: ''
  });

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSaveEdit = () => {
    if (!editingEmployee) return;
    setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? editingEmployee : e));
    toast.success(`${editingEmployee.name}'s profile updated`);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDeleteConfirmId(null);
    if (emp) toast.success(`${emp.name} removed from directory`);
  };

  const handleExport = () => {
    const rows = filteredEmployees.map(e => ({
      'Employee ID': e.employeeId,
      Name: e.name,
      Email: e.email,
      Phone: e.phone,
      Department: e.department,
      Designation: e.designation,
      Location: e.location,
      Manager: e.manager,
      'Joining Date': e.joiningDate,
      Salary: e.salary,
      Status: e.status,
    }));
    downloadCSV(rows, `Employee_Directory_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success(`${rows.length} employees exported as CSV`);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) return;
    const emp: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone || '+91 00000 00000',
      department: newEmployee.department,
      designation: newEmployee.designation,
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      joiningDate: new Date().toISOString().split('T')[0],
      salary: parseInt(newEmployee.salary) || 0,
      status: 'active',
      location: newEmployee.location,
      manager: newEmployee.manager,
    };
    setEmployees(prev => [...prev, emp]);
    setNewEmployee({ name: '', email: '', phone: '', department: '', designation: '', location: '', manager: '', salary: '' });
    setShowAddDialog(false);
  };

  const canEditEmployee = () => {
    return ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'payroll-admin', 'hr-head', 'hr-manager', 'hr-executive'].includes(currentUser.role);
  };

  const canViewSalary = () => {
    return ['cfo', 'gm-accounts', 'agm-accounts', 'finance-controller', 'accounts-manager', 'payroll-admin', 'hr-head', 'hr-manager'].includes(currentUser.role);
  };

  const renderEmployeeCard = (employee: Employee) => (
    <Card key={employee.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.designation}</p>
              <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Employee actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canEditEmployee() && (
                <>
                  <DropdownMenuItem onClick={() => setEditingEmployee({ ...employee })}>
                    <Edit className="h-4 w-4 mr-2" />Edit Employee
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirmId(employee.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />Delete Employee
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-3 w-3 mr-2" />
            {employee.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="h-3 w-3 mr-2" />
            {employee.department}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-2" />
            {employee.location}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          {getStatusBadge(employee.status)}
          {canViewSalary() && (
            <span className="text-sm font-medium">{fmtFull(employee.salary)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employee Directory</h1>
          <p className="text-muted-foreground">Manage and view employee information</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />Export
          </Button>
          {canEditEmployee() && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              >
                <Filter className="h-4 w-4 mr-2" />
                {viewMode === 'table' ? 'Card View' : 'Table View'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
      </div>

      {/* Employee List */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  {canViewSalary() && <TableHead>Salary</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    {canViewSalary() && (
                      <TableCell>{fmtFull(employee.salary)}</TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label="Employee actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canEditEmployee() && (
                            <>
                              <DropdownMenuItem onClick={() => setEditingEmployee({ ...employee })}>
                                <Edit className="h-4 w-4 mr-2" />Edit Employee
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirmId(employee.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />Delete Employee
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(renderEmployeeCard)}
        </div>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter employee details to add them to the directory</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Full Name *</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. Ravi Shankar" value={newEmployee.name} onChange={(e) => setNewEmployee(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Email *</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="ravi@techcorp.com" value={newEmployee.email} onChange={(e) => setNewEmployee(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Phone</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="+91 98765 43210" value={newEmployee.phone} onChange={(e) => setNewEmployee(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Department</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Engineering" value={newEmployee.department} onChange={(e) => setNewEmployee(p => ({ ...p, department: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Designation</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Software Engineer" value={newEmployee.designation} onChange={(e) => setNewEmployee(p => ({ ...p, designation: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Location</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={newEmployee.location} onChange={(e) => setNewEmployee(p => ({ ...p, location: e.target.value }))}>
                <option value="">Select location</option>
                {(organization?.locations || ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad']).map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Reporting Manager</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Manager Name" value={newEmployee.manager} onChange={(e) => setNewEmployee(p => ({ ...p, manager: e.target.value }))} />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-sm font-medium">Monthly Salary (₹)</label>
              <input className="w-full border rounded px-3 py-2 text-sm" type="number" placeholder="75000" value={newEmployee.salary} onChange={(e) => setNewEmployee(p => ({ ...p, salary: e.target.value }))} />
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium" onClick={handleAddEmployee} disabled={!newEmployee.name || !newEmployee.email}>
              Add Employee
            </button>
            <button className="flex-1 border rounded px-4 py-2 text-sm font-medium" onClick={() => setShowAddDialog(false)}>
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={open => !open && setEditingEmployee(null)}>
        <DialogContent className="max-w-xl">
          {editingEmployee && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Employee — {editingEmployee.name}</DialogTitle>
                <DialogDescription>{editingEmployee.employeeId}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ['name', 'Full Name', 'text'],
                  ['email', 'Email', 'email'],
                  ['phone', 'Phone', 'text'],
                  ['designation', 'Designation', 'text'],
                  ['department', 'Department', 'text'],
                  ['manager', 'Reporting Manager', 'text'],
                  ['salary', 'Monthly Salary (₹)', 'number'],
                ] as [keyof Employee, string, string][]).map(([field, label, type]) => (
                  <div key={field} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Input
                      type={type}
                      value={String(editingEmployee[field] ?? '')}
                      onChange={e => setEditingEmployee(prev => prev ? { ...prev, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value } : prev)}
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={editingEmployee.status}
                    onChange={e => setEditingEmployee(prev => prev ? { ...prev, status: e.target.value as Employee['status'] } : prev)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Location</Label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={editingEmployee.location}
                    onChange={e => setEditingEmployee(prev => prev ? { ...prev, location: e.target.value } : prev)}
                  >
                    {(organization?.locations || ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad']).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />Save Changes
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setEditingEmployee(null)}>Cancel</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={open => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Delete Employee</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{employees.find(e => e.id === deleteConfirmId)?.name}</strong> from the directory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2 pt-2">
            <Button variant="destructive" className="flex-1" onClick={() => deleteConfirmId && handleDeleteEmployee(deleteConfirmId)}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogDescription>
                  Complete information for {selectedEmployee.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.designation}</p>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.employeeId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEmployee.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEmployee.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEmployee.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Employment Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedEmployee.department}
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        Joined {selectedEmployee.joiningDate}
                      </div>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Reports to {selectedEmployee.manager}
                      </div>
                      {canViewSalary() && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Salary: </span>
                          <span className="font-medium">{fmtFull(selectedEmployee.salary)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">Status: </span>
                    {getStatusBadge(selectedEmployee.status)}
                  </div>
                  
                  {canEditEmployee() && selectedEmployee && (
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingEmployee({ ...selectedEmployee }); setSelectedEmployee(null); }}>
                        <Edit className="h-4 w-4 mr-2" />Edit Employee
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}