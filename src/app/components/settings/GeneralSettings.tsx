import React, { useState } from 'react';
import { Building, Save, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

export function GeneralSettings() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" defaultValue="TechCorp Solutions" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID</Label>
              <Input id="tax-id" defaultValue="12ABCDE3456F7GH" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              defaultValue="123 Business Street, Tech City, TC 12345" 
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" defaultValue="contact@techcorp.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
          </div>
          
          <Button onClick={() => toast.success('Settings saved successfully')}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Configure system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup data daily
              </p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email alerts for important events
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require 2FA for all admin users
              </p>
            </div>
            <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="asia-kolkata">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="america-new_york">America/New_York (EST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import/export and backup operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv,.xlsx,.json';
              input.onchange = () => { if (input.files?.[0]) toast.success(`Importing ${input.files[0].name}…`, { description: 'Data import initiated' }); };
              input.click();
            }}>
              <Upload className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => {
              const blob = new Blob(['System Settings Export\n' + JSON.stringify({ timestamp: new Date().toISOString(), version: '1.0' }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = `Settings_Export_${new Date().toLocaleDateString('en-CA')}.json`; a.click();
              URL.revokeObjectURL(url);
              toast.success('Settings exported as JSON');
            }}>
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => toast.success('Backup initiated', { description: 'Full system backup queued — you will be notified when complete' })}>
              <Building className="h-6 w-6" />
              <span>Backup Now</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}