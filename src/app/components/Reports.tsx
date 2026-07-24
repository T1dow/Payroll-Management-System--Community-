import React, { useState } from 'react';
import {
  BarChart3, Download, Calendar, FileText, PieChart,
  TrendingUp, Users, IndianRupee, Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { User } from '../App';
import { downloadCSV } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';

interface ReportsProps {
  currentUser: User;
  organization?: unknown;
}

const departmentData = [
  { name: 'Engineering', employees: 450, totalCost: 4500000, avgSalary: 100000 },
  { name: 'Sales', employees: 234, totalCost: 1872000, avgSalary: 80000 },
  { name: 'Marketing', employees: 156, totalCost: 1404000, avgSalary: 90000 },
  { name: 'HR', employees: 89, totalCost: 712000, avgSalary: 80000 },
  { name: 'Finance', employees: 67, totalCost: 603000, avgSalary: 90000 },
];

const monthlyTrends = [
  { month: 'Jan', payroll: 2400000, deductions: 480000 },
  { month: 'Feb', payroll: 2450000, deductions: 490000 },
  { month: 'Mar', payroll: 2480000, deductions: 496000 },
  { month: 'Apr', payroll: 2520000, deductions: 504000 },
  { month: 'May', payroll: 2560000, deductions: 512000 },
  { month: 'Jun', payroll: 2580000, deductions: 516000 },
  { month: 'Jul', payroll: 2600000, deductions: 520000 },
];

const complianceData = [
  { type: 'ESI', label: 'ESI Compliance', score: 98.5, color: 'text-green-600', reportKey: 'esi' },
  { type: 'PF', label: 'PF Compliance', score: 100, color: 'text-green-600', reportKey: 'pf' },
  { type: 'TDS', label: 'TDS Compliance', score: 96.2, color: 'text-yellow-600', reportKey: 'tds' },
];

const reportTemplates = [
  { id: '1', name: 'Monthly Payroll Summary', description: 'Complete payroll breakdown by department and employee', type: 'Payroll', lastGenerated: '2025-08-01', frequency: 'Monthly', key: 'monthly-summary' },
  { id: '2', name: 'Deduction Audit Report', description: 'ESI, PF, and TDS deduction analysis', type: 'Compliance', lastGenerated: '2025-07-31', frequency: 'Monthly', key: 'deduction-audit' },
  { id: '3', name: 'Employee Cost Analysis', description: 'Cost per employee and department analysis', type: 'Analytics', lastGenerated: '2025-08-01', frequency: 'Quarterly', key: 'cost-analysis' },
  { id: '4', name: 'Statutory Compliance Report', description: 'ESI, PF, TDS compliance status', type: 'Compliance', lastGenerated: '2025-07-30', frequency: 'Monthly', key: 'statutory' },
];

// Pre-built CSV data for each report
const reportDataSets: Record<string, Record<string, unknown>[]> = {
  'monthly-summary': monthlyTrends.map(m => ({ Month: m.month + ' 2025', 'Payroll (₹)': m.payroll, 'Deductions (₹)': m.deductions, 'Net (₹)': m.payroll - m.deductions })),
  'deduction-audit': [
    { 'Department': 'Engineering', 'ESI (₹)': 952, 'PF (₹)': 9600, 'TDS (₹)': 15240, 'PT (₹)': 200, 'Total (₹)': 25992 },
    { 'Department': 'Finance', 'ESI (₹)': 0, 'PF (₹)': 11400, 'TDS (₹)': 22950, 'PT (₹)': 200, 'Total (₹)': 34550 },
  ],
  'cost-analysis': departmentData.map(d => ({ Department: d.name, Employees: d.employees, 'Total Cost (₹)': d.totalCost, 'Avg Salary (₹)': d.avgSalary })),
  'statutory': complianceData.map(c => ({ Type: c.type, 'Compliance Rate': `${c.score}%`, Status: c.score >= 98 ? 'Excellent' : 'Good' })),
  'dept-analysis': departmentData.map(d => ({ Department: d.name, Employees: d.employees, 'Total Cost (₹)': d.totalCost, 'Avg Salary (₹)': d.avgSalary })),
  'employee-details': [
    { 'Employee ID': 'TC-2020-0156', Name: 'Amit Sharma', Dept: 'Engineering', Gross: 127000, Net: 101008 },
    { 'Employee ID': 'TC-2019-0089', Name: 'Priya Patel', Dept: 'Finance', Gross: 153000, Net: 118450 },
  ],
  'esi-report': [{ Type: 'ESI', Month: 'July 2025', 'Eligible Employees': 234, 'Total Contribution (₹)': 89500, 'Compliance Rate': '98.5%' }],
  'pf-report': [{ Type: 'PF', Month: 'July 2025', 'Eligible Employees': 1247, 'Total Contribution (₹)': 1567800, 'Compliance Rate': '100%' }],
  'tds-report': [{ Type: 'TDS', Month: 'July 2025', 'Eligible Employees': 567, 'Total Deduction (₹)': 234500, 'Compliance Rate': '96.2%' }],
  'all-data': [...monthlyTrends.map(m => ({ Category: 'Trend', Month: m.month, Payroll: m.payroll, Deductions: m.deductions })), ...departmentData.map(d => ({ Category: 'Department', Month: 'Jul', Payroll: d.totalCost, Deductions: 0 }))],
};

const getReportTypeColor = (type: string) => {
  const map: Record<string, string> = { Payroll: 'bg-blue-100 text-blue-800', Compliance: 'bg-green-100 text-green-800', Analytics: 'bg-purple-100 text-purple-800' };
  return map[type] || 'bg-gray-100 text-gray-800';
};

export function Reports({ currentUser }: ReportsProps) {
  const { fmt, fmtFull } = useCurrency();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const totalPayroll = monthlyTrends[monthlyTrends.length - 1].payroll;
  const totalDeductions = monthlyTrends[monthlyTrends.length - 1].deductions;
  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employees, 0);
  const avgSalary = Math.round(totalPayroll / totalEmployees);

  const handleGenerateReport = async (key: string, name: string, filename: string) => {
    setGeneratingId(key);
    await new Promise(r => setTimeout(r, 900));
    const rows = reportDataSets[key];
    if (rows) {
      downloadCSV(rows, `${filename}_${new Date().toLocaleDateString('en-CA')}.csv`);
      toast.success(`${name} downloaded`, { description: `${rows.length} records exported` });
    } else {
      toast.error('No data available for this report');
    }
    setGeneratingId(null);
  };

  const handleExportAll = () => {
    const rows = reportDataSets['all-data'];
    downloadCSV(rows, `Full_Analytics_Export_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success('Full data export downloaded');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate payroll reports and analyze trends</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleGenerateReport('all-data', 'Custom Report', 'Custom_Report')}>
            <FileText className="h-4 w-4 mr-2" />Custom Report
          </Button>
          <Button onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />Export All Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Select Period" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentData.map(dept => (
                    <SelectItem key={dept.name.toLowerCase()} value={dept.name.toLowerCase()}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Payroll', value: fmt(totalPayroll), sub: '+5.2% from last month', sub_color: 'text-green-600', Icon: IndianRupee },
              { label: 'Total Employees', value: totalEmployees, sub: '+12 from last month', sub_color: 'text-green-600', Icon: Users },
              { label: 'Avg Salary', value: fmtFull(avgSalary), sub: 'Market competitive', sub_color: 'text-blue-600', Icon: TrendingUp },
              { label: 'Deductions', value: fmt(totalDeductions), sub: '20% of payroll', sub_color: 'text-muted-foreground', Icon: PieChart },
            ].map(({ label, value, sub, sub_color, Icon }) => (
              <Card key={label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className={`text-xs ${sub_color}`}>{sub}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department-wise Breakdown</CardTitle>
                  <CardDescription>Cost analysis by department</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleGenerateReport('dept-analysis', 'Department Analysis', 'Department_Analysis')}>
                  <Download className="h-4 w-4 mr-2" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Avg Salary</TableHead>
                    <TableHead>% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentData
                    .filter(d => selectedDepartment === 'all' || d.name.toLowerCase() === selectedDepartment)
                    .map(dept => {
                      const percentage = (dept.totalCost / totalPayroll) * 100;
                      return (
                        <TableRow key={dept.name}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell>{dept.employees}</TableCell>
                          <TableCell>{fmt(dept.totalCost)}</TableCell>
                          <TableCell>{fmtFull(dept.avgSalary)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-16" />
                              <span className="text-sm">{percentage.toFixed(1)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Payroll Trends</CardTitle>
                  <CardDescription>Payroll and deductions over time</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleGenerateReport('monthly-summary', 'Monthly Summary', 'Monthly_Summary')}>
                  <Download className="h-4 w-4 mr-2" />Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrends.slice(-6).map(month => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="font-medium">{month.month} 2025</div>
                    <div className="flex items-center space-x-6">
                      <div className="text-sm"><span className="text-muted-foreground">Payroll: </span><span className="font-medium">{fmt(month.payroll)}</span></div>
                      <div className="text-sm"><span className="text-muted-foreground">Deductions: </span><span className="font-medium">{fmt(month.deductions)}</span></div>
                      <div className="w-24"><Progress value={(month.deductions / month.payroll) * 100} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>Generate and download detailed payroll reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'monthly-summary', icon: FileText, color: 'text-blue-600', title: 'Monthly Summary', desc: 'Complete payroll summary', filename: 'Monthly_Payroll_Summary' },
                  { key: 'dept-analysis', icon: BarChart3, color: 'text-green-600', title: 'Department Analysis', desc: 'Cost by department', filename: 'Department_Analysis' },
                  { key: 'employee-details', icon: Users, color: 'text-purple-600', title: 'Employee Details', desc: 'Individual employee data', filename: 'Employee_Details' },
                ].map(({ key, icon: Icon, color, title, desc, filename }) => (
                  <Card key={key} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Icon className={`h-8 w-8 ${color}`} />
                        <div>
                          <h3 className="font-medium">{title}</h3>
                          <p className="text-sm text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                      <Button
                        className="w-full" size="sm"
                        disabled={generatingId === key}
                        onClick={() => handleGenerateReport(key, title, filename)}
                      >
                        {generatingId === key ? <><div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-2" />Generating…</> : 'Generate & Download'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Statutory compliance reports — download as CSV for filing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complianceData.map(c => (
                  <Card key={c.type}>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium">{c.label}</h3>
                      <div className={`text-2xl font-bold my-2 ${c.color}`}>{c.score}%</div>
                      <Button
                        size="sm" variant="outline" className="w-full"
                        disabled={generatingId === `${c.reportKey}-report`}
                        onClick={() => handleGenerateReport(`${c.reportKey}-report`, `${c.type} Report`, `${c.type}_Compliance_Report`)}
                      >
                        {generatingId === `${c.reportKey}-report` ? 'Generating…' : `Generate ${c.type} Report`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Export</CardTitle>
              <CardDescription>Download comprehensive data sets for external analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'monthly-summary', title: 'Monthly Trend Data', desc: 'All months payroll & deduction data' },
                  { key: 'cost-analysis', title: 'Cost Analysis Data', desc: 'Per-employee and department cost breakdown' },
                  { key: 'deduction-audit', title: 'Deduction Audit Data', desc: 'Full statutory deduction breakdown' },
                  { key: 'statutory', title: 'Compliance Data', desc: 'Statutory compliance rates by type' },
                ].map(({ key, title, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{title}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                    <Button
                      size="sm" variant="outline"
                      disabled={generatingId === key}
                      onClick={() => handleGenerateReport(key, title, title.replace(/\s+/g, '_'))}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {generatingId === key ? '…' : 'CSV'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Pre-configured report templates for quick generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportTemplates.map(template => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getReportTypeColor(template.type)}>{template.type}</Badge>
                      <span className="text-xs text-muted-foreground">Last generated: {template.lastGenerated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={() => handleGenerateReport(template.key, template.name, template.name.replace(/\s+/g, '_'))}
                  >
                    <Download className="h-4 w-4 mr-2" />Download
                  </Button>
                  <Button
                    size="sm"
                    disabled={generatingId === template.key}
                    onClick={() => handleGenerateReport(template.key, template.name, template.name.replace(/\s+/g, '_'))}
                  >
                    {generatingId === template.key ? 'Generating…' : 'Generate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
