import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

export function BlacklistModule() {
  const { blacklist, removeFromBlacklist } = useApp();

  const handleRemove = (id: string, name: string) => {
    removeFromBlacklist(id);
    toast.success('Removed from blacklist', {
      description: `${name} has been removed from the blacklist.`,
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle>Blacklist Management</CardTitle>
              <p className="text-sm text-gray-600">
                Manage blacklisted visitors and vehicles
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {blacklist.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No blacklisted entries</p>
              <p className="text-sm mt-2">
                Visitors can be blacklisted during the security approval process
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800">
                      <strong>Warning:</strong> Blacklisted visitors are automatically prevented from submitting new
                      permission requests.
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Only remove from blacklist if the security concern has been resolved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blacklist ID</TableHead>
                      <TableHead>Visitor Name</TableHead>
                      <TableHead>ID / Iqama Number</TableHead>
                      <TableHead>Vehicle Plate</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Blacklisted Date</TableHead>
                      <TableHead>Blacklisted By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blacklist.map((entry) => (
                      <TableRow key={entry.id} className="bg-red-50/50">
                        <TableCell>{entry.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            {entry.visitorName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{entry.idIqamaNumber}</Badge>
                        </TableCell>
                        <TableCell>{entry.vehiclePlate || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs">{entry.reason}</TableCell>
                        <TableCell className="text-sm">{formatDate(entry.blacklistedAt)}</TableCell>
                        <TableCell>{entry.blacklistedBy}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove from Blacklist?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove <strong>{entry.visitorName}</strong> from the
                                  blacklist? They will be able to submit new permission requests after removal.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemove(entry.id, entry.visitorName)}
                                  className="bg-gradient-to-r from-[rgb(50,99,55)] to-[rgb(74,222,128)]"
                                >
                                  Confirm Removal
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
