import React, { useState } from 'react';
import { Download, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { User, Organization } from '../App';
import { downloadCSV } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';

interface FinancialReportsProps {
  currentUser: User;
  organization: Organization;
}

// ── Report data generators ────────────────────────────────────────

const departmentCosts = [
  { Department: 'Engineering', Employees: 1205, 'Budget (₹)': 19500000, 'Actual (₹)': 18900000, 'Variance (₹)': 600000 },
  { Department: 'Sales & Marketing', Employees: 387, 'Budget (₹)': 8100000, 'Actual (₹)': 8450000, 'Variance (₹)': -350000 },
  { Department: 'Operations', Employees: 524, 'Budget (₹)': 6400000, 'Actual (₹)': 6200000, 'Variance (₹)': 200000 },
  { Department: 'Accounts & Finance', Employees: 89, 'Budget (₹)': 2200000, 'Actual (₹)': 2100000, 'Variance (₹)': 100000 },
  { Department: 'Human Resources', Employees: 45, 'Budget (₹)': 1300000, 'Actual (₹)': 1200000, 'Variance (₹)': 100000 },
  { Department: 'Administration', Employees: 156, 'Budget (₹)': 2000000, 'Actual (₹)': 1890000, 'Variance (₹)': 110000 },
  { Department: 'Quality Assurance', Employees: 234, 'Budget (₹)': 2900000, 'Actual (₹)': 2800000, 'Variance (₹)': 100000 },
  { Department: 'Legal & Compliance', Employees: 23, 'Budget (₹)': 950000, 'Actual (₹)': 890000, 'Variance (₹)': 60000 },
  { Department: 'IT', Employees: 167, 'Budget (₹)': 3200000, 'Actual (₹)': 3100000, 'Variance (₹)': 100000 },
  { Department: 'Procurement', Employees: 17, 'Budget (₹)': 600000, 'Actual (₹)': 567000, 'Variance (₹)': 33000 },
];

const locationSummary = [
  { Location: 'Mumbai', Employees: 847, 'Budget (₹)': 15600000, 'Actual (₹)': 15234000 },
  { Location: 'Delhi', Employees: 623, 'Budget (₹)': 11500000, 'Actual (₹)': 11892000 },
  { Location: 'Bangalore', Employees: 745, 'Budget (₹)': 13800000, 'Actual (₹)': 13456000 },
  { Location: 'Chennai', Employees: 412, 'Budget (₹)': 7600000, 'Actual (₹)': 7234000 },
  { Location: 'Pune', Employees: 156, 'Budget (₹)': 2900000, 'Actual (₹)': 2845000 },
  { Location: 'Hyderabad', Employees: 64, 'Budget (₹)': 1200000, 'Actual (₹)': 1187000 },
];

const bankTransferData = [
  { 'Employee ID': 'TC-2020-0156', 'Employee Name': 'Amit Sharma', 'Bank': 'HDFC Bank', 'Account': '****1234', 'IFSC': 'HDFC0001234', 'Amount (₹)': 101008 },
  { 'Employee ID': 'TC-2019-0089', 'Employee Name': 'Priya Patel', 'Bank': 'ICICI Bank', 'Account': '****5678', 'IFSC': 'ICIC0005678', 'Amount (₹)': 118450 },
  { 'Employee ID': 'TC-2021-0234', 'Employee Name': 'Rahul Kumar', 'Bank': 'SBI', 'Account': '****9012', 'IFSC': 'SBIN0009012', 'Amount (₹)': 98118 },
  { 'Employee ID': 'TC-2018-0045', 'Employee Name': 'Sneha Reddy', 'Bank': 'Axis Bank', 'Account': '****3456', 'IFSC': 'UTIB0003456', 'Amount (₹)': 105700 },
];

const payrollRegisterData = [
  { 'Employee ID': 'TC-2020-0156', 'Name': 'Amit Sharma', 'Department': 'Engineering', 'Basic (₹)': 80000, 'HRA (₹)': 32000, 'Allowances (₹)': 15000, 'Gross (₹)': 127000, 'ESI (₹)': 952, 'PF (₹)': 9600, 'TDS (₹)': 15240, 'PT (₹)': 200, 'Net (₹)': 101008 },
  { 'Employee ID': 'TC-2019-0089', 'Name': 'Priya Patel', 'Department': 'Finance', 'Basic (₹)': 95000, 'HRA (₹)': 38000, 'Allowances (₹)': 20000, 'Gross (₹)': 153000, 'ESI (₹)': 0, 'PF (₹)': 11400, 'TDS (₹)': 22950, 'PT (₹)': 200, 'Net (₹)': 118450 },
  { 'Employee ID': 'TC-2021-0234', 'Name': 'Rahul Kumar', 'Department': 'Sales', 'Basic (₹)': 75000, 'HRA (₹)': 30000, 'Allowances (₹)': 18000, 'Gross (₹)': 123000, 'ESI (₹)': 922, 'PF (₹)': 9000, 'TDS (₹)': 14760, 'PT (₹)': 200, 'Net (₹)': 98118 },
  { 'Employee ID': 'TC-2018-0045', 'Name': 'Sneha Reddy', 'Department': 'HR', 'Basic (₹)': 85000, 'HRA (₹)': 34000, 'Allowances (₹)': 16000, 'Gross (₹)': 135000, 'ESI (₹)': 0, 'PF (₹)': 10200, 'TDS (₹)': 18900, 'PT (₹)': 200, 'Net (₹)': 105700 },
];

const statutoryData = [
  { 'Type': 'ESI', 'Employee ID': 'TC-2020-0156', 'Name': 'Amit Sharma', 'Gross (₹)': 127000, 'Employee Contribution (₹)': 952, 'Employer Contribution (₹)': 1270, 'Total (₹)': 2222 },
  { 'Type': 'PF', 'Employee ID': 'TC-2020-0156', 'Name': 'Amit Sharma', 'Gross (₹)': 127000, 'Employee Contribution (₹)': 9600, 'Employer Contribution (₹)': 9600, 'Total (₹)': 19200 },
  { 'Type': 'ESI', 'Employee ID': 'TC-2021-0234', 'Name': 'Rahul Kumar', 'Gross (₹)': 123000, 'Employee Contribution (₹)': 922, 'Employer Contribution (₹)': 1230, 'Total (₹)': 2152 },
  { 'Type': 'PF', 'Employee ID': 'TC-2021-0234', 'Name': 'Rahul Kumar', 'Gross (₹)': 123000, 'Employee Contribution (₹)': 9000, 'Employer Contribution (₹)': 9000, 'Total (₹)': 18000 },
];

const headcountData = [
  { Department: 'Engineering', 'Opening Headcount': 1198, 'Joiners': 12, 'Leavers': 5, 'Closing Headcount': 1205, Location: 'Bangalore/Mumbai/Hyderabad' },
  { Department: 'Sales & Marketing', 'Opening Headcount': 382, 'Joiners': 8, 'Leavers': 3, 'Closing Headcount': 387, Location: 'All' },
  { Department: 'Operations', 'Opening Headcount': 520, 'Joiners': 6, 'Leavers': 2, 'Closing Headcount': 524, Location: 'Chennai/Pune' },
  { Department: 'HR', 'Opening Headcount': 44, 'Joiners': 2, 'Leavers': 1, 'Closing Headcount': 45, Location: 'Mumbai/Delhi' },
];

const varianceData = [
  { 'Month': 'June 2025', 'Gross (₹)': 44890000, 'Net (₹)': 37456000, 'Deductions (₹)': 7434000, 'Headcount': 2798 },
  { 'Month': 'July 2025', 'Gross (₹)': 44890750, 'Net (₹)': 37157137, 'Deductions (₹)': 7733613, 'Headcount': 2847, 'Variance Gross (₹)': 750, 'Variance %': '0.002%' },
];

const reportDataMap: Record<string, { rows: Record<string, unknown>[]; filename: string }> = {
  'payroll-register': { rows: payrollRegisterData, filename: 'Payroll_Register' },
  'statutory-register': { rows: statutoryData, filename: 'Statutory_Register' },
  'department-summary': { rows: departmentCosts, filename: 'Department_Summary' },
  'location-summary': { rows: locationSummary, filename: 'Location_Summary' },
  'bank-transfer': { rows: bankTransferData, filename: 'Bank_Transfer_Statement' },
  'form-16-data': { rows: payrollRegisterData.map(r => ({ ...r, 'Annualized Gross (₹)': Number(r['Gross (₹)']) * 12, 'Annualized TDS (₹)': 0 })), filename: 'Form16_Data' },
  'cost-center-report': { rows: departmentCosts.map(d => ({ ...d, 'Cost Center': `CC-${d.Department.toUpperCase().slice(0, 3)}-001` })), filename: 'Cost_Center_Report' },
  'headcount-report': { rows: headcountData, filename: 'Headcount_Analysis' },
  'mis-report': { rows: [...payrollRegisterData], filename: 'MIS_Report' },
  'variance-report': { rows: varianceData, filename: 'Variance_Report' },
};

const reportTypes = [
  { id: 'payroll-register', name: 'Payroll Register', description: 'Monthly salary register for all employees', category: 'payroll', format: 'CSV' },
  { id: 'statutory-register', name: 'Statutory Register', description: 'ESI, PF, TDS deduction registers', category: 'compliance', format: 'CSV' },
  { id: 'department-summary', name: 'Department Cost Summary', description: 'Department-wise payroll cost breakdown', category: 'analytical', format: 'CSV' },
  { id: 'location-summary', name: 'Location-wise Summary', description: 'Location-wise payroll distribution report', category: 'analytical', format: 'CSV' },
  { id: 'bank-transfer', name: 'Bank Transfer Statement', description: 'Net salary transfer file for all banks', category: 'operational', format: 'CSV' },
  { id: 'form-16-data', name: 'Form 16 Data', description: 'Annual TDS certificate data (Form 16)', category: 'compliance', format: 'CSV' },
  { id: 'cost-center-report', name: 'Cost Center Report', description: 'Payroll cost by cost center with variance', category: 'analytical', format: 'CSV' },
  { id: 'headcount-report', name: 'Headcount Analysis', description: 'Employee strength and movement report', category: 'hr', format: 'CSV' },
  { id: 'mis-report', name: 'MIS Report', description: 'Management information system payroll report', category: 'management', format: 'CSV' },
  { id: 'variance-report', name: 'Month-on-Month Variance', description: 'Payroll variance analysis vs previous month', category: 'analytical', format: 'CSV' },
];

const monthlyData = [
  { month: 'Apr', gross: 415, net: 345, deductions: 70 },
  { month: 'May', gross: 432, net: 362, deductions: 70 },
  { month: 'Jun', gross: 449, net: 375, deductions: 74 },
  { month: 'Jul', gross: 449, net: 372, deductions: 77 },
];

const deductionBreakdown = [
  { name: 'TDS', value: 115, color: '#8884d8' },
  { name: 'PF (EE)', value: 62, color: '#82ca9d' },
  { name: 'ESI (EE)', value: 9, color: '#ffc658' },
  { name: 'Professional Tax', value: 4.5, color: '#ff7300' },
];

type RecentReport = { name: string; date: string; generatedBy: string; size: string; format: string; reportId: string };

export function FinancialReports({ currentUser, organization }: FinancialReportsProps) {
  const { fmt } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState('july');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [filterCategory, setFilterCategory] = useState('all');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([
    { name: 'June 2025 Payroll Register', date: '2025-07-01', generatedBy: 'Suresh Nair', size: '12 rows', format: 'CSV', reportId: 'payroll-register' },
    { name: 'Q1 FY26 Statutory Report', date: '2025-07-05', generatedBy: 'Vijay Sharma', size: '8 rows', format: 'CSV', reportId: 'statutory-register' },
    { name: 'June 2025 Bank Transfer File', date: '2025-07-01', generatedBy: 'Meena Iyer', size: '4 rows', format: 'CSV', reportId: 'bank-transfer' },
    { name: 'June 2025 Variance Report', date: '2025-07-03', generatedBy: 'Rajesh Kumar', size: '2 rows', format: 'CSV', reportId: 'variance-report' },
  ]);

  const filteredReportTypes = reportTypes.filter(r => filterCategory === 'all' || r.category === filterCategory);

  const generateAndDownload = async (reportId: string, reportName: string) => {
    setGeneratingId(reportId);
    await new Promise(r => setTimeout(r, 1200));
    const data = reportDataMap[reportId];
    if (data) {
      const filename = `${data.filename}_${selectedMonth}_${selectedYear}.csv`;
      downloadCSV(data.rows, filename);
      const newEntry: RecentReport = {
        name: `${selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} ${selectedYear} ${reportName}`,
        date: new Date().toLocaleDateString('en-CA'),
        generatedBy: currentUser.name,
        size: `${data.rows.length} rows`,
        format: 'CSV',
        reportId,
      };
      setRecentReports(prev => [newEntry, ...prev.slice(0, 9)]);
      toast.success(`${reportName} downloaded`, { description: `${data.rows.length} records exported as CSV` });
    }
    setGeneratingId(null);
  };

  const downloadHistoryReport = (report: RecentReport) => {
    const data = reportDataMap[report.reportId];
    if (data) {
      downloadCSV(data.rows, `${report.name.replace(/\s+/g, '_')}.csv`);
      toast.success(`Re-downloaded: ${report.name}`);
    }
  };

  const categoryBadge = (category: string) => {
    const map: Record<string, string> = {
      payroll: 'bg-blue-100 text-blue-800',
      compliance: 'bg-green-100 text-green-800',
      analytical: 'bg-purple-100 text-purple-800',
      operational: 'bg-orange-100 text-orange-800',
      hr: 'bg-pink-100 text-pink-800',
      management: 'bg-indigo-100 text-indigo-800',
    };
    return <Badge className={map[category] || 'bg-gray-100 text-gray-800'}>{category}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and download payroll and financial reports as CSV</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['April','May','June','July','August'].map(m => (
                <SelectItem key={m.toLowerCase()} value={m.toLowerCase()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="flex items-center space-x-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="analytical">Analytical</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="management">Management</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{filteredReportTypes.length} reports available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReportTypes.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{report.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {categoryBadge(report.category)}
                        <Badge variant="outline" className="text-xs">{report.format}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => generateAndDownload(report.id, report.name)}
                      disabled={generatingId === report.id}
                    >
                      {generatingId === report.id ? (
                        <><div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-2" />Generating…</>
                      ) : (
                        <><BarChart3 className="h-3 w-3 mr-2" />Generate & Download</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payroll Trend</CardTitle>
                <CardDescription>Gross, Net, and Deductions by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => fmt(v as number * 100000)} />
                    <Tooltip formatter={(v) => [fmt((v as number) * 100000), '']} />
                    <Legend />
                    <Bar dataKey="gross" fill="#8884d8" name="Gross" />
                    <Bar dataKey="deductions" fill="#ff7300" name="Deductions" />
                    <Bar dataKey="net" fill="#82ca9d" name="Net" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deduction Breakdown</CardTitle>
                <CardDescription>July 2025 deduction composition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={deductionBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                      label={({ name, value }) => `${name}: ${fmt((value as number) * 100000)}`}>
                      {deductionBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [fmt((v as number) * 100000), '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => downloadCSV(monthlyData.map(d => ({ Month: d.month, 'Gross (L)': d.gross, 'Net (L)': d.net, 'Deductions (L)': d.deductions })), 'Analytics_Trend.csv')}>
              <Download className="h-4 w-4 mr-2" />Export Chart Data
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Previously generated reports — click Download to re-export</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Generated On</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">{report.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{report.date}</TableCell>
                      <TableCell className="text-sm">{report.generatedBy}</TableCell>
                      <TableCell><Badge variant="outline">{report.format}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{report.size}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-7" onClick={() => downloadHistoryReport(report)}>
                          <Download className="h-3 w-3 mr-1" />Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
