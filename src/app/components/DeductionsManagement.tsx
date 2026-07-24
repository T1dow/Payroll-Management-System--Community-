import React, { useState } from 'react';
import {
  Plus, Calculator, Settings as SettingsIcon, Percent, IndianRupee,
  Edit, Trash2, Eye, AlertCircle, CheckCircle, Download, X, Save
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { User } from '../App';
import { downloadCSV } from '../utils/download';

interface DeductionsManagementProps {
  currentUser: User;
  organization?: unknown;
}

interface DeductionRule {
  id: string;
  name: string;
  type: 'ESI' | 'PF' | 'TDS' | 'Custom';
  category: 'statutory' | 'voluntary';
  calculationType: 'percentage' | 'fixed';
  rate: number;
  maxLimit?: number;
  minSalary?: number;
  maxSalary?: number;
  status: 'active' | 'inactive';
  description: string;
  lastUpdated: string;
}

const deductionRules: DeductionRule[] = [
  {
    id: '1',
    name: 'Employee State Insurance (ESI)',
    type: 'ESI',
    category: 'statutory',
    calculationType: 'percentage',
    rate: 0.75,
    maxLimit: 21000,
    status: 'active',
    description: 'ESI contribution for employees earning up to ₹21,000',
    lastUpdated: '2025-01-15'
  },
  {
    id: '2',
    name: 'Provident Fund (PF)',
    type: 'PF',
    category: 'statutory',
    calculationType: 'percentage',
    rate: 12,
    maxLimit: 15000,
    status: 'active',
    description: 'PF contribution on basic salary up to ₹15,000',
    lastUpdated: '2025-01-15'
  },
  {
    id: '3',
    name: 'Tax Deducted at Source (TDS)',
    type: 'TDS',
    category: 'statutory',
    calculationType: 'percentage',
    rate: 10,
    minSalary: 250000,
    status: 'active',
    description: 'TDS on salary for annual income above ₹2.5L',
    lastUpdated: '2025-01-15'
  },
  {
    id: '4',
    name: 'Professional Tax',
    type: 'Custom',
    category: 'statutory',
    calculationType: 'fixed',
    rate: 200,
    status: 'active',
    description: 'Monthly professional tax deduction',
    lastUpdated: '2025-01-10'
  }
];

const complianceData = {
  esi: {
    totalEmployees: 456,
    eligibleEmployees: 234,
    monthlyContribution: 89500,
    complianceRate: 98.5,
    lastFiling: '2025-07-15',
    nextDue: '2025-08-15'
  },
  pf: {
    totalEmployees: 1247,
    eligibleEmployees: 1247,
    monthlyContribution: 1567800,
    complianceRate: 100,
    lastFiling: '2025-07-20',
    nextDue: '2025-08-20'
  },
  tds: {
    totalEmployees: 892,
    eligibleEmployees: 567,
    monthlyDeduction: 234500,
    complianceRate: 96.2,
    lastFiling: '2025-07-30',
    nextDue: '2025-08-30'
  }
};

const emptyRule: Omit<DeductionRule, 'id'> = {
  name: '', type: 'Custom', category: 'statutory', calculationType: 'percentage',
  rate: 0, status: 'active', description: '', lastUpdated: new Date().toLocaleDateString('en-CA'),
};

export function DeductionsManagement({ currentUser }: DeductionsManagementProps) {
  const { fmt, fmtFull, sym } = useCurrency();
  const [activeTab, setActiveTab] = useState('overview');
  const [rules, setRules] = useState(deductionRules);
  const [editingRule, setEditingRule] = useState<DeductionRule | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRule, setNewRule] = useState<Omit<DeductionRule, 'id'>>(emptyRule);
  const [calcBasic, setCalcBasic] = useState('');
  const [calcGross, setCalcGross] = useState('');

  const calcBasicNum = parseFloat(calcBasic) || 0;
  const calcGrossNum = parseFloat(calcGross) || 0;

  const calcESI = calcGrossNum <= 21000 ? Math.round(calcGrossNum * 0.0075) : 0;
  const calcPF = calcBasicNum > 0 ? Math.round(Math.min(calcBasicNum, 15000) * 0.12) : 0;
  const annualGross = calcGrossNum * 12;
  const calcTDS = annualGross > 250000 ? Math.round(((annualGross - 250000) * 0.05 + (annualGross > 500000 ? (Math.min(annualGross, 1000000) - 500000) * 0.1 : 0) + (annualGross > 1000000 ? (annualGross - 1000000) * 0.15 : 0)) / 12) : 0;
  const calcPT = calcGrossNum >= 15000 ? 200 : calcGrossNum >= 10000 ? 150 : 0;
  const calcTotalDeductions = calcESI + calcPF + calcTDS + calcPT;
  const calcNet = calcGrossNum - calcTotalDeductions;

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 98) return 'text-green-600';
    if (rate >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId
        ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
        : rule
    ));
    const rule = rules.find(r => r.id === ruleId);
    if (rule) toast.success(`${rule.name} ${rule.status === 'active' ? 'deactivated' : 'activated'}`);
  };

  const saveEditedRule = () => {
    if (!editingRule) return;
    setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r));
    toast.success(`${editingRule.name} updated successfully`);
    setEditingRule(null);
  };

  const addRule = () => {
    if (!newRule.name) return;
    const rule: DeductionRule = { ...newRule, id: Date.now().toString(), lastUpdated: new Date().toLocaleDateString('en-CA') };
    setRules(prev => [...prev, rule]);
    setNewRule(emptyRule);
    setShowAddDialog(false);
    toast.success(`Deduction rule "${rule.name}" added`);
  };

  const deleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(prev => prev.filter(r => r.id !== ruleId));
    if (rule) toast.success(`Rule "${rule.name}" deleted`);
  };

  const generateReturn = (type: string) => {
    const data = type === 'ESI' ? complianceData.esi : type === 'PF' ? complianceData.pf : complianceData.tds;
    const rows = [{ Type: type, Month: 'July 2025', 'Eligible Employees': data.eligibleEmployees, 'Monthly Amount (₹)': type === 'TDS' ? (data as typeof complianceData.tds).monthlyDeduction : (data as typeof complianceData.esi).monthlyContribution, 'Last Filing': data.lastFiling, 'Next Due': data.nextDue, 'Compliance Rate': data.complianceRate + '%' }];
    downloadCSV(rows, `${type}_Return_July_2025.csv`);
    toast.success(`${type} return generated and downloaded`);
  };

  const exportDeductionsReport = () => {
    const rows = rules.map(r => ({
      'Rule Name': r.name, Type: r.type, Category: r.category,
      'Calculation': r.calculationType, 'Rate': r.calculationType === 'percentage' ? `${r.rate}%` : `${sym}${r.rate}`,
      'Max Limit (₹)': r.maxLimit || '', Status: r.status, 'Last Updated': r.lastUpdated,
    }));
    downloadCSV(rows, `Deduction_Rules_${new Date().toLocaleDateString('en-CA')}.csv`);
    toast.success('Deduction rules exported');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Deductions Management</h1>
          <p className="text-muted-foreground">Configure and monitor statutory deductions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportDeductionsReport}>
            <Download className="h-4 w-4 mr-2" />Export Rules
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Deduction Rule
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Deduction Rules</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ESI Contributions</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmtFull(complianceData.esi.monthlyContribution)}</div>
                <p className="text-xs text-muted-foreground">
                  {complianceData.esi.eligibleEmployees} eligible employees
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Compliance Rate</span>
                    <span className={getComplianceColor(complianceData.esi.complianceRate)}>
                      {complianceData.esi.complianceRate}%
                    </span>
                  </div>
                  <Progress value={complianceData.esi.complianceRate} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PF Contributions</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmt(complianceData.pf.monthlyContribution)}</div>
                <p className="text-xs text-muted-foreground">
                  {complianceData.pf.eligibleEmployees} eligible employees
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Compliance Rate</span>
                    <span className={getComplianceColor(complianceData.pf.complianceRate)}>
                      {complianceData.pf.complianceRate}%
                    </span>
                  </div>
                  <Progress value={complianceData.pf.complianceRate} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TDS Deductions</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fmtFull(complianceData.tds.monthlyDeduction)}</div>
                <p className="text-xs text-muted-foreground">
                  {complianceData.tds.eligibleEmployees} eligible employees
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Compliance Rate</span>
                    <span className={getComplianceColor(complianceData.tds.complianceRate)}>
                      {complianceData.tds.complianceRate}%
                    </span>
                  </div>
                  <Progress value={complianceData.tds.complianceRate} className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>ESI Return Due:</strong> ESI return filing is due on August 15, 2025. 
                <Button variant="link" className="p-0 h-auto text-red-800 underline ml-1">
                  File now
                </Button>
              </AlertDescription>
            </Alert>
            
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>PF Compliance:</strong> All PF deductions are up to date and compliant.
              </AlertDescription>
            </Alert>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deduction Activity</CardTitle>
              <CardDescription>Latest updates and calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">July 2025 payroll processed</p>
                      <p className="text-sm text-muted-foreground">ESI, PF, and TDS deductions calculated</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Professional Tax rule updated</p>
                      <p className="text-sm text-muted-foreground">Rate changed from ₹150 to ₹200</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Today</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deduction Rules</CardTitle>
              <CardDescription>Configure statutory and voluntary deduction rules</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={rule.category === 'statutory' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rule.calculationType === 'percentage' 
                          ? `${rule.rate}%` 
                          : `${sym}${rule.rate}`
                        }
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rule.maxLimit && <div>Max: {fmtFull(rule.maxLimit)}</div>}
                          {rule.minSalary && <div>Min Salary: {fmtFull(rule.minSalary)}</div>}
                          {rule.maxSalary && <div>Max Salary: {fmtFull(rule.maxSalary)}</div>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(rule.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" title="Edit rule" onClick={() => setEditingRule({ ...rule })}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title={rule.status === 'active' ? 'Deactivate' : 'Activate'} onClick={() => toggleRuleStatus(rule.id)}>
                            <Switch checked={rule.status === 'active'} onCheckedChange={() => {}} className="pointer-events-none scale-75" />
                          </Button>
                          {rule.category !== 'statutory' && (
                            <Button variant="ghost" size="sm" title="Delete rule" onClick={() => deleteRule(rule.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ESI Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Employees</span>
                  <span className="font-medium">{complianceData.esi.totalEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Eligible for ESI</span>
                  <span className="font-medium">{complianceData.esi.eligibleEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Contribution</span>
                  <span className="font-medium">{fmtFull(complianceData.esi.monthlyContribution)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Filing</span>
                  <span className="font-medium">{complianceData.esi.lastFiling}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Due</span>
                  <span className="font-medium text-red-600">{complianceData.esi.nextDue}</span>
                </div>
                <Button className="w-full" size="sm" onClick={() => generateReturn('ESI')}>
                  <Download className="h-3 w-3 mr-2" />Generate ESI Return
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PF Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Employees</span>
                  <span className="font-medium">{complianceData.pf.totalEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Eligible for PF</span>
                  <span className="font-medium">{complianceData.pf.eligibleEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Contribution</span>
                  <span className="font-medium">{fmt(complianceData.pf.monthlyContribution)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Filing</span>
                  <span className="font-medium">{complianceData.pf.lastFiling}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Due</span>
                  <span className="font-medium text-yellow-600">{complianceData.pf.nextDue}</span>
                </div>
                <Button className="w-full" size="sm" onClick={() => generateReturn('PF')}>
                  <Download className="h-3 w-3 mr-2" />Generate PF Return
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TDS Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Employees</span>
                  <span className="font-medium">{complianceData.tds.totalEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subject to TDS</span>
                  <span className="font-medium">{complianceData.tds.eligibleEmployees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Deduction</span>
                  <span className="font-medium">{fmtFull(complianceData.tds.monthlyDeduction)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Filing</span>
                  <span className="font-medium">{complianceData.tds.lastFiling}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Next Due</span>
                  <span className="font-medium text-yellow-600">{complianceData.tds.nextDue}</span>
                </div>
                <Button className="w-full" size="sm" onClick={() => generateReturn('TDS')}>
                  <Download className="h-3 w-3 mr-2" />Generate TDS Challan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deduction Calculator</CardTitle>
              <CardDescription>Real-time statutory deduction calculator based on current rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basic-salary">Basic Salary (₹)</Label>
                  <Input
                    id="basic-salary"
                    type="number"
                    placeholder="e.g. 50000"
                    value={calcBasic}
                    onChange={(e) => setCalcBasic(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Used for PF calculation (12% on basic up to ₹15,000)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross-salary">Gross Salary (₹)</Label>
                  <Input
                    id="gross-salary"
                    type="number"
                    placeholder="e.g. 80000"
                    value={calcGross}
                    onChange={(e) => setCalcGross(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Used for ESI (eligible if ≤ ₹21,000) and TDS</p>
                </div>
              </div>

              {(calcBasicNum > 0 || calcGrossNum > 0) && (
                <div className="space-y-4">
                  <h4 className="font-medium">Calculated Deductions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-blue-600 mb-1">ESI (0.75%)</p>
                        <p className="text-xl font-bold text-blue-700">{fmtFull(calcESI)}</p>
                        {calcGrossNum > 21000 && <p className="text-xs text-blue-500 mt-1">Not applicable ({">"} ₹21K)</p>}
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-purple-600 mb-1">PF (12% of basic)</p>
                        <p className="text-xl font-bold text-purple-700">{fmtFull(calcPF)}</p>
                        {calcBasicNum > 15000 && <p className="text-xs text-purple-500 mt-1">Capped at ₹15K basic</p>}
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-orange-600 mb-1">TDS (Monthly)</p>
                        <p className="text-xl font-bold text-orange-700">{fmtFull(calcTDS)}</p>
                        {annualGross <= 250000 && <p className="text-xs text-orange-500 mt-1">Below tax threshold</p>}
                      </CardContent>
                    </Card>
                    <Card className="bg-teal-50 border-teal-200">
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-teal-600 mb-1">Professional Tax</p>
                        <p className="text-xl font-bold text-teal-700">{fmtFull(calcPT)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gross Salary</span>
                      <span className="font-medium">{fmtFull(calcGrossNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Total Deductions</span>
                      <span className="font-medium">- {fmtFull(calcTotalDeductions)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Net Take-Home</span>
                      <span className="text-green-600">{fmtFull(Math.max(0, calcNet))}</span>
                    </div>
                  </div>
                </div>
              )}

              {!calcBasicNum && !calcGrossNum && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p>Enter salary values above to see deductions calculated in real-time</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={open => !open && setEditingRule(null)}>
        <DialogContent>
          {editingRule && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Deduction Rule</DialogTitle>
                <DialogDescription>Update the rule configuration</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Rule Name</Label>
                  <Input value={editingRule.name} onChange={e => setEditingRule(r => r ? { ...r, name: e.target.value } : r)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Calculation Type</Label>
                    <Select value={editingRule.calculationType} onValueChange={v => setEditingRule(r => r ? { ...r, calculationType: v as 'percentage' | 'fixed' } : r)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Rate {editingRule.calculationType === 'percentage' ? '(%)' : `(${sym})`}</Label>
                    <Input type="number" value={editingRule.rate} onChange={e => setEditingRule(r => r ? { ...r, rate: parseFloat(e.target.value) || 0 } : r)} />
                  </div>
                </div>
                {editingRule.maxLimit !== undefined && (
                  <div className="space-y-1">
                    <Label>Max Limit ({sym})</Label>
                    <Input type="number" value={editingRule.maxLimit} onChange={e => setEditingRule(r => r ? { ...r, maxLimit: parseInt(e.target.value) || 0 } : r)} />
                  </div>
                )}
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input value={editingRule.description} onChange={e => setEditingRule(r => r ? { ...r, description: e.target.value } : r)} />
                </div>
                <Separator />
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={saveEditedRule}>
                    <Save className="h-4 w-4 mr-2" />Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setEditingRule(null)}>Cancel</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Rule Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Deduction Rule</DialogTitle>
            <DialogDescription>Create a new deduction rule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Rule Name *</Label>
              <Input placeholder="e.g. Special Allowance Deduction" value={newRule.name} onChange={e => setNewRule(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={newRule.type} onValueChange={v => setNewRule(p => ({ ...p, type: v as DeductionRule['type'] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESI">ESI</SelectItem>
                    <SelectItem value="PF">PF</SelectItem>
                    <SelectItem value="TDS">TDS</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={newRule.category} onValueChange={v => setNewRule(p => ({ ...p, category: v as 'statutory' | 'voluntary' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="statutory">Statutory</SelectItem>
                    <SelectItem value="voluntary">Voluntary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Calculation</Label>
                <Select value={newRule.calculationType} onValueChange={v => setNewRule(p => ({ ...p, calculationType: v as 'percentage' | 'fixed' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Rate {newRule.calculationType === 'percentage' ? '(%)' : `(${sym})`}</Label>
                <Input type="number" placeholder="0" value={newRule.rate || ''} onChange={e => setNewRule(p => ({ ...p, rate: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input placeholder="Brief description of this deduction" value={newRule.description} onChange={e => setNewRule(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1" onClick={addRule} disabled={!newRule.name}>
                <Plus className="h-4 w-4 mr-2" />Add Rule
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}