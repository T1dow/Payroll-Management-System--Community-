import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { SALARY_COMPONENTS, SalaryComponent } from './constants';

export function SalaryStructure() {
  const [components, setComponents] = useState<SalaryComponent[]>(SALARY_COMPONENTS);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const toggleComponentStatus = (componentId: string) => {
    setComponents(components.map(comp => 
      comp.id === componentId 
        ? { ...comp, status: comp.status === 'active' ? 'inactive' : 'active' } 
        : comp
    ));
  };

  const deleteComponent = (componentId: string) => {
    setComponents(components.filter(comp => comp.id !== componentId));
  };

  const getTypeBadgeColor = (type: 'earning' | 'deduction') => {
    return type === 'earning' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Salary Components</CardTitle>
              <CardDescription>Configure earnings and deduction components</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Salary Component</DialogTitle>
                  <DialogDescription>Create a new salary component</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-name">Component Name</Label>
                    <Input id="comp-name" placeholder="e.g., Travel Allowance" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="comp-type">Type</Label>
                      <Select>
                        <SelectTrigger id="comp-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="earning">Earning</SelectItem>
                          <SelectItem value="deduction">Deduction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comp-formula">Formula</Label>
                      <Input id="comp-formula" placeholder="e.g., 10% of Basic" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddDialog(false)}>
                      Create Component
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(component.type)}>
                      {component.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{component.formula}</TableCell>
                  <TableCell>{getStatusBadge(component.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" aria-label={`Edit ${component.name} component`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch 
                        checked={component.status === 'active'}
                        onCheckedChange={() => toggleComponentStatus(component.id)}
                        aria-label={`Toggle ${component.name} component ${component.status === 'active' ? 'off' : 'on'}`}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteComponent(component.id)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${component.name} component`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Rules</CardTitle>
          <CardDescription>Configure payroll calculation logic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Calculation Rules</h3>
            <p className="text-muted-foreground mb-4">
              Configure complex payroll calculation rules and formulas for your organization.
            </p>
            <Button variant="outline">Configure Rules</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}