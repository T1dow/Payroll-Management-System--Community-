import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCSV } from '../utils/download';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Organization } from '../App';
import { useCurrency } from '../context/CurrencyContext';

interface CostCenterAnalysisProps {
  currentUser: User;
  organization: Organization;
}

const costCenters = [
  { code: 'CC-ENG-001', name: 'Engineering - Core', department: 'Engineering', location: 'Bangalore', headcount: 456, budget: 8500000, actual: 8234000, manager: 'Arun Mehta' },
  { code: 'CC-ENG-002', name: 'Engineering - Products', department: 'Engineering', location: 'Mumbai', headcount: 389, budget: 6800000, actual: 7100000, manager: 'Preethi Sivan' },
  { code: 'CC-ENG-003', name: 'Engineering - Infrastructure', department: 'Engineering', location: 'Hyderabad', headcount: 360, budget: 5600000, actual: 5234000, manager: 'Karthik Rajan' },
  { code: 'CC-SAL-001', name: 'Sales - North India', department: 'Sales & Marketing', location: 'Delhi', headcount: 187, budget: 3900000, actual: 4100000, manager: 'Rohit Gupta' },
  { code: 'CC-SAL-002', name: 'Sales - West India', department: 'Sales & Marketing', location: 'Mumbai', headcount: 200, budget: 4200000, actual: 4350000, manager: 'Smita Joshi' },
  { code: 'CC-FIN-001', name: 'Finance & Accounts', department: 'Accounts & Finance', location: 'Mumbai', headcount: 89, budget: 2200000, actual: 2100000, manager: 'Rajesh Kumar' },
  { code: 'CC-HR-001', name: 'Human Resources', department: 'Human Resources', location: 'Mumbai', headcount: 45, budget: 1300000, actual: 1200000, manager: 'Anita Singh' },
  { code: 'CC-OPS-001', name: 'Operations - Chennai', department: 'Operations', location: 'Chennai', headcount: 234, budget: 3200000, actual: 3100000, manager: 'Suresh Kumar' },
  { code: 'CC-OPS-002', name: 'Operations - Pune', department: 'Operations', location: 'Pune', headcount: 290, budget: 3200000, actual: 3100000, manager: 'Devika Nair' },
  { code: 'CC-IT-001', name: 'Information Technology', department: 'IT', location: 'Bangalore', headcount: 167, budget: 3200000, actual: 3100000, manager: 'Vinod Krishnan' },
  { code: 'CC-QA-001', name: 'Quality Assurance', department: 'Quality Assurance', location: 'Chennai', headcount: 234, budget: 2900000, actual: 2800000, manager: 'Geetha Pillai' },
  { code: 'CC-ADM-001', name: 'Administration', department: 'Administration', location: 'Mumbai', headcount: 156, budget: 2000000, actual: 1890000, manager: 'Deepa Menon' },
];

const chartData = costCenters.map(cc => ({
  name: cc.code.replace('CC-', ''),
  Budget: cc.budget / 100000,
  Actual: cc.actual / 100000,
}));

export function CostCenterAnalysis({ currentUser, organization }: CostCenterAnalysisProps) {
  const { fmt } = useCurrency();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filtered = costCenters.filter(cc =>
    cc.code.toLowerCase().includes(search.toLowerCase()) ||
    cc.name.toLowerCase().includes(search.toLowerCase()) ||
    cc.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalBudget = costCenters.reduce((s, cc) => s + cc.budget, 0);
  const totalActual = costCenters.reduce((s, cc) => s + cc.actual, 0);
  const overBudget = costCenters.filter(cc => cc.actual > cc.budget);

  const handleExport = () => {
    const rows = costCenters.map(cc => ({
      'Code': cc.code,
      'Name': cc.name,
      'Department': cc.department,
      'Location': cc.location,
      'Headcount': cc.headcount,
      'Budget (₹)': cc.budget,
      'Actual (₹)': cc.actual,
      'Variance (₹)': cc.budget - cc.actual,
      'Utilization %': ((cc.actual / cc.budget) * 100).toFixed(1) + '%',
      'Manager': cc.manager,
      'Status': cc.actual > cc.budget ? 'Over Budget' : (cc.actual / cc.budget) >= 0.95 ? 'Near Limit' : 'On Track',
    }));
    downloadCSV(rows, `Cost_Center_Analysis_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success('Cost center analysis downloaded', { description: `${rows.length} cost centers exported as CSV` });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cost Center Analysis</h1>
          <p className="text-muted-foreground">Payroll allocation and tracking by cost center</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600">Total Cost Centers</p>
            <p className="text-2xl font-bold text-blue-700">{costCenters.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-600">Total Budget</p>
            <p className="text-2xl font-bold text-green-700">{fmt(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-600">Total Actual</p>
            <p className="text-2xl font-bold text-purple-700">{fmt(totalActual)}</p>
            <Progress value={(totalActual / totalBudget) * 100} className="mt-2" />
          </CardContent>
        </Card>
        <Card className={`bg-gradient-to-br border ${overBudget.length > 0 ? 'from-red-50 to-red-100 border-red-200' : 'from-emerald-50 to-emerald-100 border-emerald-200'}`}>
          <CardContent className="p-4">
            <p className={`text-sm ${overBudget.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Over Budget</p>
            <p className={`text-2xl font-bold ${overBudget.length > 0 ? 'text-red-700' : 'text-emerald-700'}`}>{overBudget.length}</p>
            <p className="text-xs text-muted-foreground">cost centers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview Chart</TabsTrigger>
          <TabsTrigger value="details">Detailed Table</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual by Cost Center</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => fmt((v as number) * 100000)} />
                  <Tooltip formatter={(v) => [fmt((v as number) * 100000), '']} />
                  <Legend />
                  <Bar dataKey="Budget" fill="#8884d8" name="Budgeted" />
                  <Bar dataKey="Actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code, name, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cost Center</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Headcount</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((cc) => {
                      const variance = cc.budget - cc.actual;
                      const utilization = (cc.actual / cc.budget) * 100;
                      const isOver = variance < 0;
                      return (
                        <TableRow key={cc.code}>
                          <TableCell>
                            <div>
                              <p className="font-mono text-sm font-medium">{cc.code}</p>
                              <p className="text-xs text-muted-foreground">{cc.name}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{cc.department}</TableCell>
                          <TableCell className="text-sm">{cc.location}</TableCell>
                          <TableCell className="text-sm">{cc.headcount}</TableCell>
                          <TableCell className="text-sm">{fmt(cc.budget)}</TableCell>
                          <TableCell className="text-sm">{fmt(cc.actual)}</TableCell>
                          <TableCell className={`font-medium text-sm ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                            {isOver ? '- ' : '+ '}{fmt(Math.abs(variance))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={Math.min(utilization, 100)} className="w-16 h-2" />
                              <span className="text-xs">{utilization.toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isOver
                              ? <Badge className="bg-red-100 text-red-800">Over Budget</Badge>
                              : utilization >= 95
                              ? <Badge className="bg-yellow-100 text-yellow-800">Near Limit</Badge>
                              : <Badge className="bg-green-100 text-green-800">On Track</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
