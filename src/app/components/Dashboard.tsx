import React, { useState } from 'react';
import {
  Users, Calculator, AlertTriangle, CheckCircle, TrendingUp,
  Calendar, FileText, Clock, Banknote, PieChart, BarChart3,
  CreditCard, Building2, MapPin, Target, Globe, Shield, Award, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Organization } from '../App';
import { useCurrency } from '../context/CurrencyContext';

interface DashboardProps {
  currentUser: User;
  organization: Organization;
  onSectionChange?: (section: string) => void;
}

export function Dashboard({ currentUser, organization, onSectionChange }: DashboardProps) {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const { fmt, fmtFull } = useCurrency();

  const dashboardData = {
    totalEmployees: organization.employeeCount,
    pendingApprovals: 23,
    locations: organization.locations.length,
    monthlyBudget: 45750000,
    actualSpend: 44890750,
    complianceScore: 98.2,
    budgetUtilization: 98.1,
    financialSummary: {
      totalPayrollCost: 44890750,
      benefitsCost: 8978150,
      statutoryDeductions: 6733613,
      netPayable: 37157137,
      taxLiability: 11467230,
    },
    locationData: [
      { location: 'Mumbai',    employees: 847, budget: 15600000, actual: 15234000 },
      { location: 'Delhi',     employees: 623, budget: 11500000, actual: 11892000 },
      { location: 'Bangalore', employees: 745, budget: 13800000, actual: 13456000 },
      { location: 'Chennai',   employees: 412, budget: 7600000,  actual: 7234000  },
      { location: 'Pune',      employees: 156, budget: 2900000,  actual: 2845000  },
      { location: 'Hyderabad', employees: 64,  budget: 1200000,  actual: 1187000  },
    ],
    departmentCosts: [
      { department: 'Engineering',       employees: 1205, cost: 18900000, budget: 19500000 },
      { department: 'Sales & Marketing', employees: 387,  cost: 7800000,  budget: 8100000  },
      { department: 'Operations',        employees: 524,  cost: 6200000,  budget: 6400000  },
      { department: 'Accounts & Finance',employees: 89,   cost: 2100000,  budget: 2200000  },
      { department: 'Human Resources',   employees: 45,   cost: 1200000,  budget: 1300000  },
      { department: 'Administration',    employees: 156,  cost: 1890000,  budget: 2000000  },
      { department: 'Quality Assurance', employees: 234,  cost: 2800000,  budget: 2900000  },
      { department: 'Legal & Compliance',employees: 23,   cost: 890000,   budget: 950000   },
      { department: 'IT',                employees: 167,  cost: 3100000,  budget: 3200000  },
      { department: 'Procurement',       employees: 17,   cost: 567000,   budget: 600000   },
    ],
  };

  const monthlyTrend = [
    { month: 'Apr 2025', budget: 42000000, actual: 41500000 },
    { month: 'May 2025', budget: 43500000, actual: 43200000 },
    { month: 'Jun 2025', budget: 44200000, actual: 44890000 },
    { month: 'Jul 2025', budget: 45750000, actual: 44890750 },
  ];

  const complianceMetrics = [
    { metric: 'ESI Compliance',           score: 100 },
    { metric: 'PF Compliance',            score: 98  },
    { metric: 'TDS Filing',               score: 95  },
    { metric: 'Labour Law Compliance',    score: 97  },
    { metric: 'Minimum Wage Compliance',  score: 100 },
    { metric: 'Audit Readiness',          score: 96  },
  ];

  const upcomingDeadlines = [
    { task: 'ESI Returns Filing',     date: '2025-08-15', priority: 'high',     responsible: 'Accounts Team'      },
    { task: 'PF Remittance',          date: '2025-08-20', priority: 'high',     responsible: 'Payroll Admin'       },
    { task: 'TDS Challan - July',     date: '2025-08-07', priority: 'critical', responsible: 'Finance Controller'  },
    { task: 'Salary Transfer - Aug',  date: '2025-08-01', priority: 'critical', responsible: 'GM Accounts'         },
    { task: 'Monthly Compliance Rpt', date: '2025-08-05', priority: 'medium',   responsible: 'Compliance Team'     },
    { task: 'Board Financial Review', date: '2025-08-25', priority: 'medium',   responsible: 'CFO'                 },
  ];

  const priorityColor = (p: string) => ({
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }[p] ?? 'bg-gray-100 text-gray-800');

  const complianceColor = (s: number) =>
    s >= 98 ? 'text-green-600' : s >= 95 ? 'text-blue-600' : s >= 90 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Executive Dashboard</h1>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-muted-foreground">Welcome back, {currentUser.name}</p>
            <Badge variant="outline" className="text-sm">
              <Building2 className="h-3 w-3 mr-1" />{currentUser.designation}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <MapPin className="h-3 w-3 mr-1" />{currentUser.location}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            FY {organization.financialYear.start.substring(0, 4)}-{organization.financialYear.end.substring(2, 4)}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Globe className="h-3 w-3 mr-1" />{currentMonth}
          </Badge>
          <Button onClick={() => onSectionChange?.('payroll-processing')}>
            <Calculator className="h-4 w-4 mr-2" />Process Payroll
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical:</strong> TDS Challan for July 2025 due on 7th Aug. Amount: {fmtFull(dashboardData.financialSummary.taxLiability)}
            <Button variant="link" className="p-0 h-auto text-red-800 underline ml-1" onClick={() => onSectionChange?.('compliance')}>
              Process Now
            </Button>
          </AlertDescription>
        </Alert>
        <Alert className="border-yellow-200 bg-yellow-50">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Action Required:</strong> {dashboardData.pendingApprovals} payroll entries pending approval across {dashboardData.locations} locations.
            <Button variant="link" className="p-0 h-auto text-yellow-800 underline ml-1" onClick={() => onSectionChange?.('approval-workflows')}>
              Review Approvals
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll Cost</CardTitle>
            <Banknote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{fmt(dashboardData.financialSummary.totalPayrollCost)}</div>
            <p className="text-xs text-blue-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              <span className="text-green-600">+2.8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{dashboardData.budgetUtilization}%</div>
            <Progress value={dashboardData.budgetUtilization} className="mt-2" />
            <p className="text-xs text-green-600 mt-1">
              Under budget by {fmt(dashboardData.monthlyBudget - dashboardData.actualSpend)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Strength</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{dashboardData.totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-purple-600">
              <span className="text-green-600">+47</span> this month • {dashboardData.locations} locations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{dashboardData.complianceScore}%</div>
            <div className="flex items-center mt-1">
              <Award className="h-3 w-3 mr-1" />
              <span className="text-xs text-orange-600">Excellent Rating</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Trend Analysis</CardTitle>
                <CardDescription>Budget vs Actual spend over quarters</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => fmt(v)} />
                    <Tooltip formatter={(v) => [fmt(v as number), '']} />
                    <Legend />
                    <Area key="budget-area" type="monotone" dataKey="budget" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Budget" />
                    <Area key="actual-area" type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} name="Actual" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
                <CardDescription>Current month cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: 'Gross Payroll',        val: dashboardData.financialSummary.totalPayrollCost, neg: false },
                    { label: 'Benefits & Allowances',val: dashboardData.financialSummary.benefitsCost,    neg: false },
                    { label: 'Statutory Deductions', val: dashboardData.financialSummary.statutoryDeductions, neg: true },
                    { label: 'Tax Liability',        val: dashboardData.financialSummary.taxLiability,    neg: true  },
                  ].map(({ label, val, neg }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm">{label}</span>
                      <span className={`font-medium ${neg ? 'text-red-600' : ''}`}>
                        {neg ? '-' : ''}{fmt(val)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>Net Payable</span>
                      <span className="text-green-600">{fmt(dashboardData.financialSummary.netPayable)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location-wise Analysis</CardTitle>
              <CardDescription>Payroll distribution across {organization.locations.length} locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dashboardData.locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => [fmt(v as number), '']} />
                  <Legend />
                  <Bar key="budget-bar" dataKey="budget" fill="#8884d8" name="Budget" />
                  <Bar key="actual-bar" dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Cost Analysis</CardTitle>
              <CardDescription>Payroll costs by department and headcount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.departmentCosts.map((dept) => (
                  <div key={dept.department} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{dept.department}</h4>
                      <div className="text-right">
                        <p className="font-bold">{fmt(dept.cost)}</p>
                        <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                      </div>
                    </div>
                    <Progress value={(dept.cost / dept.budget) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Budget: {fmt(dept.budget)}</span>
                      <span>{((dept.cost / dept.budget) * 100).toFixed(1)}% utilized</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
                <CardDescription>Regulatory compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceMetrics.map((m) => (
                    <div key={m.metric} className="flex items-center justify-between">
                      <span className="text-sm">{m.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${complianceColor(m.score)}`}>{m.score}%</span>
                        <CheckCircle className={`h-4 w-4 ${complianceColor(m.score)}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Critical compliance and financial deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium text-sm">{d.task}</h4>
                          <p className="text-xs text-muted-foreground">{d.responsible} • {d.date}</p>
                        </div>
                      </div>
                      <Badge className={priorityColor(d.priority)}>{d.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Actions</CardTitle>
          <CardDescription>Quick access to critical management functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Approve Payroll',   icon: Calculator, section: 'approval-workflows' },
              { label: 'Financial Reports', icon: BarChart3,  section: 'financial-reports'  },
              { label: 'Budget Review',     icon: CreditCard, section: 'budget-management'  },
              { label: 'Compliance Check',  icon: Shield,     section: 'compliance'         },
              { label: 'Workforce Analysis',icon: Users,      section: 'employees'          },
              { label: 'Audit Trail',       icon: Activity,   section: 'audit-trail'        },
            ].map(({ label, icon: Icon, section }) => (
              <Button key={label} variant="outline" className="h-20 flex-col space-y-2" onClick={() => onSectionChange?.(section)}>
                <Icon className="h-6 w-6" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
