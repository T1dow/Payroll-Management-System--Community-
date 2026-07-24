import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Calculator,
  Building,
  Bell,
  Database
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { User } from '../App';
import { GeneralSettings } from './settings/GeneralSettings';
import { UserManagement } from './settings/UserManagement';
import { SalaryStructure } from './settings/SalaryStructure';
import { canManageUsers, canManageSystem } from './settings/utils';

interface SettingsProps {
  currentUser: User;
  organization?: unknown;
}

export function Settings({ currentUser }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('general');

  const userCanManageUsers = canManageUsers(currentUser.role);
  const userCanManageSystem = canManageSystem(currentUser.role);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          {userCanManageUsers && (
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          )}
          {userCanManageSystem && (
            <TabsTrigger value="salary" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Salary</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        {userCanManageUsers && (
          <TabsContent value="users">
            <UserManagement canManageUsers={userCanManageUsers} />
          </TabsContent>
        )}

        {userCanManageSystem && (
          <TabsContent value="salary">
            <SalaryStructure />
          </TabsContent>
        )}

        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <p className="text-muted-foreground">
                  Configure password policies, session timeouts, and security preferences.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                <p className="text-muted-foreground">
                  Configure email notifications, alerts, and communication preferences.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">System Integrations</h3>
                <p className="text-muted-foreground">
                  Connect with external systems, APIs, and third-party services.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}