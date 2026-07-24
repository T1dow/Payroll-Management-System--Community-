import React, { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Users, 
  Calculator, 
  FileCheck, 
  Send,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Download,
  Clock,
  User,
  Building2,
  CreditCard,
  TrendingUp,
  Shield,
  Eye,
  DollarSign,
  PieChart,
  Activity,
  Globe,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User as UserType, Organization } from '../App';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';
import { downloadCSV } from '../utils/download';

interface PayrollProcessingProps {
  currentUser: UserType;
  organization: Organization;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  location: string;
  costCenter: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  esi: number;
  pf: number;
  tds: number;
  professionalTax: number;
  loanDeduction: number;
  otherDeductions: number;
  netSalary: number;
  selected: boolean;
  approvalLevel: number;
  bankAccount: string;
  panNumber: string;
}

const steps = [
  { id: 1, title: 'Selection & Validation', description: 'Select employees and validate eligibility' },
  { id: 2, title: 'Calculation & Review', description: 'Process calculations and review amounts' },
  { id: 3, title: 'Approval Workflow', description: 'Multi-level approval process' },
  { id: 4, title: 'Processing & Distribution', description: 'Final processing and payslip generation' }
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    employeeId: 'TC-2020-0156',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    location: 'Mumbai',
    costCenter: 'CC-ENG-001',
    basicSalary: 80000,
    hra: 32000,
    allowances: 15000,
    grossSalary: 127000,
    esi: 952,
    pf: 9600,
    tds: 15240,
    professionalTax: 200,
    loanDeduction: 5000,
    otherDeductions: 0,
    netSalary: 96008,
    selected: true,
    approvalLevel: 2,
    bankAccount: 'HDFC-****1234',
    panNumber: 'ABCDE1234F'
  },
  {
    id: '2',
    name: 'Priya Patel',
    employeeId: 'TC-2019-0089',
    department: 'Accounts & Finance',
    designation: 'Finance Manager',
    location: 'Mumbai',
    costCenter: 'CC-FIN-001',
    basicSalary: 95000,
    hra: 38000,
    allowances: 20000,
    grossSalary: 153000,
    esi: 1148,
    pf: 11400,
    tds: 22950,
    professionalTax: 200,
    loanDeduction: 0,
    otherDeductions: 1000,
    netSalary: 116302,
    selected: true,
    approvalLevel: 3,
    bankAccount: 'ICICI-****5678',
    panNumber: 'FGHIJ5678K'
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    employeeId: 'TC-2021-0234',
    department: 'Sales & Marketing',
    designation: 'Area Sales Manager',
    location: 'Delhi',
    costCenter: 'CC-SAL-002',
    basicSalary: 75000,
    hra: 30000,
    allowances: 18000,
    grossSalary: 123000,
    esi: 922,
    pf: 9000,
    tds: 14760,
    professionalTax: 200,
    loanDeduction: 3000,
    otherDeductions: 500,
    netSalary: 94618,
    selected: false,
    approvalLevel: 2,
    bankAccount: 'SBI-****9012',
    panNumber: 'KLMNO9012P'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    employeeId: 'TC-2018-0045',
    department: 'Human Resources',
    designation: 'HR Manager',
    location: 'Bangalore',
    costCenter: 'CC-HR-001',
    basicSalary: 85000,
    hra: 34000,
    allowances: 16000,
    grossSalary: 135000,
    esi: 1012,
    pf: 10200,
    tds: 18900,
    professionalTax: 200,
    loanDeduction: 0,
    otherDeductions: 0,
    netSalary: 104688,
    selected: true,
    approvalLevel: 3,
    bankAccount: 'AXIS-****3456',
    panNumber: 'QRSTU3456V'
  }
];

export function PayrollProcessing({ currentUser, organization }: PayrollProcessingProps) {
  const { fmt, fmtFull } = useCurrency();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const [currentStep, setCurrentStep] = useState(1);
  const [employees, setEmployees] = useState(mockEmployees);
  const [processing, setProcessing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCostCenter, setSelectedCostCenter] = useState('all');

  const selectedEmployees = employees.filter(emp => emp.selected);
  const totalGross = selectedEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0);
  const totalNet = selectedEmployees.reduce((sum, emp) => sum + emp.netSalary, 0);
  const totalDeductions = totalGross - totalNet;
  
  // Financial breakdown
  const financialSummary = {
    totalEmployees: selectedEmployees.length,
    totalBasicSalary: selectedEmployees.reduce((sum, emp) => sum + emp.basicSalary, 0),
    totalHRA: selectedEmployees.reduce((sum, emp) => sum + emp.hra, 0),
    totalAllowances: selectedEmployees.reduce((sum, emp) => sum + emp.allowances, 0),
    totalESI: selectedEmployees.reduce((sum, emp) => sum + emp.esi, 0),
    totalPF: selectedEmployees.reduce((sum, emp) => sum + emp.pf, 0),
    totalTDS: selectedEmployees.reduce((sum, emp) => sum + emp.tds, 0),
    totalProfessionalTax: selectedEmployees.reduce((sum, emp) => sum + emp.professionalTax, 0),
    totalLoanDeductions: selectedEmployees.reduce((sum, emp) => sum + emp.loanDeduction, 0),
    totalOtherDeductions: selectedEmployees.reduce((sum, emp) => sum + emp.otherDeductions, 0)
  };

  // Location-wise breakdown
  const locationBreakdown = organization.locations.map(location => {
    const locationEmployees = selectedEmployees.filter(emp => emp.location === location);
    return {
      location,
      count: locationEmployees.length,
      gross: locationEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0),
      net: locationEmployees.reduce((sum, emp) => sum + emp.netSalary, 0)
    };
  }).filter(item => item.count > 0);

  // Department-wise breakdown
  const departmentBreakdown = [
    'Engineering', 'Accounts & Finance', 'Sales & Marketing', 'Human Resources', 
    'Operations', 'Administration', 'Quality Assurance', 'IT'
  ].map(department => {
    const deptEmployees = selectedEmployees.filter(emp => emp.department === department);
    return {
      department,
      count: deptEmployees.length,
      gross: deptEmployees.reduce((sum, emp) => sum + emp.grossSalary, 0),
      net: deptEmployees.reduce((sum, emp) => sum + emp.netSalary, 0)
    };
  }).filter(item => item.count > 0);

  const handleEmployeeToggle = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId ? { ...emp, selected: !emp.selected } : emp
    ));
  };

  const handleSelectAll = () => {
    const filteredEmployees = employees.filter(emp => {
      const locationMatch = selectedLocation === 'all' || emp.location === selectedLocation;
      const deptMatch = selectedDepartment === 'all' || emp.department === selectedDepartment;
      const costCenterMatch = selectedCostCenter === 'all' || emp.costCenter === selectedCostCenter;
      return locationMatch && deptMatch && costCenterMatch;
    });
    
    const allSelected = filteredEmployees.every(emp => emp.selected);
    setEmployees(employees.map(emp => {
      const shouldToggle = filteredEmployees.some(filtered => filtered.id === emp.id);
      return shouldToggle ? { ...emp, selected: !allSelected } : emp;
    }));
  };

  const processPayroll = async () => {
    setProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    setCurrentStep(currentStep + 1);
  };

  const getApprovalWorkflow = () => {
    const workflow = [];
    if (totalGross > 10000000) { // > 1 Crore
      workflow.push({ level: 5, role: 'CFO', required: true });
    }
    if (totalGross > 5000000) { // > 50 Lakhs
      workflow.push({ level: 4, role: 'GM Accounts', required: true });
    }
    if (totalGross > 1000000) { // > 10 Lakhs
      workflow.push({ level: 3, role: 'AGM Accounts', required: true });
    }
    workflow.push({ level: 2, role: 'Accounts Manager', required: true });
    workflow.push({ level: 1, role: 'Payroll Admin', required: true });
    
    return workflow.reverse();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Select employees for payroll processing. Use filters to refine selection by location, department, or cost center.
              </AlertDescription>
            </Alert>

            {/* Advanced Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selection Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {organization.locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="font-medium mb-2 block">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Accounts & Finance">Accounts & Finance</SelectItem>
                        <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-medium mb-2 block">Cost Center</label>
                    <Select value={selectedCostCenter} onValueChange={setSelectedCostCenter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cost Centers</SelectItem>
                        <SelectItem value="CC-ENG-001">CC-ENG-001</SelectItem>
                        <SelectItem value="CC-FIN-001">CC-FIN-001</SelectItem>
                        <SelectItem value="CC-SAL-002">CC-SAL-002</SelectItem>
                        <SelectItem value="CC-HR-001">CC-HR-001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" onClick={handleSelectAll} className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Toggle All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Employee Selection</h3>
                <p className="text-muted-foreground">
                  {selectedEmployees.length} of {employees.length} employees selected
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Total: {fmtFull(totalNet)}</p>
                <p className="text-muted-foreground">Net Payable Amount</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <span className="sr-only">Select</span>
                      </TableHead>
                      <TableHead>Employee Details</TableHead>
                      <TableHead>Location & Cost Center</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Approval Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Checkbox
                            checked={employee.selected}
                            onCheckedChange={() => handleEmployeeToggle(employee.id)}
                            aria-label={`Select ${employee.name} for payroll processing`}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-muted-foreground">{employee.employeeId}</p>
                            <p className="text-muted-foreground">{employee.designation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{employee.location}</p>
                            <p className="text-muted-foreground">{employee.department}</p>
                            <p className="text-muted-foreground">{employee.costCenter}</p>
                          </div>
                        </TableCell>
                        <TableCell>{fmtFull(employee.grossSalary)}</TableCell>
                        <TableCell className="font-medium">{fmtFull(employee.netSalary)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {employee.approvalLevel}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                Review detailed salary calculations including all components, statutory deductions, and compliance requirements.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Financial Summary</TabsTrigger>
                <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
                <TabsTrigger value="locations">Location Analysis</TabsTrigger>
                <TabsTrigger value="departments">Department Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600">Gross Payroll</p>
                          <p className="font-bold text-green-700">{fmt(totalGross)}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-600">Total Deductions</p>
                          <p className="font-bold text-red-700">{fmt(totalDeductions)}</p>
                        </div>
                        <Minus className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600">Net Payable</p>
                          <p className="font-bold text-blue-700">{fmt(totalNet)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600">Employees</p>
                          <p className="font-bold text-purple-700">{selectedEmployees.length}</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Component Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-green-700 mb-3">Earnings</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Basic Salary</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalBasicSalary)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>House Rent Allowance</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalHRA)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Other Allowances</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalAllowances)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span>Total Gross</span>
                            <span>{fmtFull(totalGross)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-red-700 mb-3">Deductions</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>ESI (0.75%)</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalESI)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PF (12%)</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalPF)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TDS</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalTDS)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Professional Tax</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalProfessionalTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Loan Deductions</span>
                            <span className="font-medium">{fmtFull(financialSummary.totalLoanDeductions)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span>Total Deductions</span>
                            <span>{fmtFull(totalDeductions)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee-wise Calculation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Basic</TableHead>
                          <TableHead>HRA</TableHead>
                          <TableHead>Allowances</TableHead>
                          <TableHead>Gross</TableHead>
                          <TableHead>ESI</TableHead>
                          <TableHead>PF</TableHead>
                          <TableHead>TDS</TableHead>
                          <TableHead>Net</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-muted-foreground">{employee.employeeId}</p>
                              </div>
                            </TableCell>
                            <TableCell>{fmtFull(employee.basicSalary)}</TableCell>
                            <TableCell>{fmtFull(employee.hra)}</TableCell>
                            <TableCell>{fmtFull(employee.allowances)}</TableCell>
                            <TableCell className="font-medium">{fmtFull(employee.grossSalary)}</TableCell>
                            <TableCell>{fmtFull(employee.esi)}</TableCell>
                            <TableCell>{fmtFull(employee.pf)}</TableCell>
                            <TableCell>{fmtFull(employee.tds)}</TableCell>
                            <TableCell className="font-bold">{fmtFull(employee.netSalary)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="locations">
                <Card>
                  <CardHeader>
                    <CardTitle>Location-wise Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {locationBreakdown.map((location) => (
                        <Card key={location.location}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{location.location}</h4>
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>Employees:</span>
                                <span className="font-medium">{location.count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Gross:</span>
                                <span className="font-medium">{fmt(location.gross)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Net:</span>
                                <span className="font-medium">{fmt(location.net)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="departments">
                <Card>
                  <CardHeader>
                    <CardTitle>Department-wise Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentBreakdown.map((dept) => (
                        <div key={dept.department} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{dept.department}</h4>
                            <Badge variant="outline">{dept.count} employees</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Gross Amount:</span>
                              <p className="font-bold">{fmt(dept.gross)}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Net Amount:</span>
                              <p className="font-bold">{fmt(dept.net)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Alert>
              <FileCheck className="h-4 w-4" />
              <AlertDescription>
                Multi-level approval workflow based on amount thresholds and organizational hierarchy. Current user approval level: {currentUser.approvalLevel}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Workflow</CardTitle>
                  <CardDescription>Required approvals for this payroll run</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getApprovalWorkflow().map((approval, index) => (
                      <div key={approval.level} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            approval.level <= currentUser.approvalLevel 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {approval.level <= currentUser.approvalLevel ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{approval.role}</p>
                            <p className="text-muted-foreground">Level {approval.level} Approval</p>
                          </div>
                        </div>
                        <Badge variant={approval.level <= currentUser.approvalLevel ? "default" : "secondary"}>
                          {approval.level <= currentUser.approvalLevel ? "Can Approve" : "Required"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Final Review Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Total Employees</p>
                      <p className="font-bold">{selectedEmployees.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-bold">{fmt(totalNet)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Gross Payroll:</span>
                      <span className="font-medium">{fmtFull(totalGross)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span className="font-medium">{fmtFull(totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Net Payable:</span>
                      <span className="text-green-600">{fmtFull(totalNet)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Compliance Checklist</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Minimum wage compliance verified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>ESI & PF calculations validated</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>TDS computations reviewed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Bank account validation complete</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Cost center allocation verified</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {processing && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p>Processing payroll approval...</p>
                    <Progress value={75} className="max-w-md mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payroll processing completed successfully! All employees have been processed and payslips are ready for distribution.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="font-bold text-green-600">{selectedEmployees.length}</p>
                      <p className="text-green-700">Successfully Processed</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="font-bold text-red-600">0</p>
                      <p className="text-red-700">Failed Processing</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount Processed:</span>
                      <span className="font-bold">{fmtFull(totalNet)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bank Transfer Initiated:</span>
                      <span className="font-medium text-green-600">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statutory Compliances:</span>
                      <span className="font-medium text-green-600">Updated</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span className="font-medium">3.2 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => {
                    downloadCSV(selectedEmployees.map(e => ({
                      'Employee ID': e.employeeId, Name: e.name, Department: e.department,
                      Location: e.location, 'Gross (₹)': e.grossSalary, 'Net (₹)': e.netSalary,
                      'ESI (₹)': e.esi, 'PF (₹)': e.pf, 'TDS (₹)': e.tds,
                      'Bank Account': e.bankAccount, 'PAN': e.panNumber,
                    })), `Payroll_Register_${new Date().toLocaleDateString('en-CA')}.csv`);
                    toast.success('Payroll register downloaded');
                  }}>
                    <Download className="h-4 w-4 mr-2" />Download Payroll Register
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Payslips emailed to all employees', { description: `${selectedEmployees.length} payslips sent successfully` })}>
                    <Send className="h-4 w-4 mr-2" />Email All Payslips
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    downloadCSV([{ 'Period': `${new Date().toLocaleDateString('en-CA')}`, 'Total Employees': selectedEmployees.length, 'Gross (₹)': totalGross, 'Deductions (₹)': totalDeductions, 'Net (₹)': totalNet }], 'MIS_Report.csv');
                    toast.success('MIS report downloaded');
                  }}>
                    <FileCheck className="h-4 w-4 mr-2" />Generate MIS Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('General ledger updated', { description: 'Journal entries posted for this payroll run' })}>
                    <Activity className="h-4 w-4 mr-2" />Update General Ledger
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success('Statutory returns initiated', { description: 'ESI, PF, and TDS challans queued for filing' })}>
                    <Shield className="h-4 w-4 mr-2" />File Statutory Returns
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const ccData = locationBreakdown.map(l => ({ Location: l.location, Employees: l.count, 'Gross (₹)': l.gross, 'Net (₹)': l.net }));
                    downloadCSV(ccData, 'Cost_Center_Analysis.csv');
                    toast.success('Cost center analysis downloaded');
                  }}>
                    <PieChart className="h-4 w-4 mr-2" />Cost Center Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Location-wise Processing Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Location-wise Processing Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {locationBreakdown.map((location) => (
                    <div key={location.location} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{location.location}</h4>
                        <Badge variant="outline">{location.count} emp</Badge>
                      </div>
                      <p className="font-bold">{fmt(location.net)}</p>
                      <p className="text-muted-foreground">Net Amount</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold mb-2">Advanced Payroll Processing</h1>
            <p className="text-muted-foreground">{organization.name} • {currentMonth}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              <Building2 className="h-3 w-3 mr-1" />
              {currentUser.designation}
            </Badge>
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              Level {currentUser.approvalLevel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : currentStep === step.id
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-6 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{steps[currentStep - 1]?.title}</span>
            {currentStep === 3 && (
              <Badge variant="secondary">
                Approval Required: Level {Math.max(...getApprovalWorkflow().map(a => a.level))}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
          {selectedEmployees.length > 0 && (
            <Badge variant="outline">
              {fmt(totalNet)} Net Payable
            </Badge>
          )}
        </div>

        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && selectedEmployees.length === 0}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : currentStep === 3 ? (
          <Button onClick={processPayroll} disabled={processing}>
            {processing ? 'Processing...' : 'Approve & Process'}
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => setCurrentStep(1)}>
            Start New Payroll
            <Calculator className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}