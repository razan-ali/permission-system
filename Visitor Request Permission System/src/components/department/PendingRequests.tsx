import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApp } from '../../context/AppContext';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { RequestDetailDialog } from './RequestDetailDialog';
import { PermissionRequest } from '../../types';

export function PendingRequests() {
  const { permissions } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);

  const pendingRequests = permissions.filter((p) => p.status === 'pending_department');

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
          <CardTitle>Pending Department Approval</CardTitle>
          <p className="text-sm text-gray-600">
            Review and approve visitor requests for your department
          </p>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending requests</p>
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
                    <TableHead>Submission Date</TableHead>
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
                      <TableCell className="text-sm">{formatDate(request.submissionDate)}</TableCell>
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                          Pending Review
                        </Badge>
                      </TableCell>
                      <TableCell>
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
        <RequestDetailDialog
          request={selectedRequest}
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          userRole="department"
        />
      )}
    </div>
  );
}

function FileCheck(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
