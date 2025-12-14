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
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card } from '../ui/card';
import { useApp } from '../../context/AppContext';
import { PermissionRequest, EntryExitLog } from '../../types';
import { toast } from 'sonner@2.0.3';
import { Download, Upload, Clock, LogIn, LogOut, FileText } from 'lucide-react';

interface ApprovedPermissionDetailDialogProps {
  request: PermissionRequest;
  open: boolean;
  onClose: () => void;
  userRole: 'department' | 'security';
}

export function ApprovedPermissionDetailDialog({
  request,
  open,
  onClose,
  userRole,
}: ApprovedPermissionDetailDialogProps) {
  const { updatePermission } = useApp();
  const [deliveryNoteFiles, setDeliveryNoteFiles] = useState<Record<string, File[]>>({});

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

  const handleDeliveryNoteUpload = (logId: string, files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    setDeliveryNoteFiles((prev) => ({
      ...prev,
      [logId]: [...(prev[logId] || []), ...fileArray],
    }));

    // Update the permission with delivery notes
    const updatedLogs = request.entryExitLogs.map((log) => {
      if (log.id === logId) {
        return {
          ...log,
          deliveryNotes: [...(log.deliveryNotes || []), ...fileArray],
        };
      }
      return log;
    });

    updatePermission(request.id, {
      entryExitLogs: updatedLogs,
    });

    toast.success('Delivery note(s) uploaded successfully');
  };

  const handleDownloadPermit = () => {
    // In a real application, this would generate a PDF
    toast.success('Permit downloaded', {
      description: 'The permit PDF has been generated and downloaded.',
    });
  };

  const canUploadDeliveryNote =
    userRole === 'department' &&
    request.vehicle.vehicleType === 'truck' &&
    (request.vehicle.truckOperation === 'loading' || request.vehicle.truckOperation === 'both');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Approved Permission Details</DialogTitle>
              <DialogDescription>Request ID: {request.id}</DialogDescription>
            </div>
            <Button onClick={handleDownloadPermit} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Permit
            </Button>
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
            <h3 className="mb-3">Visit Period</h3>
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

          {/* Approval Information */}
          <div>
            <h3 className="mb-3">Approval Details</h3>
            <div className="space-y-3">
              {request.departmentApproval && (
                <Card className="p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-600">Department Approval</Label>
                      <p className="text-sm">{request.departmentApproval.approvedBy}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(request.departmentApproval.approvedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Approved</Badge>
                  </div>
                </Card>
              )}
              {request.securityApproval && (
                <Card className="p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-600">Security Approval</Label>
                      <p className="text-sm">{request.securityApproval.approvedBy}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(request.securityApproval.approvedAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Parking: {request.securityApproval.parkingSlotAvailable ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Approved</Badge>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Entry/Exit Logs */}
          <div>
            <h3 className="mb-3">Entry & Exit History</h3>
            {request.entryExitLogs.length === 0 ? (
              <p className="text-sm text-gray-500">No entry/exit records yet</p>
            ) : (
              <div className="space-y-4">
                {request.entryExitLogs.map((log, index) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <h4 className="text-sm">Entry #{index + 1}</h4>
                      </div>
                      {log.exitTime && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <Label className="text-gray-600">Entry Time</Label>
                        <div className="flex items-center gap-2">
                          <LogIn className="h-4 w-4 text-green-600" />
                          <p>{new Date(log.entryTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600">Exit Time</Label>
                        <div className="flex items-center gap-2">
                          <LogOut className="h-4 w-4 text-red-600" />
                          <p>{log.exitTime ? new Date(log.exitTime).toLocaleString() : 'Still on premises'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Notes Section */}
                    {canUploadDeliveryNote && log.exitTime && (
                      <div className="mt-4 pt-4 border-t">
                        <Label className="text-gray-600 mb-2 block flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Delivery Notes
                        </Label>
                        {log.deliveryNotes && log.deliveryNotes.length > 0 && (
                          <div className="mb-3 space-y-1">
                            {log.deliveryNotes.map((note, noteIndex) => (
                              <p key={noteIndex} className="text-sm text-gray-600">
                                ✓ {note.name}
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <label className="flex-1">
                            <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                              <Upload className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {deliveryNoteFiles[log.id]?.length
                                  ? `${deliveryNoteFiles[log.id].length} file(s) selected`
                                  : 'Upload Delivery Note(s)'}
                              </span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*,application/pdf"
                              onChange={(e) => handleDeliveryNoteUpload(log.id, e.target.files)}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
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
