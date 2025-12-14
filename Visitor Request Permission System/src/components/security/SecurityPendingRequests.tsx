import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApp } from '../../context/AppContext';
import { Eye } from 'lucide-react';
import { SecurityApprovalDialog } from './SecurityApprovalDialog';
import { PermissionRequest } from '../../types';

export function SecurityPendingRequests() {
  const { permissions } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);

  const pendingRequests = permissions.filter((p) => p.status === 'pending_security');

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Security Approval</CardTitle>
          <p className="text-sm text-gray-600">
            Review requests approved by department admins and make final approval decision
          </p>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending security approvals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Dept. Approved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.visitor.fullName}</TableCell>
                      <TableCell>{getDepartmentName(request.visitor.department)}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.visitor.purposeOfVisit}</TableCell>
                      <TableCell>
                        {request.vehicle.hasVehicle ? (
                          <Badge variant="outline" className="capitalize">
                            {request.vehicle.vehicleType}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">No vehicle</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {request.departmentApproval
                          ? formatDate(request.departmentApproval.approvedAt)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Pending Security
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setSelectedRequest(request)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review
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
        <SecurityApprovalDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
