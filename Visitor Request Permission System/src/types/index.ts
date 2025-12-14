// Type definitions for the Visitor Permission System

export type UserType = 'department' | 'security' | null;

export type PermissionStatus = 
  | 'pending_department' 
  | 'pending_security' 
  | 'approved' 
  | 'rejected_department' 
  | 'rejected_security';

export type VehicleType = 'truck' | 'car' | null;

export type TruckOperation = 'loading' | 'unloading' | 'both';

export type Department = 'shipping' | 'raw_material' | 'lab' | 'coordinator' | 'bulk_oil';

export interface VisitorInfo {
  fullName: string;
  idIqamaNumber: string;
  nationality: string;
  companyOrganization: string;
  department: Department;
  purposeOfVisit: string;
}

export interface DocumentUploads {
  idIqama: File | null;
  driverLicense?: File | null;
}

export interface VehicleInfo {
  hasVehicle: boolean;
  vehicleType?: VehicleType;
  plateNumber?: string;
  truckOperation?: TruckOperation;
  // Truck uploads
  driverSafetyPhoto?: File | null;
  truckPhoto?: File | null;
  safetyEquipmentPhoto?: File | null;
  // Car uploads
  vehicleRegistration?: File | null;
}

export interface EntryExitLog {
  id: string;
  entryTime: string;
  exitTime?: string;
  deliveryNotes?: File[];
}

export interface PermissionRequest {
  id: string;
  submissionDate: string;
  status: PermissionStatus;
  visitor: VisitorInfo;
  documents: {
    idIqama: string | null;
    driverLicense: string | null;
  };
  vehicle: VehicleInfo;
  truckDocuments?: {
    driverSafetyPhoto: string | null;
    truckPhoto: string | null;
    safetyEquipmentPhoto: string | null;
  };
  carDocuments?: {
    vehicleRegistration: string | null;
  };
  // Approval data
  departmentApproval?: {
    approvedBy: string;
    approvedAt: string;
    remarks?: string;
  };
  securityApproval?: {
    approvedBy: string;
    approvedAt: string;
    approvalDate: string;
    parkingSlotAvailable: boolean;
    remarks?: string;
  };
  rejection?: {
    rejectedBy: string;
    rejectedAt: string;
    reason: string;
    rejectedByRole: 'department' | 'security';
  };
  // Entry/Exit tracking
  entryExitLogs: EntryExitLog[];
  // Validity period
  visitStartDate?: string;
  visitEndDate?: string;
}

export interface BlacklistEntry {
  id: string;
  visitorName: string;
  idIqamaNumber: string;
  vehiclePlate?: string;
  reason: string;
  blacklistedAt: string;
  blacklistedBy: string;
}
