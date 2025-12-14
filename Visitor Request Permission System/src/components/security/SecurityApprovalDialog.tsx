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
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription } from '../ui/alert';
import { useApp } from '../../context/AppContext';
import { PermissionRequest } from '../../types';
import { toast } from 'sonner@2.0.3';
import { CheckCircle, XCircle, ExternalLink, AlertTriangle, Calendar } from 'lucide-react';

interface SecurityApprovalDialogProps {
  request: PermissionRequest;
  open: boolean;
  onClose: () => void;
}

export function SecurityApprovalDialog({ request, open, onClose }: SecurityApprovalDialogProps) {
  const { updatePermission, addToBlacklist, isBlacklisted } = useApp();
  
  const [approvalDate, setApprovalDate] = useState('');
  const [parkingSlotAvailable, setParkingSlotAvailable] = useState<string>('yes');
  const [securityRemarks, setSecurityRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [visitStartDate, setVisitStartDate] = useState('');
  const [visitEndDate, setVisitEndDate] = useState('');
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
    if (!approvalDate || !visitStartDate || !visitEndDate) {
      toast.error('Please fill in all required approval fields');
      return;
    }

    updatePermission(request.id, {
      status: 'approved',
      securityApproval: {
        approvedBy: 'Security Admin',
        approvedAt: new Date().toISOString(),
        approvalDate,
        parkingSlotAvailable: parkingSlotAvailable === 'yes',
        remarks: securityRemarks,
      },
      visitStartDate,
      visitEndDate,
    });

    toast.success('Permission fully approved!', {
      description: 'Visitor can now access the facility during the approved period.',
    });
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    updatePermission(request.id, {
      status: 'rejected_security',
      rejection: {
        rejectedBy: 'Security Admin',
        rejectedAt: new Date().toISOString(),
        reason: rejectionReason,
        rejectedByRole: 'security',
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
      reason: rejectionReason || 'Security concern',
      blacklistedAt: new Date().toISOString(),
      blacklistedBy: 'Security Admin',
    };

    addToBlacklist(blacklistEntry);
    handleReject();
    toast.error('Visitor blacklisted', {
      description: 'This visitor has been added to the blacklist and rejected.',
    });
  };

  const blacklisted = isBlacklisted(request.visitor.idIqamaNumber);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Security Approval Review</DialogTitle>
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

            {/* Department Approval Info */}
            {request.departmentApproval && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-3">Department Approval</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">Approved by {request.departmentApproval.approvedBy}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(request.departmentApproval.approvedAt).toLocaleString()}
                    </p>
                    {request.departmentApproval.remarks && (
                      <p className="text-sm text-gray-700 mt-2">
                        Remarks: {request.departmentApproval.remarks}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Security Approval Fields */}
            <div>
              <h3 className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Security Approval Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visitStartDate">
                      Visit Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="visitStartDate"
                      type="date"
                      value={visitStartDate}
                      onChange={(e) => setVisitStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visitEndDate">
                      Visit End Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="visitEndDate"
                      type="date"
                      value={visitEndDate}
                      onChange={(e) => setVisitEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="approvalDate">
                    Approval Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="approvalDate"
                    type="date"
                    value={approvalDate}
                    onChange={(e) => setApprovalDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Parking Slot Available? <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={parkingSlotAvailable} onValueChange={setParkingSlotAvailable} className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="parking-yes" />
                      <Label htmlFor="parking-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="parking-no" />
                      <Label htmlFor="parking-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="securityRemarks">Security Remarks (Optional)</Label>
                  <Textarea
                    id="securityRemarks"
                    value={securityRemarks}
                    onChange={(e) => setSecurityRemarks(e.target.value)}
                    placeholder="Add any security-related comments..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="rejectionReason">Rejection Reason (Required for reject/blacklist)</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason if rejecting..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowBlacklistConfirm(true)}
              disabled={blacklisted}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Blacklist & Reject
            </Button>
            <Button variant="outline" onClick={handleReject}>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blacklist Confirmation */}
      <Dialog open={showBlacklistConfirm} onOpenChange={setShowBlacklistConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Blacklist</DialogTitle>
            <DialogDescription>
              Are you sure you want to blacklist this visitor? This will prevent them from submitting future
              requests and automatically reject this request.
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
    </>
  );
}
