import React, { useState } from 'react';
import {
  FileText, Download, Mail, Calendar, MapPin, Building2,
  User, Briefcase, Clock, TrendingUp, CheckCircle,
  Printer, IndianRupee, Users, ChevronRight, Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { User as UserType, Organization } from '../App';
import { downloadHTML, buildPayslipHTML } from '../utils/download';
import { useCurrency } from '../context/CurrencyContext';

interface PersonalDashboardProps {
  currentUser: UserType;
  organization: Organization;
  onSectionChange?: (section: string) => void;
}

// Personal payslip data keyed by employeeId
const PERSONAL_PAYSLIP: Record<string, {
  basicSalary: number; hra: number; allowances: number; grossSalary: number;
  esi: number; pf: number; tds: number; professionalTax: number;
  totalDeductions: number; netSalary: number;
  bankAccount: string; panNumber: string;
}> = {
  'TC-2020-0156': { basicSalary: 80000, hra: 32000, allowances: 15000, grossSalary: 127000, esi: 952, pf: 9600, tds: 15240, professionalTax: 200, totalDeductions: 25992, netSalary: 101008, bankAccount: 'HDFC Bank ****1234', panNumber: 'ABCDE1234F' },
  'TC-2020-0267': { basicSalary: 45000, hra: 18000, allowances: 8000, grossSalary: 71000, esi: 532, pf: 5400, tds: 2800, professionalTax: 200, totalDeductions: 8932, netSalary: 62068, bankAccount: 'SBI ****4567', panNumber: 'LMNOP5678Q' },
  'TC-2019-0156': { basicSalary: 70000, hra: 28000, allowances: 12000, grossSalary: 110000, esi: 0, pf: 8400, tds: 11000, professionalTax: 200, totalDeductions: 19600, netSalary: 90400, bankAccount: 'ICICI ****8901', panNumber: 'RSTUV9012W' },
};

const getPersonalPayslip = (employeeId: string) =>
  PERSONAL_PAYSLIP[employeeId] ?? {
    basicSalary: 55000, hra: 22000, allowances: 10000, grossSalary: 87000,
    esi: 652, pf: 6600, tds: 6000, professionalTax: 200,
    totalDeductions: 13452, netSalary: 73548,
    bankAccount: 'HDFC Bank ****0000', panNumber: 'XXXXX0000X',
  };

const TEAM_SUMMARY: Record<string, { headcount: number; onLeave: number; pendingApprovals: number; avgSalary: number }> = {
  'manager': { headcount: 24, onLeave: 2, pendingApprovals: 3, avgSalary: 78000 },
  'supervisor': { headcount: 12, onLeave: 1, pendingApprovals: 1, avgSalary: 55000 },
  'department-head': { headcount: 156, onLeave: 8, pendingApprovals: 12, avgSalary: 92000 },
};

const RECENT_PAYSLIPS = ['July 2025', 'June 2025', 'May 2025', 'April 2025'];

const ANNOUNCEMENTS = [
  { title: 'August 2025 Payroll Processing', date: 'Aug 1, 2025', type: 'info', body: 'August salaries will be credited on 1st August 2025.' },
  { title: 'ESI Rate Update Effective Oct 2025', date: 'Jul 28, 2025', type: 'warning', body: 'ESI employee contribution remains at 0.75%. Employer rate updated.' },
  { title: 'New Leave Policy', date: 'Jul 20, 2025', type: 'info', body: 'Updated leave policy effective from August 1st. Check HRMS for details.' },
];

export function PersonalDashboard({ currentUser, organization, onSectionChange }: PersonalDashboardProps) {
  const { fmt, fmtFull, sym, config } = useCurrency();
  const payslip = getPersonalPayslip(currentUser.employeeId);
  const teamData = TEAM_SUMMARY[currentUser.role];
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isTeamRole = ['manager', 'supervisor', 'department-head'].includes(currentUser.role);
  const isHRRole = ['hr-executive', 'hr-manager'].includes(currentUser.role);

  const handleDownloadPayslip = (month: string) => {
    const html = buildPayslipHTML({
      companyName: organization.name,
      employeeName: currentUser.name,
      employeeId: currentUser.employeeId,
      designation: currentUser.designation,
      department: currentUser.department.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      location: currentUser.location,
      month: month.split(' ')[0],
      year: parseInt(month.split(' ')[1]),
      generatedDate: new Date().toLocaleDateString('en-IN'),
      basicSalary: payslip.basicSalary,
      hra: payslip.hra,
      allowances: payslip.allowances,
      grossSalary: payslip.grossSalary,
      esi: payslip.esi,
      pf: payslip.pf,
      tds: payslip.tds,
      professionalTax: payslip.professionalTax,
      totalDeductions: payslip.totalDeductions,
      netSalary: payslip.netSalary,
      bankAccount: payslip.bankAccount,
      panNumber: payslip.panNumber,
      currencySymbol: sym,
      currencyLocale: config.locale,
    });
    downloadHTML(html, `Payslip_${currentUser.employeeId}_${month.replace(' ', '_')}.html`);
    toast.success(`Payslip for ${month} downloaded`);
  };

  const handlePrintPayslip = (month: string) => {
    const html = buildPayslipHTML({
      companyName: organization.name,
      employeeName: currentUser.name,
      employeeId: currentUser.employeeId,
      designation: currentUser.designation,
      department: currentUser.department.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      location: currentUser.location,
      month: month.split(' ')[0],
      year: parseInt(month.split(' ')[1]),
      generatedDate: new Date().toLocaleDateString('en-IN'),
      basicSalary: payslip.basicSalary,
      hra: payslip.hra,
      allowances: payslip.allowances,
      grossSalary: payslip.grossSalary,
      esi: payslip.esi,
      pf: payslip.pf,
      tds: payslip.tds,
      professionalTax: payslip.professionalTax,
      totalDeductions: payslip.totalDeductions,
      netSalary: payslip.netSalary,
      bankAccount: payslip.bankAccount,
      panNumber: payslip.panNumber,
      currencySymbol: sym,
      currencyLocale: config.locale,
    });
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 400); }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <div className="flex items-center space-x-3 mt-2 text-muted-foreground text-sm">
            <span className="flex items-center space-x-1"><Briefcase className="h-3.5 w-3.5" /><span>{currentUser.designation}</span></span>
            <span>·</span>
            <span className="flex items-center space-x-1"><Building2 className="h-3.5 w-3.5" /><span>{currentUser.department.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></span>
            <span>·</span>
            <span className="flex items-center space-x-1"><MapPin className="h-3.5 w-3.5" /><span>{currentUser.location}</span></span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />{currentMonth}
          </Badge>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
            Level {currentUser.approvalLevel} Access
          </Badge>
        </div>
      </div>

      {/* Team Overview — only for management roles */}
      {isTeamRole && teamData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Team Size', value: teamData.headcount, color: 'bg-blue-50 border-blue-200 text-blue-700', icon: Users },
            { label: 'On Leave', value: teamData.onLeave, color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Calendar },
            { label: 'Pending Approvals', value: teamData.pendingApprovals, color: 'bg-red-50 border-red-200 text-red-700', icon: Clock },
            { label: 'Avg Salary', value: fmt(teamData.avgSalary), color: 'bg-green-50 border-green-200 text-green-700', icon: IndianRupee },
          ].map(({ label, value, color, icon: Icon }) => (
            <Card key={label} className={`border ${color}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${color.split(' ')[2]}`}>{label}</p>
                  <p className={`text-2xl font-bold ${color.split(' ')[2]}`}>{value}</p>
                </div>
                <Icon className={`h-7 w-7 opacity-60 ${color.split(' ')[2]}`} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* HR overview */}
      {isHRRole && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Employees', value: '2,847', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'New Joiners (Jul)', value: '47', color: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'Separations (Jul)', value: '12', color: 'bg-red-50 border-red-200 text-red-700' },
            { label: 'On Probation', value: '89', color: 'bg-amber-50 border-amber-200 text-amber-700' },
          ].map(({ label, value, color }) => (
            <Card key={label} className={`border ${color}`}>
              <CardContent className="p-4">
                <p className={`text-xs font-medium ${color.split(' ')[2]}`}>{label}</p>
                <p className={`text-2xl font-bold ${color.split(' ')[2]}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Month Payslip */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">July 2025 Salary Statement</CardTitle>
                  <CardDescription>Latest processed payslip</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Processed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Salary breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide">Earnings</h4>
                  {[
                    ['Basic Salary', payslip.basicSalary],
                    ['HRA', payslip.hra],
                    ['Allowances', payslip.allowances],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span>{fmtFull(Number(val))}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold text-green-700">
                    <span>Gross Salary</span>
                    <span>{fmtFull(payslip.grossSalary)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide">Deductions</h4>
                  {[
                    ['ESI', payslip.esi],
                    ['Provident Fund', payslip.pf],
                    ['TDS', payslip.tds],
                    ['Professional Tax', payslip.professionalTax],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-red-600">{fmtFull(Number(val))}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold text-red-700">
                    <span>Total Deductions</span>
                    <span>{fmtFull(payslip.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net salary */}
              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Net Take-Home</p>
                  <p className="text-2xl font-bold mt-0.5">{fmtFull(payslip.netSalary)}</p>
                </div>
                <div className="text-right text-xs text-blue-200 space-y-1">
                  <p>Bank: {payslip.bankAccount}</p>
                  <p>PAN: {payslip.panNumber}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-1">
                <Button className="flex-1" size="sm" onClick={() => handleDownloadPayslip('July 2025')}>
                  <Download className="h-4 w-4 mr-2" />Download PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePrintPayslip('July 2025')}>
                  <Printer className="h-4 w-4 mr-2" />Print
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.success('Payslip emailed to your registered address')}>
                  <Mail className="h-4 w-4 mr-2" />Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* YTD Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Year-to-Date Summary</CardTitle>
              <CardDescription>FY 2025-26 (April – July 2025)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Gross Earned',    value: fmt(payslip.grossSalary * 4), sub: 'Apr – Jul 2025' },
                  { label: 'TDS Deducted',    value: fmt(payslip.tds * 4),         sub: 'Total so far'   },
                  { label: 'PF Contribution', value: fmt(payslip.pf * 4),          sub: 'Employee share' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-lg font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax Regime: New Regime (FY 2025-26)</span>
                  <span>Projected Annual TDS: {fmt(payslip.tds * 12)}</span>
                </div>
                <Progress value={(4 / 12) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">4 of 12 months processed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Profile Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <User className="h-4 w-4" /><span>My Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ['Employee ID', currentUser.employeeId],
                ['Email', currentUser.email],
                ['Department', currentUser.department.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
                ['Location', currentUser.location],
                ['Joined', new Date(currentUser.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
                ['Cost Center', currentUser.costCenter || '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right truncate max-w-32" title={val}>{val}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Payslips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <FileText className="h-4 w-4" /><span>Recent Payslips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {RECENT_PAYSLIPS.map(month => (
                <div key={month} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{month}</span>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownloadPayslip(month)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handlePrintPayslip(month)}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      title="Print"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {onSectionChange && (
                <button
                  onClick={() => onSectionChange('payslips')}
                  className="w-full text-xs text-primary flex items-center justify-center py-2 hover:underline"
                >
                  View all payslips <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Bell className="h-4 w-4" /><span>Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ANNOUNCEMENTS.map((ann, i) => (
                <div key={i} className={`p-3 rounded-lg border text-xs ${ann.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                  <p className={`font-medium mb-0.5 ${ann.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>{ann.title}</p>
                  <p className={`${ann.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>{ann.body}</p>
                  <p className="text-muted-foreground mt-1">{ann.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      {(isTeamRole || isHRRole) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {isTeamRole && [
                { label: 'Approve Requests', icon: CheckCircle, section: 'approval-workflows', color: 'text-green-600' },
                { label: 'View Team', icon: Users, section: 'employees', color: 'text-blue-600' },
                { label: 'Payslip Management', icon: FileText, section: 'payslips', color: 'text-purple-600' },
                { label: 'Analytics', icon: TrendingUp, section: 'reports', color: 'text-orange-600' },
              ].map(({ label, icon: Icon, section, color }) => (
                <Button key={label} variant="outline" className="h-16 flex-col space-y-1" onClick={() => onSectionChange?.(section)}>
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
              {isHRRole && [
                { label: 'Employee Directory', icon: Users, section: 'employees', color: 'text-blue-600' },
                { label: 'Payslip Management', icon: FileText, section: 'payslips', color: 'text-purple-600' },
                { label: 'Reports', icon: TrendingUp, section: 'reports', color: 'text-orange-600' },
                { label: 'Deductions', icon: IndianRupee, section: 'deductions', color: 'text-red-600' },
              ].map(({ label, icon: Icon, section, color }) => (
                <Button key={label} variant="outline" className="h-16 flex-col space-y-1" onClick={() => onSectionChange?.(section)}>
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
