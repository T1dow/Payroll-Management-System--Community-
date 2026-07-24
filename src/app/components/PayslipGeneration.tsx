import React, { useState } from 'react';
import {
  FileText, Download, Mail, Eye, Search, Calendar,
  Users, Send, Printer, Plus, CheckCircle, X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { User } from '../App';
import { downloadCSV, downloadHTML, buildPayslipHTML } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';

interface PayslipGenerationProps {
  currentUser: User;
  organization?: unknown;
}

interface PayslipData {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  location: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  esi: number;
  pf: number;
  tds: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
  status: 'generated' | 'sent' | 'pending';
  generatedDate: string;
  bankAccount: string;
  panNumber: string;
}

const initialPayslips: PayslipData[] = [
  {
    id: '1', employeeId: 'TC-2020-0156', employeeName: 'Amit Sharma',
    designation: 'Senior Software Engineer', department: 'Engineering', location: 'Mumbai',
    month: 'July', year: 2025,
    basicSalary: 80000, hra: 32000, allowances: 15000, grossSalary: 127000,
    esi: 952, pf: 9600, tds: 15240, professionalTax: 200,
    totalDeductions: 25992, netSalary: 101008,
    status: 'sent', generatedDate: '2025-08-01', bankAccount: 'HDFC-****1234', panNumber: 'ABCDE1234F'
  },
  {
    id: '2', employeeId: 'TC-2019-0089', employeeName: 'Priya Patel',
    designation: 'Finance Manager', department: 'Accounts & Finance', location: 'Mumbai',
    month: 'July', year: 2025,
    basicSalary: 95000, hra: 38000, allowances: 20000, grossSalary: 153000,
    esi: 0, pf: 11400, tds: 22950, professionalTax: 200,
    totalDeductions: 34550, netSalary: 118450,
    status: 'generated', generatedDate: '2025-08-01', bankAccount: 'ICICI-****5678', panNumber: 'FGHIJ5678K'
  },
  {
    id: '3', employeeId: 'TC-2021-0234', employeeName: 'Rahul Kumar',
    designation: 'Area Sales Manager', department: 'Sales & Marketing', location: 'Delhi',
    month: 'July', year: 2025,
    basicSalary: 75000, hra: 30000, allowances: 18000, grossSalary: 123000,
    esi: 922, pf: 9000, tds: 14760, professionalTax: 200,
    totalDeductions: 24882, netSalary: 98118,
    status: 'pending', generatedDate: '2025-08-01', bankAccount: 'SBI-****9012', panNumber: 'KLMNO9012P'
  },
  {
    id: '4', employeeId: 'TC-2018-0045', employeeName: 'Sneha Reddy',
    designation: 'HR Manager', department: 'Human Resources', location: 'Bangalore',
    month: 'July', year: 2025,
    basicSalary: 85000, hra: 34000, allowances: 16000, grossSalary: 135000,
    esi: 0, pf: 10200, tds: 18900, professionalTax: 200,
    totalDeductions: 29300, netSalary: 105700,
    status: 'sent', generatedDate: '2025-08-01', bankAccount: 'AXIS-****3456', panNumber: 'QRSTU3456V'
  },
  {
    id: '5', employeeId: 'TC-2022-0312', employeeName: 'Vikram Singh',
    designation: 'Operations Lead', department: 'Operations', location: 'Chennai',
    month: 'July', year: 2025,
    basicSalary: 65000, hra: 26000, allowances: 10000, grossSalary: 101000,
    esi: 757, pf: 7800, tds: 9100, professionalTax: 200,
    totalDeductions: 17857, netSalary: 83143,
    status: 'pending', generatedDate: '', bankAccount: 'Kotak-****7890', panNumber: 'VWXYZ7890A'
  },
];

const COMPANY_NAME = 'TechCorp Industries Ltd.';

export function PayslipGeneration({ currentUser }: PayslipGenerationProps) {
  const { fmt, fmtFull, sym, config } = useCurrency();
  const [payslips, setPayslips] = useState(initialPayslips);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewPayslip, setPreviewPayslip] = useState<PayslipData | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('july');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ employeeId: '', month: 'July', year: '2025' });

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const filtered = payslips.filter(p => {
    const matchSearch = !searchTerm ||
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMonth = selectedMonth === 'all' || p.month.toLowerCase() === selectedMonth;
    const matchYear = selectedYear === 'all' || p.year.toString() === selectedYear;
    return matchSearch && matchMonth && matchYear;
  });

  // ── Download helpers ──────────────────────────────────────────────
  const downloadSinglePayslip = (p: PayslipData) => {
    const html = buildPayslipHTML({
      companyName: COMPANY_NAME,
      employeeName: p.employeeName,
      employeeId: p.employeeId,
      designation: p.designation,
      department: p.department,
      location: p.location,
      month: p.month,
      year: p.year,
      generatedDate: p.generatedDate || new Date().toLocaleDateString('en-IN'),
      basicSalary: p.basicSalary,
      hra: p.hra,
      allowances: p.allowances,
      grossSalary: p.grossSalary,
      esi: p.esi,
      pf: p.pf,
      tds: p.tds,
      professionalTax: p.professionalTax,
      totalDeductions: p.totalDeductions,
      netSalary: p.netSalary,
      bankAccount: p.bankAccount,
      panNumber: p.panNumber,
      currencySymbol: sym,
      currencyLocale: config.locale,
    });
    downloadHTML(html, `Payslip_${p.employeeId}_${p.month}_${p.year}.html`);
    toast.success(`Payslip downloaded for ${p.employeeName}`);
  };

  const printPayslip = (p: PayslipData) => {
    const html = buildPayslipHTML({
      companyName: COMPANY_NAME,
      employeeName: p.employeeName,
      employeeId: p.employeeId,
      designation: p.designation,
      department: p.department,
      location: p.location,
      month: p.month,
      year: p.year,
      generatedDate: p.generatedDate || new Date().toLocaleDateString('en-IN'),
      basicSalary: p.basicSalary,
      hra: p.hra,
      allowances: p.allowances,
      grossSalary: p.grossSalary,
      esi: p.esi,
      pf: p.pf,
      tds: p.tds,
      professionalTax: p.professionalTax,
      totalDeductions: p.totalDeductions,
      netSalary: p.netSalary,
      bankAccount: p.bankAccount,
      panNumber: p.panNumber,
      currencySymbol: sym,
      currencyLocale: config.locale,
    });
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 500);
    }
  };

  const emailPayslip = (p: PayslipData) => {
    toast.success(`Payslip emailed to ${p.employeeName}`, {
      description: `Sent to ${p.employeeId.toLowerCase()}@techcorp.com`,
    });
    setPayslips(prev => prev.map(ps => ps.id === p.id ? { ...ps, status: 'sent' as const } : ps));
  };

  const downloadBulk = () => {
    const targets = selectedIds.length > 0
      ? payslips.filter(p => selectedIds.includes(p.id))
      : filtered;
    const rows = targets.map(p => ({
      'Employee ID': p.employeeId,
      'Employee Name': p.employeeName,
      'Designation': p.designation,
      'Department': p.department,
      'Location': p.location,
      'Month': `${p.month} ${p.year}`,
      'Basic Salary': p.basicSalary,
      'HRA': p.hra,
      'Allowances': p.allowances,
      'Gross Salary': p.grossSalary,
      'ESI': p.esi,
      'PF': p.pf,
      'TDS': p.tds,
      'Professional Tax': p.professionalTax,
      'Total Deductions': p.totalDeductions,
      'Net Salary': p.netSalary,
      'Status': p.status,
    }));
    downloadCSV(rows, `Payslips_${selectedMonth}_${selectedYear}.csv`);
    toast.success(`Downloaded ${targets.length} payslips as CSV`);
  };

  const emailBulk = () => {
    const targets = selectedIds.length > 0
      ? payslips.filter(p => selectedIds.includes(p.id))
      : filtered;
    setPayslips(prev => prev.map(p =>
      targets.some(t => t.id === p.id) ? { ...p, status: 'sent' as const } : p
    ));
    setSelectedIds([]);
    toast.success(`Emailed payslips to ${targets.length} employees`);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    const target = payslips.find(p => p.employeeId === genForm.employeeId || p.employeeName.toLowerCase().includes(genForm.employeeId.toLowerCase()));
    if (target) {
      setPayslips(prev => prev.map(p =>
        p.id === target.id
          ? { ...p, status: 'generated' as const, generatedDate: new Date().toLocaleDateString('en-IN'), month: genForm.month, year: parseInt(genForm.year) }
          : p
      ));
      toast.success(`Payslip generated for ${target.employeeName}`);
    } else {
      toast.error('Employee not found. Check the Employee ID or name.');
    }
    setGenerating(false);
    setShowGenerateDialog(false);
  };

  const handleGenerateBulk = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    setPayslips(prev => prev.map(p =>
      p.status === 'pending'
        ? { ...p, status: 'generated' as const, generatedDate: new Date().toLocaleDateString('en-IN') }
        : p
    ));
    toast.success('Bulk payslip generation complete', { description: `${payslips.filter(p => p.status === 'pending').length} payslips generated` });
    setGenerating(false);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      generated: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return <Badge className={map[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payslip Management</h1>
          <p className="text-muted-foreground">Generate, download, print, and distribute employee payslips</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGenerateBulk} disabled={generating}>
            {generating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
            Generate Bulk
          </Button>
          <Button onClick={() => setShowGenerateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Payslip
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Total Payslips', payslips.length, 'text-foreground', FileText],
          ['Generated', payslips.filter(p => p.status === 'generated').length, 'text-blue-600', Eye],
          ['Sent', payslips.filter(p => p.status === 'sent').length, 'text-green-600', Send],
          ['Pending', payslips.filter(p => p.status === 'pending').length, 'text-yellow-600', Calendar],
        ].map(([label, val, color, Icon]: any) => (
          <Card key={String(label)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
              </div>
              <Icon className={`h-8 w-8 ${color} opacity-60`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or employee ID…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(m => <SelectItem key={m.toLowerCase()} value={m.toLowerCase()}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{selectedIds.length} payslip(s) selected</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={downloadBulk}>
                <Download className="h-4 w-4 mr-2" />Download All
              </Button>
              <Button size="sm" variant="outline" onClick={emailBulk}>
                <Mail className="h-4 w-4 mr-2" />Email All
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                <X className="h-4 w-4 mr-1" />Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payslips</CardTitle>
              <CardDescription>Showing {filtered.length} payslips</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={downloadBulk}>
              <Download className="h-4 w-4 mr-2" />Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{p.employeeId} • {p.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{p.month} {p.year}</p>
                    <p className="text-xs text-muted-foreground">{p.location}</p>
                  </TableCell>
                  <TableCell>{fmtFull(p.grossSalary)}</TableCell>
                  <TableCell className="text-red-600">{fmtFull(p.totalDeductions)}</TableCell>
                  <TableCell className="font-medium text-green-600">{fmtFull(p.netSalary)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => setPreviewPayslip(p)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadSinglePayslip(p)} title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => emailPayslip(p)} title="Email">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewPayslip} onOpenChange={open => !open && setPreviewPayslip(null)}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          {previewPayslip && (
            <>
              <DialogHeader>
                <DialogTitle>Payslip Preview</DialogTitle>
                <DialogDescription>{previewPayslip.month} {previewPayslip.year} — {previewPayslip.employeeName}</DialogDescription>
              </DialogHeader>

              <div className="border rounded-lg overflow-hidden">
                {/* Payslip Header */}
                <div className="bg-blue-700 text-white text-center p-4">
                  <h2 className="text-lg font-bold">{COMPANY_NAME}</h2>
                  <p className="text-sm opacity-80">SALARY SLIP — {previewPayslip.month.toUpperCase()} {previewPayslip.year}</p>
                </div>

                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border-b text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{previewPayslip.employeeName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Employee ID</span><span className="font-medium">{previewPayslip.employeeId}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Designation</span><span className="font-medium">{previewPayslip.designation}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{previewPayslip.department}</span></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{previewPayslip.location}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Bank Account</span><span className="font-medium">{previewPayslip.bankAccount}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">PAN</span><span className="font-medium">{previewPayslip.panNumber}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Generated</span><span className="font-medium">{previewPayslip.generatedDate || '—'}</span></div>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="grid grid-cols-2 gap-0 divide-x">
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-green-700 bg-green-50 -mx-4 px-4 py-2 mb-3 border-b border-green-100">Earnings</h4>
                    <div className="space-y-2 text-sm">
                      {[['Basic Salary', previewPayslip.basicSalary], ['HRA', previewPayslip.hra], ['Other Allowances', previewPayslip.allowances]].map(([label, val]) => (
                        <div key={String(label)} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span>{fmtFull(Number(val))}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-bold"><span>Gross Salary</span><span className="text-green-700">{fmtFull(previewPayslip.grossSalary)}</span></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-red-700 bg-red-50 -mx-4 px-4 py-2 mb-3 border-b border-red-100">Deductions</h4>
                    <div className="space-y-2 text-sm">
                      {[['ESI (0.75%)', previewPayslip.esi], ['PF (12%)', previewPayslip.pf], ['TDS', previewPayslip.tds], ['Professional Tax', previewPayslip.professionalTax]].map(([label, val]) => (
                        <div key={String(label)} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span>{fmtFull(Number(val))}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between font-bold"><span>Total Deductions</span><span className="text-red-700">{fmtFull(previewPayslip.totalDeductions)}</span></div>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="bg-blue-700 text-white text-center p-4">
                  <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Net Take-Home Salary</p>
                  <p className="text-2xl font-bold">{fmtFull(previewPayslip.netSalary)}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => printPayslip(previewPayslip)}>
                  <Printer className="h-4 w-4 mr-2" />Print
                </Button>
                <Button variant="outline" onClick={() => downloadSinglePayslip(previewPayslip)}>
                  <Download className="h-4 w-4 mr-2" />Download
                </Button>
                <Button onClick={() => { emailPayslip(previewPayslip); setPreviewPayslip(null); }}>
                  <Mail className="h-4 w-4 mr-2" />Email Payslip
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Payslip</DialogTitle>
            <DialogDescription>Generate a payslip for a specific employee and period</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Employee ID or Name</Label>
              <Input placeholder="e.g. TC-2020-0156 or Amit" value={genForm.employeeId} onChange={e => setGenForm(p => ({ ...p, employeeId: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Month</Label>
                <Select value={genForm.month} onValueChange={v => setGenForm(p => ({ ...p, month: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Year</Label>
                <Select value={genForm.year} onValueChange={v => setGenForm(p => ({ ...p, year: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1" onClick={handleGenerate} disabled={generating || !genForm.employeeId}>
                {generating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {generating ? 'Generating…' : 'Generate'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowGenerateDialog(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
