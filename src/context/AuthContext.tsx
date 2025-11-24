import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emergency Dispatcher',
    email: 'dispatcher@jamii.com',
    role: 'dispatcher',
    permissions: ['view_requests', 'assign_ambulances', 'manage_dispatch']
  },
  {
    id: '2',
    name: 'Ambulance Driver',
    email: 'driver@jamii.com',
    role: 'driver',
    permissions: ['view_assignments', 'update_status', 'navigate']
  },
  {
    id: '3',
    name: 'Hospital Admin',
    email: 'hospital@jamii.com',
    role: 'hospital',
    permissions: ['manage_beds', 'update_capacity', 'view_requests']
  },
  {
    id: '4',
    name: 'Analytics User',
    email: 'analytics@jamii.com',
    role: 'analytics',
    permissions: ['view_reports', 'export_data', 'analyze_trends']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('jamii_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers.find(u => u.email === email && u.role === role);
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('jamii_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jamii_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};