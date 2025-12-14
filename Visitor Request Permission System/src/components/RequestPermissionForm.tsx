import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PermissionRequest, Department, VehicleType, TruckOperation } from '../types';

interface RequestPermissionFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function RequestPermissionForm({ onBack, onSuccess }: RequestPermissionFormProps) {
  const { addPermission, isBlacklisted } = useApp();

  // Visitor Information
  const [fullName, setFullName] = useState('');
  const [idIqama, setIdIqama] = useState('');
  const [nationality, setNationality] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [purpose, setPurpose] = useState('');

  // Documents
  const [idIqamaDoc, setIdIqamaDoc] = useState<File | null>(null);
  const [driverLicense, setDriverLicense] = useState<File | null>(null);

  // Vehicle
  const [hasVehicle, setHasVehicle] = useState<string>('no');
  const [vehicleType, setVehicleType] = useState<VehicleType>(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [truckOperation, setTruckOperation] = useState<TruckOperation | ''>('');

  // Truck Documents
  const [driverSafetyPhoto, setDriverSafetyPhoto] = useState<File | null>(null);
  const [truckPhoto, setTruckPhoto] = useState<File | null>(null);
  const [safetyEquipmentPhoto, setSafetyEquipmentPhoto] = useState<File | null>(null);

  // Car Documents
  const [vehicleRegistration, setVehicleRegistration] = useState<File | null>(null);

  const handleFileChange = (setter: (file: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const validateForm = (): boolean => {
    // Visitor info validation
    if (!fullName || !idIqama || !nationality || !company || !department || !purpose) {
      toast.error('Please fill all visitor information fields');
      return false;
    }

    // Check blacklist
    if (isBlacklisted(idIqama)) {
      toast.error('This ID/Iqama number is blacklisted. Please contact security.');
      return false;
    }

    // Document validation
    if (!idIqamaDoc) {
      toast.error('Please upload ID/Iqama document');
      return false;
    }

    // Vehicle validation
    if (hasVehicle === 'yes') {
      if (!vehicleType) {
        toast.error('Please select vehicle type');
        return false;
      }

      if (!plateNumber) {
        toast.error('Please enter plate number');
        return false;
      }

      if (vehicleType === 'truck') {
        if (!truckOperation) {
          toast.error('Please select truck operation type');
          return false;
        }
        if (!driverSafetyPhoto || !truckPhoto || !safetyEquipmentPhoto) {
          toast.error('Please upload all required truck documents');
          return false;
        }
      }

      if (vehicleType === 'car') {
        if (!vehicleRegistration) {
          toast.error('Please upload vehicle registration');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create permission request
    const request: PermissionRequest = {
      id: `REQ-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: 'pending_department',
      visitor: {
        fullName,
        idIqamaNumber: idIqama,
        nationality,
        companyOrganization: company,
        department: department as Department,
        purposeOfVisit: purpose,
      },
      documents: {
        idIqama: idIqamaDoc ? URL.createObjectURL(idIqamaDoc) : null,
        driverLicense: driverLicense ? URL.createObjectURL(driverLicense) : null,
      },
      vehicle: {
        hasVehicle: hasVehicle === 'yes',
        vehicleType: hasVehicle === 'yes' ? vehicleType : undefined,
        plateNumber: hasVehicle === 'yes' ? plateNumber : undefined,
        truckOperation: vehicleType === 'truck' ? (truckOperation as TruckOperation) : undefined,
      },
      truckDocuments:
        vehicleType === 'truck'
          ? {
              driverSafetyPhoto: driverSafetyPhoto ? URL.createObjectURL(driverSafetyPhoto) : null,
              truckPhoto: truckPhoto ? URL.createObjectURL(truckPhoto) : null,
              safetyEquipmentPhoto: safetyEquipmentPhoto ? URL.createObjectURL(safetyEquipmentPhoto) : null,
            }
          : undefined,
      carDocuments:
        vehicleType === 'car'
          ? {
              vehicleRegistration: vehicleRegistration ? URL.createObjectURL(vehicleRegistration) : null,
            }
          : undefined,
      entryExitLogs: [],
    };

    addPermission(request);
    toast.success('Permission request submitted successfully!', {
      description: `Request ID: ${request.id}`,
    });
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button onClick={onBack} variant="ghost" className="mb-6 text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white">
            <CardTitle>Visitor Permission Request</CardTitle>
            <CardDescription className="text-white/90">
              Complete all required fields to submit your request
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Visitor Information */}
              <div>
                <h3 className="mb-4 pb-2 border-b">Visitor Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="idIqama">
                      ID / Iqama Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="idIqama"
                      value={idIqama}
                      onChange={(e) => setIdIqama(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">
                      Nationality <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">
                      Company / Organization Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">
                      Department to Visit <span className="text-red-500">*</span>
                    </Label>
                    <Select value={department} onValueChange={(val) => setDepartment(val as Department)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipping">Shipping</SelectItem>
                        <SelectItem value="raw_material">Raw Material</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                        <SelectItem value="coordinator">Coordinator</SelectItem>
                        <SelectItem value="bulk_oil">Bulk Oil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="purpose">
                    Purpose of Visit <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div>
                <h3 className="mb-4 pb-2 border-b">Document Uploads</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idIqamaDoc">
                      Upload ID / Iqama <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <label
                        htmlFor="idIqamaDoc"
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        {idIqamaDoc ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm">{idIqamaDoc.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload</span>
                          </>
                        )}
                      </label>
                      <input
                        id="idIqamaDoc"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange(setIdIqamaDoc)}
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="driverLicense">Upload Driver's License (Optional)</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="driverLicense"
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        {driverLicense ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm">{driverLicense.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload</span>
                          </>
                        )}
                      </label>
                      <input
                        id="driverLicense"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange(setDriverLicense)}
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Arrival Check */}
              <div>
                <h3 className="mb-4 pb-2 border-b">Vehicle Information</h3>
                <Label>
                  Are you arriving with a vehicle? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={hasVehicle} onValueChange={setHasVehicle} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="vehicle-yes" />
                    <Label htmlFor="vehicle-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="vehicle-no" />
                    <Label htmlFor="vehicle-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Vehicle Details (Conditional) */}
              {hasVehicle === 'yes' && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="vehicleType">
                      Vehicle Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={vehicleType || ''} onValueChange={(val) => setVehicleType(val as VehicleType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Truck Details */}
                  {vehicleType === 'truck' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4>Truck Details</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="plateNumber">
                            Plate Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="plateNumber"
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="truckOperation">
                            Truck Operation <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={truckOperation}
                            onValueChange={(val) => setTruckOperation(val as TruckOperation)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="loading">Loading</SelectItem>
                              <SelectItem value="unloading">Unloading</SelectItem>
                              <SelectItem value="both">Both (Loading and Unloading)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-sm">
                          Required Documents <span className="text-red-500">*</span>
                        </h5>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="driverSafetyPhoto" className="text-sm">
                              Driver Safety Attire Photo
                            </Label>
                            <label
                              htmlFor="driverSafetyPhoto"
                              className="mt-2 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white"
                            >
                              {driverSafetyPhoto ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  <span className="text-xs text-center">{driverSafetyPhoto.name}</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-5 w-5 text-gray-400" />
                                  <span className="text-xs text-center text-gray-600">Upload</span>
                                </>
                              )}
                            </label>
                            <input
                              id="driverSafetyPhoto"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange(setDriverSafetyPhoto)}
                              accept="image/*"
                            />
                          </div>
                          <div>
                            <Label htmlFor="truckPhoto" className="text-sm">
                              Truck Photo
                            </Label>
                            <label
                              htmlFor="truckPhoto"
                              className="mt-2 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white"
                            >
                              {truckPhoto ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  <span className="text-xs text-center">{truckPhoto.name}</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-5 w-5 text-gray-400" />
                                  <span className="text-xs text-center text-gray-600">Upload</span>
                                </>
                              )}
                            </label>
                            <input
                              id="truckPhoto"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange(setTruckPhoto)}
                              accept="image/*"
                            />
                          </div>
                          <div>
                            <Label htmlFor="safetyEquipmentPhoto" className="text-sm">
                              Safety Equipment Photo
                            </Label>
                            <label
                              htmlFor="safetyEquipmentPhoto"
                              className="mt-2 flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white"
                            >
                              {safetyEquipmentPhoto ? (
                                <>
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  <span className="text-xs text-center">{safetyEquipmentPhoto.name}</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-5 w-5 text-gray-400" />
                                  <span className="text-xs text-center text-gray-600">Upload</span>
                                </>
                              )}
                            </label>
                            <input
                              id="safetyEquipmentPhoto"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange(setSafetyEquipmentPhoto)}
                              accept="image/*"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Car Details */}
                  {vehicleType === 'car' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4>Car Details</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="plateNumberCar">
                            Plate Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="plateNumberCar"
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="vehicleRegistration">
                            Vehicle Registration <span className="text-red-500">*</span>
                          </Label>
                          <label
                            htmlFor="vehicleRegistration"
                            className="mt-2 flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white"
                          >
                            {vehicleRegistration ? (
                              <>
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span className="text-sm">{vehicleRegistration.name}</span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600">Upload</span>
                              </>
                            )}
                          </label>
                          <input
                            id="vehicleRegistration"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange(setVehicleRegistration)}
                            accept="image/*,application/pdf"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)] hover:opacity-90"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
