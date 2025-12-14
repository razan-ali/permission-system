import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApp } from '../../context/AppContext';
import { Eye, Download, Upload } from 'lucide-react';
import { ApprovedPermissionDetailDialog } from './ApprovedPermissionDetailDialog';
import { PermissionRequest } from '../../types';

export function ApprovedPermissions() {
  const { permissions } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);

  const approvedRequests = permissions.filter((p) => p.status === 'approved');

  const getDepartmentName = (dept: string) => {
    const names: Record<string, string> = {
      shipping: 'Shipping',
      raw_material: 'Raw Material',
      lab: 'Lab',
      coordinator: 'Coordinator',
      bulk_oil: 'Bulk Oil',
    };
    return names[dept] || dept;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fully Approved Permissions</CardTitle>
          <p className="text-sm text-gray-600">
            View and manage approved visitor permissions
          </p>
        </CardHeader>
        <CardContent>
          {approvedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No approved permissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission ID</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Visit Period</TableHead>
                    <TableHead>Entry Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.visitor.fullName}</TableCell>
                      <TableCell>{getDepartmentName(request.visitor.department)}</TableCell>
                      <TableCell>
                        {request.vehicle.hasVehicle ? (
                          <Badge variant="outline" className="capitalize">
                            {request.vehicle.vehicleType}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">No vehicle</span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {request.vehicle.vehicleType === 'truck'
                          ? request.vehicle.truckOperation?.replace('_', ' ')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{request.vehicle.plateNumber || 'N/A'}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(request.visitStartDate)} - {formatDate(request.visitEndDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{request.entryExitLogs.length}</Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          onClick={() => setSelectedRequest(request)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <ApprovedPermissionDetailDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          userRole="department"
        />
      )}
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
