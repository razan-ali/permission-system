import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';
import { useApp } from '../../context/AppContext';
import { PermissionRequest, EntryExitLog } from '../../types';
import { toast } from 'sonner@2.0.3';
import { Download, Clock, LogIn, LogOut, FileText, Plus } from 'lucide-react';

interface SecurityApprovedDetailDialogProps {
  request: PermissionRequest;
  open: boolean;
  onClose: () => void;
}

export function SecurityApprovedDetailDialog({
  request,
  open,
  onClose,
}: SecurityApprovedDetailDialogProps) {
  const { updatePermission } = useApp();

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

  const handleAddEntry = () => {
    const newLog: EntryExitLog = {
      id: `LOG-${Date.now()}`,
      entryTime: new Date().toISOString(),
    };

    updatePermission(request.id, {
      entryExitLogs: [...request.entryExitLogs, newLog],
    });

    toast.success('Entry time recorded', {
      description: `${request.visitor.fullName} has entered the facility.`,
    });
  };

  const handleAddExit = (logId: string) => {
    const updatedLogs = request.entryExitLogs.map((log) => {
      if (log.id === logId && !log.exitTime) {
        return {
          ...log,
          exitTime: new Date().toISOString(),
        };
      }
      return log;
    });

    updatePermission(request.id, {
      entryExitLogs: updatedLogs,
    });

    toast.success('Exit time recorded', {
      description: `${request.visitor.fullName} has exited the facility.`,
    });
  };

  const handleDownloadPermit = () => {
    toast.success('Permit downloaded', {
      description: 'The permit PDF has been generated and downloaded.',
    });
  };

  const hasActiveEntry = request.entryExitLogs.some((log) => !log.exitTime);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Approved Permission - Entry/Exit Management</DialogTitle>
              <DialogDescription>Request ID: {request.id}</DialogDescription>
            </div>
            <div className="flex gap-2">
              {hasActiveEntry ? (
                <Badge className="bg-green-600">Currently On Premises</Badge>
              ) : (
                <Badge variant="outline">Not On Site</Badge>
              )}
              <Button onClick={handleDownloadPermit} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Permit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visitor Information */}
          <div>
            <h3 className="mb-3">Visitor Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Full Name</Label>
                <p>{request.visitor.fullName}</p>
              </div>
              <div>
                <Label className="text-gray-600">ID / Iqama Number</Label>
                <p>{request.visitor.idIqamaNumber}</p>
              </div>
              <div>
                <Label className="text-gray-600">Company / Organization</Label>
                <p>{request.visitor.companyOrganization}</p>
              </div>
              <div>
                <Label className="text-gray-600">Department</Label>
                <p>{getDepartmentName(request.visitor.department)}</p>
              </div>
              <div>
                <Label className="text-gray-600">Purpose of Visit</Label>
                <p>{request.visitor.purposeOfVisit}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          {request.vehicle.hasVehicle && (
            <>
              <div>
                <h3 className="mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Vehicle Type</Label>
                    <p className="capitalize">{request.vehicle.vehicleType}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Plate Number</Label>
                    <p>{request.vehicle.plateNumber}</p>
                  </div>
                  {request.vehicle.vehicleType === 'truck' && (
                    <div>
                      <Label className="text-gray-600">Operation</Label>
                      <p className="capitalize">{request.vehicle.truckOperation?.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Visit Period */}
          <div>
            <h3 className="mb-3">Authorized Visit Period</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Start Date</Label>
                <p>{request.visitStartDate ? new Date(request.visitStartDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-600">End Date</Label>
                <p>{request.visitEndDate ? new Date(request.visitEndDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Entry/Exit Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Entry & Exit Management
              </h3>
              <Button onClick={handleAddEntry} size="sm" className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)]">
                <Plus className="mr-2 h-4 w-4" />
                Record Entry
              </Button>
            </div>

            {request.entryExitLogs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No entry/exit records yet. Click "Record Entry" to log the first entry.
              </p>
            ) : (
              <div className="space-y-4">
                {request.entryExitLogs.map((log, index) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <h4 className="text-sm">Visit #{index + 1}</h4>
                      </div>
                      {log.exitTime ? (
                        <Badge variant="secondary">Completed</Badge>
                      ) : (
                        <Badge className="bg-green-600">In Progress</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Entry Time</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <LogIn className="h-4 w-4 text-green-600" />
                          <p>{new Date(log.entryTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600">Exit Time</Label>
                        {log.exitTime ? (
                          <div className="flex items-center gap-2 mt-1">
                            <LogOut className="h-4 w-4 text-red-600" />
                            <p>{new Date(log.exitTime).toLocaleString()}</p>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleAddExit(log.id)}
                            size="sm"
                            variant="outline"
                            className="mt-1"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Record Exit
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Show delivery notes if uploaded by department */}
                    {request.vehicle.vehicleType === 'truck' &&
                      (request.vehicle.truckOperation === 'loading' ||
                        request.vehicle.truckOperation === 'both') &&
                      log.exitTime &&
                      log.deliveryNotes &&
                      log.deliveryNotes.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <Label className="text-gray-600 mb-2 block flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Delivery Notes (Uploaded by Department)
                          </Label>
                          <div className="space-y-1">
                            {log.deliveryNotes.map((note, noteIndex) => (
                              <p key={noteIndex} className="text-sm text-gray-600">
                                ✓ {note.name}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Approval Information */}
          <div>
            <h3 className="mb-3">Approval History</h3>
            <div className="space-y-3">
              {request.departmentApproval && (
                <Card className="p-4 bg-green-50">
                  <div>
                    <Label className="text-gray-600">Department Approval</Label>
                    <p className="text-sm">{request.departmentApproval.approvedBy}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(request.departmentApproval.approvedAt).toLocaleString()}
                    </p>
                    {request.departmentApproval.remarks && (
                      <p className="text-xs text-gray-700 mt-2">
                        Remarks: {request.departmentApproval.remarks}
                      </p>
                    )}
                  </div>
                </Card>
              )}
              {request.securityApproval && (
                <Card className="p-4 bg-green-50">
                  <div>
                    <Label className="text-gray-600">Security Approval</Label>
                    <p className="text-sm">{request.securityApproval.approvedBy}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(request.securityApproval.approvedAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Parking: {request.securityApproval.parkingSlotAvailable ? 'Available' : 'Not Available'}
                    </p>
                    {request.securityApproval.remarks && (
                      <p className="text-xs text-gray-700 mt-2">
                        Remarks: {request.securityApproval.remarks}
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
