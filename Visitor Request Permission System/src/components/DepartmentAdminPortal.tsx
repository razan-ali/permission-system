import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { DepartmentDashboard } from './department/DepartmentDashboard';
import { PendingRequests } from './department/PendingRequests';
import { ApprovedPermissions } from './department/ApprovedPermissions';
import { RejectedPermissions } from './department/RejectedPermissions';

interface DepartmentAdminPortalProps {
  onLogout: () => void;
}

export function DepartmentAdminPortal({ onLogout }: DepartmentAdminPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.licdn.com/dms/image/D4E0BAQFlrP0rYBluLQ/company-logo_200_200/0/1684497488806?e=2147483647&v=beta&t=NTGxPJFUw_eT54zjg__T4fsDXcmXJLkXlnJYwDrewrg"
              alt="Petrolube Logo"
              className="h-12 w-12 object-contain bg-white rounded-lg p-1"
            />
            <div>
              <h1 className="text-white">Department Admin Portal</h1>
              <p className="text-sm text-white/80">Visitor Request Management</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DepartmentDashboard />
          </TabsContent>

          <TabsContent value="pending">
            <PendingRequests />
          </TabsContent>

          <TabsContent value="approved">
            <ApprovedPermissions />
          </TabsContent>

          <TabsContent value="rejected">
            <RejectedPermissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
