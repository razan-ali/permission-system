import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle, AlertTriangle, Truck, Car, TrendingUp, Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function SecurityDashboard() {
  const { permissions, blacklist } = useApp();

  // Calculate metrics
  const pendingSecurityCount = permissions.filter((p) => p.status === 'pending_security').length;
  const fullyApproved = permissions.filter((p) => p.status === 'approved').length;
  const blacklistCount = blacklist.length;

  const today = new Date().toDateString();
  
  const todayTruckEntries = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'truck')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => new Date(log.entryTime).toDateString() === today).length
      );
    }, 0);

  const todayCarEntries = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'car')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => new Date(log.entryTime).toDateString() === today).length
      );
    }, 0);

  const todayTruckExits = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'truck')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => log.exitTime && new Date(log.exitTime).toDateString() === today).length
      );
    }, 0);

  const todayCarExits = permissions
    .filter((p) => p.status === 'approved' && p.vehicle.vehicleType === 'car')
    .reduce((count, p) => {
      return (
        count +
        p.entryExitLogs.filter((log) => log.exitTime && new Date(log.exitTime).toDateString() === today).length
      );
    }, 0);

  const activePermits = permissions.filter((p) => {
    if (p.status !== 'approved') return false;
    if (!p.visitEndDate) return true;
    return new Date(p.visitEndDate) >= new Date();
  }).length;

  const expiredPermits = permissions.filter((p) => {
    if (p.status !== 'approved') return false;
    if (!p.visitEndDate) return false;
    return new Date(p.visitEndDate) < new Date();
  }).length;

  // Department breakdown
  const departmentData = [
    { name: 'Shipping', value: permissions.filter((p) => p.visitor.department === 'shipping' && p.status === 'approved').length },
    { name: 'Raw Material', value: permissions.filter((p) => p.visitor.department === 'raw_material' && p.status === 'approved').length },
    { name: 'Lab', value: permissions.filter((p) => p.visitor.department === 'lab' && p.status === 'approved').length },
    { name: 'Coordinator', value: permissions.filter((p) => p.visitor.department === 'coordinator' && p.status === 'approved').length },
    { name: 'Bulk Oil', value: permissions.filter((p) => p.visitor.department === 'bulk_oil' && p.status === 'approved').length },
  ];

  const vehicleTypeData = [
    { name: 'Truck', value: todayTruckEntries, color: '#326337' },
    { name: 'Car', value: todayCarEntries, color: '#4ade80' },
  ];

  // Mock trend data for the week
  const trendData = [
    { day: 'Mon', entries: 12, exits: 10 },
    { day: 'Tue', entries: 15, exits: 14 },
    { day: 'Wed', entries: 18, exits: 16 },
    { day: 'Thu', entries: 14, exits: 15 },
    { day: 'Fri', entries: 20, exits: 18 },
    { day: 'Sat', entries: 8, exits: 9 },
    { day: 'Sun', entries: 5, exits: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Pending Security Review</CardTitle>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-orange-600">{pendingSecurityCount}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting your approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Fully Approved Today</CardTitle>
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
              <CardTitle className="text-sm text-gray-600">Blacklisted</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-red-600">{blacklistCount}</div>
            <p className="text-xs text-gray-500 mt-1">Blocked visitors/vehicles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-600">Active Permits</CardTitle>
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-blue-600">{activePermits}</div>
            <p className="text-xs text-gray-500 mt-1">{expiredPermits} expired</p>
          </CardContent>
        </Card>
      </div>

      {/* Entry/Exit Today */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Truck Entries Today</CardTitle>
              <Truck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{todayTruckEntries}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)] text-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Car Entries Today</CardTitle>
              <Car className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div>{todayCarEntries}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[rgb(50,99,55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Truck Exits Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[rgb(50,99,55)]">{todayTruckExits}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 border-[rgb(50,99,55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Car Exits Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[rgb(50,99,55)]">{todayCarExits}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visitor Volume by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#326337" name="Approved Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Type Distribution Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Entry/Exit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="entries" stroke="#326337" strokeWidth={2} name="Entries" />
                <Line type="monotone" dataKey="exits" stroke="#4ade80" strokeWidth={2} name="Exits" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
