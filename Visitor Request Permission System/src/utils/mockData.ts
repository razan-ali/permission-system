import { PermissionRequest } from '../types';

// Mock data for demonstration purposes
export const mockPermissions: PermissionRequest[] = [
  {
    id: 'REQ-1000',
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'pending_department',
    visitor: {
      fullName: 'Ahmed Mohammed Al-Rashid',
      idIqamaNumber: '2345678901',
      nationality: 'Saudi Arabia',
      companyOrganization: 'Al-Rashid Trading Co.',
      department: 'shipping',
      purposeOfVisit: 'Delivery of raw materials shipment - 20 tons of lubricant base oil',
    },
    documents: {
      idIqama: 'https://via.placeholder.com/400x300/326337/ffffff?text=ID+Document',
      driverLicense: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=Driver+License',
    },
    vehicle: {
      hasVehicle: true,
      vehicleType: 'truck',
      plateNumber: 'KSA-7845',
      truckOperation: 'unloading',
    },
    truckDocuments: {
      driverSafetyPhoto: 'https://via.placeholder.com/400x300/326337/ffffff?text=Safety+Attire',
      truckPhoto: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=Truck+Photo',
      safetyEquipmentPhoto: 'https://via.placeholder.com/400x300/326337/ffffff?text=Safety+Equipment',
    },
    entryExitLogs: [],
  },
  {
    id: 'REQ-1001',
    submissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'pending_security',
    visitor: {
      fullName: 'John Smith',
      idIqamaNumber: '3456789012',
      nationality: 'United States',
      companyOrganization: 'Global Tech Solutions',
      department: 'lab',
      purposeOfVisit: 'Quality inspection and testing of lubricant samples for certification',
    },
    documents: {
      idIqama: 'https://via.placeholder.com/400x300/326337/ffffff?text=Passport',
      driverLicense: null,
    },
    vehicle: {
      hasVehicle: false,
    },
    departmentApproval: {
      approvedBy: 'Lab Manager',
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      remarks: 'Approved for quality testing. Please escort to lab facility.',
    },
    entryExitLogs: [],
  },
  {
    id: 'REQ-1002',
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    visitor: {
      fullName: 'Fatima Hassan',
      idIqamaNumber: '4567890123',
      nationality: 'Saudi Arabia',
      companyOrganization: 'Saudi Logistics Express',
      department: 'bulk_oil',
      purposeOfVisit: 'Bulk oil loading for export shipment to Dubai',
    },
    documents: {
      idIqama: 'https://via.placeholder.com/400x300/326337/ffffff?text=Iqama',
      driverLicense: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=License',
    },
    vehicle: {
      hasVehicle: true,
      vehicleType: 'truck',
      plateNumber: 'KSA-9012',
      truckOperation: 'loading',
    },
    truckDocuments: {
      driverSafetyPhoto: 'https://via.placeholder.com/400x300/326337/ffffff?text=Driver+Safety',
      truckPhoto: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=Truck',
      safetyEquipmentPhoto: 'https://via.placeholder.com/400x300/326337/ffffff?text=Equipment',
    },
    departmentApproval: {
      approvedBy: 'Bulk Oil Manager',
      approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      remarks: 'Approved for loading operations. Standard safety protocols apply.',
    },
    securityApproval: {
      approvedBy: 'Security Chief',
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      approvalDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      parkingSlotAvailable: true,
      remarks: 'Parking bay 12 assigned. Valid for 3 days.',
    },
    visitStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    visitEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    entryExitLogs: [
      {
        id: 'LOG-001',
        entryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
        deliveryNotes: [],
      },
      {
        id: 'LOG-002',
        entryTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
        deliveryNotes: [],
      },
    ],
  },
  {
    id: 'REQ-1003',
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'rejected_department',
    visitor: {
      fullName: 'Michael Chen',
      idIqamaNumber: '5678901234',
      nationality: 'China',
      companyOrganization: 'Asia Pacific Imports',
      department: 'raw_material',
      purposeOfVisit: 'Inspection of raw material storage facilities',
    },
    documents: {
      idIqama: 'https://via.placeholder.com/400x300/326337/ffffff?text=Passport',
      driverLicense: null,
    },
    vehicle: {
      hasVehicle: false,
    },
    rejection: {
      rejectedBy: 'Raw Material Manager',
      rejectedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Incomplete documentation. No prior authorization from head office.',
      rejectedByRole: 'department',
    },
    entryExitLogs: [],
  },
  {
    id: 'REQ-1004',
    submissionDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    status: 'pending_department',
    visitor: {
      fullName: 'Sara Abdullah',
      idIqamaNumber: '6789012345',
      nationality: 'Saudi Arabia',
      companyOrganization: 'Saudi Maintenance Services',
      department: 'coordinator',
      purposeOfVisit: 'Routine maintenance check of fire safety equipment',
    },
    documents: {
      idIqama: 'https://via.placeholder.com/400x300/326337/ffffff?text=Iqama',
      driverLicense: 'https://via.placeholder.com/400x300/4ade80/ffffff?text=License',
    },
    vehicle: {
      hasVehicle: true,
      vehicleType: 'car',
      plateNumber: 'KSA-3456',
    },
    carDocuments: {
      vehicleRegistration: 'https://via.placeholder.com/400x300/326337/ffffff?text=Registration',
    },
    entryExitLogs: [],
  },
];
