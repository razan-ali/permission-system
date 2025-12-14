import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApp } from '../../context/AppContext';
import { Eye, XCircle } from 'lucide-react';
import { RequestDetailDialog } from './RequestDetailDialog';
import { PermissionRequest } from '../../types';

export function RejectedPermissions() {
  const { permissions } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null);

  const rejectedRequests = permissions.filter(
    (p) => p.status === 'rejected_department' || p.status === 'rejected_security'
  );

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
          <CardTitle>Rejected Permissions</CardTitle>
          <p className="text-sm text-gray-600">
            View requests that were rejected by department or security admin
          </p>
        </CardHeader>
        <CardContent>
          {rejectedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No rejected requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Rejected By</TableHead>
                    <TableHead>Rejection Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedRequests.map((request) => (
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
                      <TableCell className="text-sm">{formatDate(request.submissionDate)}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="capitalize">
                          {request.rejection?.rejectedByRole}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.rejection?.reason}
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
