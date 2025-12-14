import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Users, Truck, FileCheck } from 'lucide-react';

interface HomePageProps {
  onRequestPermission: () => void;
  onLogin: () => void;
}

export function HomePage({ onRequestPermission, onLogin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(50,99,55)] to-[rgb(74,222,128)]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.licdn.com/dms/image/D4E0BAQFlrP0rYBluLQ/company-logo_200_200/0/1684497488806?e=2147483647&v=beta&t=NTGxPJFUw_eT54zjg__T4fsDXcmXJLkXlnJYwDrewrg"
              alt="Petrolube Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-gray-900">Petrolube</h1>
              <p className="text-sm text-gray-600">Visitor Management System</p>
            </div>
          </div>
          <Button onClick={onLogin} variant="outline">
            Admin Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-white mb-4">Welcome to Petrolube Visitor Management</h2>
          <p className="text-white/90 text-lg mb-8">
            Request visitor permission to access our facilities. Our streamlined process ensures
            safety and compliance for all visitors and vehicles.
          </p>
          <Button
            onClick={onRequestPermission}
            size="lg"
            className="bg-white text-[rgb(50,99,55)] hover:bg-white/90"
          >
            Request Permission
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <FileCheck className="h-10 w-10 text-[rgb(50,99,55)] mb-2" />
              <CardTitle>Easy Request</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit your visitor permission request online with our simple form
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-10 w-10 text-[rgb(50,99,55)] mb-2" />
              <CardTitle>Secure Process</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Multi-level approval system ensures safety and security compliance
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Truck className="h-10 w-10 text-[rgb(50,99,55)] mb-2" />
              <CardTitle>Vehicle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track truck and car entries with comprehensive documentation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Users className="h-10 w-10 text-[rgb(50,99,55)] mb-2" />
              <CardTitle>Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor visitor status and approval progress in real-time
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="max-w-4xl mx-auto mt-16 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(50,99,55)] text-white flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Submit Request</h3>
                <p className="text-gray-600">
                  Fill out the visitor permission form with your details and upload required documents
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(50,99,55)] text-white flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Department Approval</h3>
                <p className="text-gray-600">
                  Your request will be reviewed by the department admin you wish to visit
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(50,99,55)] text-white flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Security Approval</h3>
                <p className="text-gray-600">
                  Final approval from security admin ensures compliance with safety protocols
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(50,99,55)] text-white flex items-center justify-center">
                4
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Visit Approved</h3>
                <p className="text-gray-600">
                  Receive your approved permit and visit during the authorized period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>&copy; 2024 Petrolube. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
