import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useApp } from '../../context/AppContext';
import { PermissionRequest } from '../../types';
import { toast } from 'sonner@2.0.3';
import { CheckCircle, XCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface RequestDetailDialogProps {
  request: PermissionRequest;
  open: boolean;
  onClose: () => void;
  userRole: 'department' | 'security';
}

export function RequestDetailDialog({ request, open, onClose, userRole }: RequestDetailDialogProps) {
  const { updatePermission, addToBlacklist, isBlacklisted } = useApp();
  const [remarks, setRemarks] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showBlacklistConfirm, setShowBlacklistConfirm] = useState(false);

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

  const handleApprove = () => {
    if (userRole === 'department') {
      updatePermission(request.id, {
        status: 'pending_security',
        departmentApproval: {
          approvedBy: 'Department Admin',
          approvedAt: new Date().toISOString(),
          remarks,
        },
      });
      toast.success('Request approved!', {
        description: 'Request has been forwarded to Security Admin for final approval.',
      });
    } else {
      // Security approval handled separately with additional fields
      setIsApproving(true);
    }
    if (!isApproving) {
      onClose();
    }
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const status = userRole === 'department' ? 'rejected_department' : 'rejected_security';
    updatePermission(request.id, {
      status,
      rejection: {
        rejectedBy: userRole === 'department' ? 'Department Admin' : 'Security Admin',
        rejectedAt: new Date().toISOString(),
        reason: remarks,
        rejectedByRole: userRole,
      },
    });

    toast.error('Request rejected', {
      description: 'The visitor has been notified of the rejection.',
    });
    onClose();
  };

  const handleBlacklist = () => {
    const blacklistEntry = {
      id: `BL-${Date.now()}`,
      visitorName: request.visitor.fullName,
      idIqamaNumber: request.visitor.idIqamaNumber,
      vehiclePlate: request.vehicle.plateNumber,
      reason: remarks || 'Security concern',
      blacklistedAt: new Date().toISOString(),
      blacklistedBy: 'Security Admin',
    };

    addToBlacklist(blacklistEntry);
    handleReject();
    toast.error('Visitor blacklisted', {
      description: 'This visitor has been added to the blacklist.',
    });
  };

  const blacklisted = isBlacklisted(request.visitor.idIqamaNumber);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permission Request Details</DialogTitle>
          <DialogDescription>Request ID: {request.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {blacklisted && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This visitor is currently on the blacklist.
              </AlertDescription>
            </Alert>
          )}

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
                <Label className="text-gray-600">Nationality</Label>
                <p>{request.visitor.nationality}</p>
              </div>
              <div>
                <Label className="text-gray-600">Company / Organization</Label>
                <p>{request.visitor.companyOrganization}</p>
              </div>
              <div>
                <Label className="text-gray-600">Department to Visit</Label>
                <p>{getDepartmentName(request.visitor.department)}</p>
              </div>
              <div>
                <Label className="text-gray-600">Submission Date</Label>
                <p>{new Date(request.submissionDate).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Purpose of Visit</Label>
                <p className="mt-1">{request.visitor.purposeOfVisit}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="mb-3">Uploaded Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {request.documents.idIqama && (
                <div>
                  <Label className="text-gray-600">ID / Iqama Document</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => window.open(request.documents.idIqama!, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Document
                  </Button>
                </div>
              )}
              {request.documents.driverLicense && (
                <div>
                  <Label className="text-gray-600">Driver's License</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => window.open(request.documents.driverLicense!, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Document
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          {request.vehicle.hasVehicle && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                      <Label className="text-gray-600">Truck Operation</Label>
                      <p className="capitalize">{request.vehicle.truckOperation?.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>

                {/* Truck Documents */}
                {request.vehicle.vehicleType === 'truck' && request.truckDocuments && (
                  <div className="mt-4">
                    <Label className="text-gray-600 mb-2 block">Safety Documents</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {request.truckDocuments.driverSafetyPhoto && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Driver Safety Attire</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(request.truckDocuments!.driverSafetyPhoto!, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      )}
                      {request.truckDocuments.truckPhoto && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Truck Photo</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(request.truckDocuments!.truckPhoto!, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      )}
                      {request.truckDocuments.safetyEquipmentPhoto && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Safety Equipment</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => window.open(request.truckDocuments!.safetyEquipmentPhoto!, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Car Documents */}
                {request.vehicle.vehicleType === 'car' && request.carDocuments?.vehicleRegistration && (
                  <div className="mt-4">
                    <Label className="text-gray-600">Vehicle Registration</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full max-w-xs"
                      onClick={() => window.open(request.carDocuments!.vehicleRegistration!, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Document
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Approval Status */}
          {(request.departmentApproval || request.rejection) && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3">Approval History</h3>
                {request.departmentApproval && (
                  <div className="bg-green-50 p-4 rounded-lg mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">Approved by Department</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.departmentApproval.approvedBy} -{' '}
                      {new Date(request.departmentApproval.approvedAt).toLocaleString()}
                    </p>
                    {request.departmentApproval.remarks && (
                      <p className="text-sm text-gray-700 mt-2">Remarks: {request.departmentApproval.remarks}</p>
                    )}
                  </div>
                )}
                {request.rejection && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800">Rejected</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.rejection.rejectedBy} - {new Date(request.rejection.rejectedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">Reason: {request.rejection.reason}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions for pending requests */}
          {((userRole === 'department' && request.status === 'pending_department') ||
            (userRole === 'security' && request.status === 'pending_security')) && (
            <>
              <Separator />
              <div>
                <Label htmlFor="remarks">Remarks {isRejecting ? '(Required for rejection)' : '(Optional)'}</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any comments or remarks..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {((userRole === 'department' && request.status === 'pending_department') ||
            (userRole === 'security' && request.status === 'pending_security')) && (
            <>
              {userRole === 'security' && (
                <Button
                  variant="destructive"
                  onClick={() => setShowBlacklistConfirm(true)}
                  disabled={blacklisted}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Blacklist
                </Button>
              )}
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)]"
                onClick={handleApprove}
                disabled={blacklisted}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

        {/* Blacklist Confirmation */}
        {showBlacklistConfirm && (
          <Dialog open={showBlacklistConfirm} onOpenChange={setShowBlacklistConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Blacklist</DialogTitle>
                <DialogDescription>
                  Are you sure you want to blacklist this visitor? This will prevent them from submitting future
                  requests.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBlacklistConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowBlacklistConfirm(false);
                    handleBlacklist();
                  }}
                >
                  Confirm Blacklist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
