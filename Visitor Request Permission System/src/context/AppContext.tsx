import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PermissionRequest, BlacklistEntry, UserType } from '../types';
import { mockPermissions } from '../utils/mockData';

interface AppContextType {
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  permissions: PermissionRequest[];
  addPermission: (permission: PermissionRequest) => void;
  updatePermission: (id: string, updates: Partial<PermissionRequest>) => void;
  blacklist: BlacklistEntry[];
  addToBlacklist: (entry: BlacklistEntry) => void;
  removeFromBlacklist: (id: string) => void;
  isBlacklisted: (idIqamaNumber: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserType>(null);
  const [permissions, setPermissions] = useState<PermissionRequest[]>(mockPermissions);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);

  const addPermission = (permission: PermissionRequest) => {
    setPermissions(prev => [...prev, permission]);
  };

  const updatePermission = (id: string, updates: Partial<PermissionRequest>) => {
    setPermissions(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addToBlacklist = (entry: BlacklistEntry) => {
    setBlacklist(prev => [...prev, entry]);
  };

  const removeFromBlacklist = (id: string) => {
    setBlacklist(prev => prev.filter(e => e.id !== id));
  };

  const isBlacklisted = (idIqamaNumber: string) => {
    return blacklist.some(e => e.idIqamaNumber === idIqamaNumber);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        permissions,
        addPermission,
        updatePermission,
        blacklist,
        addToBlacklist,
        removeFromBlacklist,
        isBlacklisted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};