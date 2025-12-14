import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useApp } from '../../context/AppContext';
import { FileText, CheckCircle, XCircle, Clock, Truck, Car } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function DepartmentDashboard() {
  const { permissions } = useApp();

  // Calculate metrics
  const pendingDepartment = permissions.filter((p) => p.status === 'pending_department').length;
  const pendingSecurityCount = permissions.filter((p) => p.status === 'pending_security').length;
  const fullyApproved = permissions.filter((p) => p.status === 'approved').length;
  const rejected = permissions.filter(
    (p) => p.status === 'rejected_department' || p.status === 'rejected_security'
  ).length;

  const today = new Date().toDateString();
  const todayEntries = permissions
    .filter((p) => p.status === 'approved')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => new Date(log.entryTime).toDateString() === today).length
      );
    }, 0);

  const todayExits = permissions
    .filter((p) => p.status === 'approved')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => log.exitTime && new Date(log.exitTime).toDateString() === today)
          .length
      );
    }, 0);

  const trucksToday = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'truck')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => new Date(log.entryTime).toDateString() === today).length
      );
    }, 0);

  const carsToday = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'car')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => new Date(log.entryTime).toDateString() === today).length
      );
    }, 0);

  // Department breakdown
  const departmentData = [
    { name: 'Shipping', value: permissions.filter((p) => p.visitor.department === 'shipping').length },
    { name: 'Raw Material', value: permissions.filter((p) => p.visitor.department === 'raw_material').length },
    { name: 'Lab', value: permissions.filter((p) => p.visitor.department === 'lab').length },
    { name: 'Coordinator', value: permissions.filter((p) => p.visitor.department === 'coordinator').length },
    { name: 'Bulk Oil', value: permissions.filter((p) => p.visitor.department === 'bulk_oil').length },
  ];

  const statusData = [
    { name: 'Pending Dept', value: pendingDepartment, color: '#f59e0b' },
    { name: 'Pending Security', value: pendingSecurityCount, color: '#3b82f6' },
    { name: 'Approved', value: fullyApproved, color: '#10b981' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
  ];

  const COLORS = ['#326337', '#4ade80', '#22c55e', '#16a34a', '#15803d'];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Pending Review</CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{pendingDepartment}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting department approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">At Security</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-blue-600">{pendingSecurityCount}</div>
            <p className="text-xs text-gray-500 mt-1">Pending security approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Fully Approved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">{fullyApproved}</div>
            <p className="text-xs text-gray-500 mt-1">Active permits</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Rejected</CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">{rejected}</div>
            <p className="text-xs text-gray-500 mt-1">Total rejections</p>
          </CardContent>
        </Card>
      </div>

      {/* Entry/Exit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Trucks Entered Today</CardTitle>
              <Truck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{trucksToday}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Cars Entered Today</CardTitle>
              <Car className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{carsToday}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[rgb(50,99,55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Entries Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[rgb(50,99,55)]">{todayEntries}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[rgb(50,99,55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Exits Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[rgb(50,99,55)]">{todayExits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requests by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#326337" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
