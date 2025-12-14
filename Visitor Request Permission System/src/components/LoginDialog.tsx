import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Shield, Building2 } from 'lucide-react';
import { UserType } from '../types';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectUserType: (userType: UserType) => void;
}

export function LoginDialog({ open, onClose, onSelectUserType }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Login Type</DialogTitle>
          <DialogDescription>
            Choose your role to access the admin portal
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => onSelectUserType('department')}
            className="h-auto py-6 flex-col gap-2 bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)] hover:opacity-90"
          >
            <Building2 className="h-8 w-8" />
            <div>
              <div>Department Admin</div>
              <div className="text-xs opacity-90">Manage visitor requests for your department</div>
            </div>
          </Button>
          <Button
            onClick={() => onSelectUserType('security')}
            className="h-auto py-6 flex-col gap-2 bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)] hover:opacity-90"
          >
            <Shield className="h-8 w-8" />
            <div>
              <div>Security Admin</div>
              <div className="text-xs opacity-90">Final approval and access control</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
