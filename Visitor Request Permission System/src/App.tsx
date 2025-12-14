import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './components/HomePage';
import { RequestPermissionForm } from './components/RequestPermissionForm';
import { LoginDialog } from './components/LoginDialog';
import { DepartmentAdminPortal } from './components/DepartmentAdminPortal';
import { SecurityAdminPortal } from './components/SecurityAdminPortal';
import { Toaster } from './components/ui/sonner';
import { UserType } from './types';

function AppContent() {
  const { currentUser, setCurrentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<'home' | 'request'>('home');
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleRequestPermission = () => {
    setCurrentPage('request');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLogin = () => {
    setShowLoginDialog(true);
  };

  const handleSelectUserType = (userType: UserType) => {
    setCurrentUser(userType);
    setShowLoginDialog(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleRequestSuccess = () => {
    setCurrentPage('home');
  };

  // Show admin portals if logged in
  if (currentUser === 'department') {
    return <DepartmentAdminPortal onLogout={handleLogout} />;
  }

  if (currentUser === 'security') {
    return <SecurityAdminPortal onLogout={handleLogout} />;
  }

  // Show visitor-facing pages
  return (
    <>
      {currentPage === 'home' && (
        <HomePage onRequestPermission={handleRequestPermission} onLogin={handleLogin} />
      )}
      {currentPage === 'request' && (
        <RequestPermissionForm onBack={handleBackToHome} onSuccess={handleRequestSuccess} />
      )}
      <LoginDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onSelectUserType={handleSelectUserType}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster />
    </AppProvider>
  );
}
