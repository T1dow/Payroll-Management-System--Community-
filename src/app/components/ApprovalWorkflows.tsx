import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, Filter, ChevronDown } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { User, Organization } from '../App';

interface ApprovalWorkflowsProps {
  currentUser: User;
  organization: Organization;
}

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

interface ApprovalRequest {
  id: string;
  type: 'payroll-run' | 'salary-revision' | 'bonus-payout' | 'advance-payment';
  description: string;
  requestedBy: string;
  requestedOn: string;
  amount: number;
  department: string;
  location: string;
  employeeCount: number;
  currentLevel: number;
  requiredLevel: number;
  status: ApprovalStatus;
  priority: 'critical' | 'high' | 'medium' | 'low';
  approvalChain: { level: number; role: string; approver?: string; status: 'approved' | 'pending' | 'skipped'; date?: string }[];
}

const mockRequests: ApprovalRequest[] = [
  {
    id: 'APR-2025-0047',
    type: 'payroll-run',
    description: 'July 2025 Monthly Payroll - All Employees',
    requestedBy: 'Payroll Admin',
    requestedOn: '2025-07-28',
    amount: 44890750,
    department: 'All Departments',
    location: 'All Locations',
    employeeCount: 2847,
    currentLevel: 3,
    requiredLevel: 4,
    status: 'pending',
    priority: 'critical',
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Suresh Nair', status: 'approved', date: '2025-07-28' },
      { level: 2, role: 'Accounts Manager', approver: 'Meena Iyer', status: 'approved', date: '2025-07-29' },
      { level: 3, role: 'AGM Accounts', approver: 'Vijay Sharma', status: 'approved', date: '2025-07-30' },
      { level: 4, role: 'GM Accounts', status: 'pending' },
      { level: 5, role: 'CFO', status: 'pending' },
    ]
  },
  {
    id: 'APR-2025-0046',
    type: 'bonus-payout',
    description: 'Q1 FY26 Performance Bonus - Engineering Dept',
    requestedBy: 'HR Manager',
    requestedOn: '2025-07-25',
    amount: 3500000,
    department: 'Engineering',
    location: 'Bangalore',
    employeeCount: 145,
    currentLevel: 2,
    requiredLevel: 3,
    status: 'pending',
    priority: 'high',
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Suresh Nair', status: 'approved', date: '2025-07-25' },
      { level: 2, role: 'Accounts Manager', approver: 'Meena Iyer', status: 'approved', date: '2025-07-26' },
      { level: 3, role: 'AGM Accounts', status: 'pending' },
    ]
  },
  {
    id: 'APR-2025-0045',
    type: 'salary-revision',
    description: 'Annual Increment - Delhi Office Employees',
    requestedBy: 'HR Head',
    requestedOn: '2025-07-20',
    amount: 1200000,
    department: 'Multiple',
    location: 'Delhi',
    employeeCount: 89,
    currentLevel: 4,
    requiredLevel: 4,
    status: 'approved',
    priority: 'medium',
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Suresh Nair', status: 'approved', date: '2025-07-20' },
      { level: 2, role: 'Accounts Manager', approver: 'Meena Iyer', status: 'approved', date: '2025-07-21' },
      { level: 3, role: 'AGM Accounts', approver: 'Vijay Sharma', status: 'approved', date: '2025-07-22' },
      { level: 4, role: 'GM Accounts', approver: 'Rajesh Kumar', status: 'approved', date: '2025-07-23' },
    ]
  },
  {
    id: 'APR-2025-0044',
    type: 'advance-payment',
    description: 'Salary Advance - Emergency Medical - Employee TC-2022-0458',
    requestedBy: 'HR Executive',
    requestedOn: '2025-07-18',
    amount: 85000,
    department: 'Operations',
    location: 'Chennai',
    employeeCount: 1,
    currentLevel: 2,
    requiredLevel: 2,
    status: 'approved',
    priority: 'high',
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Suresh Nair', status: 'approved', date: '2025-07-18' },
      { level: 2, role: 'Accounts Manager', approver: 'Meena Iyer', status: 'approved', date: '2025-07-18' },
    ]
  },
  {
    id: 'APR-2025-0043',
    type: 'payroll-run',
    description: 'June 2025 Supplementary Payroll - Missed Deductions',
    requestedBy: 'Accounts Executive',
    requestedOn: '2025-07-15',
    amount: 234000,
    department: 'Multiple',
    location: 'Multiple',
    employeeCount: 23,
    currentLevel: 1,
    requiredLevel: 3,
    status: 'rejected',
    priority: 'medium',
    approvalChain: [
      { level: 1, role: 'Payroll Admin', approver: 'Suresh Nair', status: 'approved', date: '2025-07-15' },
      { level: 2, role: 'Accounts Manager', approver: 'Meena Iyer', status: 'approved', date: '2025-07-16' },
      { level: 3, role: 'AGM Accounts', approver: 'Vijay Sharma', status: 'skipped', date: '2025-07-17' },
    ]
  }
];

const workflowRuleBands = [
  { amountFrom: 0,        amountTo: 500000,   levels: ['Payroll Admin', 'Accounts Manager'], approvalCount: 2 },
  { amountFrom: 500000,   amountTo: 2500000,  levels: ['Payroll Admin', 'Accounts Manager', 'AGM Accounts'], approvalCount: 3 },
  { amountFrom: 2500000,  amountTo: 10000000, levels: ['Payroll Admin', 'Accounts Manager', 'AGM Accounts', 'GM Accounts'], approvalCount: 4 },
  { amountFrom: 10000000, amountTo: Infinity, levels: ['Payroll Admin', 'Accounts Manager', 'AGM Accounts', 'GM Accounts', 'CFO'], approvalCount: 5 },
];

export function ApprovalWorkflows({ currentUser, organization }: ApprovalWorkflowsProps) {
  const { fmt, fmtFull } = useCurrency();

  // Build rule descriptions dynamically so they reflect the active currency
  const workflowRules = workflowRuleBands.map(r => ({
    ...r,
    description: r.amountTo === Infinity
      ? `Above ${fmt(r.amountFrom)}`
      : r.amountFrom === 0
      ? `Up to ${fmt(r.amountTo)}`
      : `${fmt(r.amountFrom)} – ${fmt(r.amountTo)}`,
  }));

  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const canApprove = (request: ApprovalRequest) => request.currentLevel <= currentUser.approvalLevel && request.status === 'pending';

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updatedChain = r.approvalChain.map(a => {
        if (a.level === r.currentLevel + 1 && a.status === 'pending') {
          return { ...a, status: 'approved' as const, approver: currentUser.name, date: new Date().toISOString().split('T')[0] };
        }
        return a;
      });
      const newLevel = r.currentLevel + 1;
      const isComplete = newLevel >= r.requiredLevel;
      return { ...r, approvalChain: updatedChain, currentLevel: newLevel, status: isComplete ? 'approved' as const : 'pending' as const };
    }));
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchType = filterType === 'all' || r.type === filterType;
    return matchStatus && matchType;
  });

  const statusBadge = (status: ApprovalStatus) => {
    const map: Record<ApprovalStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      escalated: 'bg-purple-100 text-purple-800'
    };
    return <Badge className={map[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const priorityBadge = (priority: string) => {
    const map: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={map[priority]}>{priority}</Badge>;
  };

  const typeLabel = (type: string) => {
    const map: Record<string, string> = {
      'payroll-run': 'Payroll Run',
      'salary-revision': 'Salary Revision',
      'bonus-payout': 'Bonus Payout',
      'advance-payment': 'Advance Payment'
    };
    return map[type] || type;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Approval Workflows</h1>
          <p className="text-muted-foreground">Multi-level payroll approval management • Your Level: {currentUser.approvalLevel}</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Clock className="h-3 w-3 mr-1" />
          {pendingRequests.length} Pending Approvals
        </Badge>
      </div>

      {pendingRequests.some(r => canApprove(r)) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{pendingRequests.filter(r => canApprove(r)).length} request(s)</strong> require your approval at Level {currentUser.approvalLevel}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([['pending', 'Pending', 'bg-yellow-50 border-yellow-200', 'text-yellow-700'],
           ['approved', 'Approved', 'bg-green-50 border-green-200', 'text-green-700'],
           ['rejected', 'Rejected', 'bg-red-50 border-red-200', 'text-red-700'],
           ['all', 'Total', 'bg-blue-50 border-blue-200', 'text-blue-700']] as const).map(([status, label, bg, textColor]) => (
          <Card key={status} className={`border ${bg}`}>
            <CardContent className="p-4">
              <p className={`text-sm ${textColor}`}>{label}</p>
              <p className={`text-2xl font-bold ${textColor}`}>
                {status === 'all' ? requests.length : requests.filter(r => r.status === status).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Approval Requests</TabsTrigger>
          <TabsTrigger value="rules">Workflow Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payroll-run">Payroll Run</SelectItem>
                <SelectItem value="salary-revision">Salary Revision</SelectItem>
                <SelectItem value="bonus-payout">Bonus Payout</SelectItem>
                <SelectItem value="advance-payment">Advance Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type & Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Approval Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-sm">{req.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{typeLabel(req.type)}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-48">{req.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{fmt(req.amount)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{req.requestedBy}</p>
                          <p className="text-xs text-muted-foreground">{req.requestedOn}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {req.approvalChain.map((a) => (
                            <div
                              key={a.level}
                              title={`Level ${a.level}: ${a.role}${a.approver ? ` (${a.approver})` : ''}`}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                a.status === 'approved' ? 'bg-green-500 text-white' :
                                a.status === 'skipped' ? 'bg-red-500 text-white' :
                                'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {a.level}
                            </div>
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {req.approvalChain.filter(a => a.status === 'approved').length}/{req.requiredLevel}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{priorityBadge(req.priority)}</TableCell>
                      <TableCell>{statusBadge(req.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(req)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canApprove(req) && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 px-2" onClick={() => handleApprove(req.id)}>
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 px-2" onClick={() => handleReject(req.id)}>
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </>
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

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Approval Threshold Rules</CardTitle>
              <CardDescription>Multi-level approval requirements based on payroll amount thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowRules.map((rule, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{rule.description}</h4>
                      <Badge variant="outline">{rule.approvalCount} Approvals Required</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rule.levels.map((level, li) => (
                        <React.Fragment key={level}>
                          <div className="flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">{li + 1}</span>
                            <span className="text-sm text-blue-800">{level}</span>
                          </div>
                          {li < rule.levels.length - 1 && <ChevronDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRequest.id} — {typeLabel(selectedRequest.type)}</DialogTitle>
                <DialogDescription>{selectedRequest.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-bold ml-1">{fmtFull(selectedRequest.amount)}</span></div>
                  <div><span className="text-muted-foreground">Employees:</span> <span className="font-medium ml-1">{selectedRequest.employeeCount}</span></div>
                  <div><span className="text-muted-foreground">Department:</span> <span className="font-medium ml-1">{selectedRequest.department}</span></div>
                  <div><span className="text-muted-foreground">Location:</span> <span className="font-medium ml-1">{selectedRequest.location}</span></div>
                  <div><span className="text-muted-foreground">Requested By:</span> <span className="font-medium ml-1">{selectedRequest.requestedBy}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium ml-1">{selectedRequest.requestedOn}</span></div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Approval Chain Progress</h4>
                  <div className="space-y-2">
                    {selectedRequest.approvalChain.map((a) => (
                      <div key={a.level} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            a.status === 'approved' ? 'bg-green-100 text-green-700' :
                            a.status === 'skipped' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>{a.level}</div>
                          <div>
                            <p className="font-medium text-sm">{a.role}</p>
                            {a.approver && <p className="text-xs text-muted-foreground">{a.approver}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {a.date && <span className="text-xs text-muted-foreground">{a.date}</span>}
                          {a.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {a.status === 'skipped' && <XCircle className="h-4 w-4 text-red-600" />}
                          {a.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {canApprove(selectedRequest) && (
                  <div className="flex space-x-3 pt-2">
                    <Button className="flex-1" onClick={() => handleApprove(selectedRequest.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedRequest.id)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
