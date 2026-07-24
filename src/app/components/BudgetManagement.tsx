import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, PlusCircle, Edit, Download } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { User, Organization } from '../App';

interface BudgetManagementProps {
  currentUser: User;
  organization: Organization;
}

const departmentBudgets = [
  { department: 'Engineering', allocated: 19500000, spent: 18900000, headcount: 1205, variance: 600000 },
  { department: 'Sales & Marketing', allocated: 8100000, spent: 8450000, headcount: 387, variance: -350000 },
  { department: 'Operations', allocated: 6400000, spent: 6200000, headcount: 524, variance: 200000 },
  { department: 'Accounts & Finance', allocated: 2200000, spent: 2100000, headcount: 89, variance: 100000 },
  { department: 'Human Resources', allocated: 1300000, spent: 1200000, headcount: 45, variance: 100000 },
  { department: 'Administration', allocated: 2000000, spent: 1890000, headcount: 156, variance: 110000 },
  { department: 'Quality Assurance', allocated: 2900000, spent: 2800000, headcount: 234, variance: 100000 },
  { department: 'Legal & Compliance', allocated: 950000, spent: 890000, headcount: 23, variance: 60000 },
  { department: 'IT', allocated: 3200000, spent: 3100000, headcount: 167, variance: 100000 },
  { department: 'Procurement', allocated: 600000, spent: 567000, headcount: 17, variance: 33000 },
];

const monthlyTrend = [
  { month: 'Apr', budget: 42000000, actual: 41500000 },
  { month: 'May', budget: 43500000, actual: 43200000 },
  { month: 'Jun', budget: 44200000, actual: 44890000 },
  { month: 'Jul', budget: 45750000, actual: 44890750 },
];

const locationBudgets = [
  { location: 'Mumbai', allocated: 15600000, spent: 15234000, utilization: 97.6 },
  { location: 'Delhi', allocated: 11500000, spent: 11892000, utilization: 103.4 },
  { location: 'Bangalore', allocated: 13800000, spent: 13456000, utilization: 97.5 },
  { location: 'Chennai', allocated: 7600000, spent: 7234000, utilization: 95.2 },
  { location: 'Pune', allocated: 2900000, spent: 2845000, utilization: 98.1 },
  { location: 'Hyderabad', allocated: 1200000, spent: 1187000, utilization: 98.9 },
];

export function BudgetManagement({ currentUser, organization }: BudgetManagementProps) {
  const { fmt, fmtFull } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = () => {
    const rows = departmentBudgets.map(d => ({
      Department: d.department,
      Headcount: d.headcount,
      'Allocated (₹)': d.allocated,
      'Spent (₹)': d.spent,
      'Variance (₹)': d.variance,
      'Utilization %': ((d.spent / d.allocated) * 100).toFixed(1) + '%',
      Status: d.variance < 0 ? 'Over Budget' : (d.spent / d.allocated) >= 0.95 ? 'Near Limit' : 'On Track',
    }));
    downloadCSV(rows, `Budget_Report_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success('Budget report downloaded', { description: `${rows.length} departments exported as CSV` });
  };

  const totalAllocated = departmentBudgets.reduce((s, d) => s + d.allocated, 0);
  const totalSpent = departmentBudgets.reduce((s, d) => s + d.spent, 0);
  const totalVariance = totalAllocated - totalSpent;
  const overBudgetDepts = departmentBudgets.filter(d => d.variance < 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Budget Management</h1>
          <p className="text-muted-foreground">FY {organization.financialYear.start.substring(0, 4)}-{organization.financialYear.end.substring(2, 4)} • Payroll Budget Planning & Control</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Revise Budget
          </Button>
        </div>
      </div>

      {overBudgetDepts.length > 0 && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Budget Overrun Alert</p>
            <p className="text-sm text-red-700">
              {overBudgetDepts.map(d => d.department).join(', ')} {overBudgetDepts.length === 1 ? 'has' : 'have'} exceeded allocated budget this month.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Total Allocated</p>
            <p className="text-2xl font-bold text-blue-700">{fmt(totalAllocated)}</p>
            <p className="text-xs text-blue-500 mt-1">Annual payroll budget</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Total Spent</p>
            <p className="text-2xl font-bold text-green-700">{fmt(totalSpent)}</p>
            <Progress value={(totalSpent / totalAllocated) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br border ${totalVariance >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-red-50 to-red-100 border-red-200'}`}>
          <CardContent className="p-4">
            <p className={`text-sm ${totalVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Variance</p>
            <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {totalVariance >= 0 ? '+' : '-'}{fmt(Math.abs(totalVariance))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{totalVariance >= 0 ? 'Under budget' : 'Over budget'}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-600">Utilization</p>
            <p className="text-2xl font-bold text-purple-700">{((totalSpent / totalAllocated) * 100).toFixed(1)}%</p>
            <p className="text-xs text-purple-500 mt-1">{overBudgetDepts.length} dept(s) over budget</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="locations">By Location</TabsTrigger>
          <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={departmentBudgets.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => fmt(v as number)} />
                    <YAxis type="category" dataKey="department" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [fmt(v as number), '']} />
                    <Legend />
                    <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Utilization Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentBudgets.map((dept) => {
                    const util = (dept.spent / dept.allocated) * 100;
                    const isOver = util > 100;
                    return (
                      <div key={dept.department}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{dept.department}</span>
                          <span className={isOver ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                            {util.toFixed(1)}%
                            {isOver && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                          </span>
                        </div>
                        <Progress value={Math.min(util, 100)} className={isOver ? '[&>div]:bg-red-500' : ''} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Budget Details</CardTitle>
              <CardDescription>Detailed budget allocation, spending, and variance analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Headcount</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentBudgets.map((dept) => {
                    const util = (dept.spent / dept.allocated) * 100;
                    const isOver = dept.variance < 0;
                    return (
                      <TableRow key={dept.department}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell>{dept.headcount}</TableCell>
                        <TableCell>{fmt(dept.allocated)}</TableCell>
                        <TableCell>{fmt(dept.spent)}</TableCell>
                        <TableCell className={isOver ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                          {isOver ? '-' : '+'}{fmt(Math.abs(dept.variance))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={Math.min(util, 100)} className="w-16 h-2" />
                            <span className="text-sm">{util.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isOver
                            ? <Badge className="bg-red-100 text-red-800">Over Budget</Badge>
                            : util >= 95
                            ? <Badge className="bg-yellow-100 text-yellow-800">Near Limit</Badge>
                            : <Badge className="bg-green-100 text-green-800">On Track</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationBudgets.map((loc) => {
              const isOver = loc.utilization > 100;
              return (
                <Card key={loc.location}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{loc.location}</CardTitle>
                      <Badge className={isOver ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {loc.utilization.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-medium">{fmt(loc.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">{fmt(loc.spent)}</span>
                    </div>
                    <Progress value={Math.min(loc.utilization, 100)} className={isOver ? '[&>div]:bg-red-500' : ''} />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Variance</span>
                      <span className={`font-medium ${loc.utilization > 100 ? 'text-red-600' : 'text-green-600'}`}>
                        {loc.utilization > 100 ? '-' : '+'}{fmt(Math.abs(loc.allocated - loc.spent))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget vs Actual Trend</CardTitle>
              <CardDescription>Current financial year payroll expenditure tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => fmt(v as number)} />
                  <Tooltip formatter={(v) => [fmt(v as number), '']} />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeWidth={2} name="Budgeted" />
                  <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Actual" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
