export interface EmergencyRequest {
  id: string;
  name: string;
  phone: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  emergencyType: string;
  severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'pending' | 'assigned' | 'dispatched' | 'arrived' | 'completed';
  timestamp: Date;
  assignedAmbulance?: string;
  estimatedArrival?: Date;
}

export interface Ambulance {
  id: string;
  callSign: string;
  driver: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'dispatched' | 'busy' | 'offline';
  type: 'basic' | 'advanced' | 'critical';
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  availableBeds: number;
  totalBeds: number;
  erStatus: 'open' | 'busy' | 'closed';
  specialties: string[];
  distance?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'public' | 'dispatcher' | 'driver' | 'hospital' | 'analytics';
  permissions: string[];
}

export interface AnalyticsData {
  responseTime: {
    average: number;
    trend: number[];
    dates: string[];
  };
  emergenciesHandled: {
    total: number;
    byType: Record<string, number>;
    monthly: number[];
  };
  hospitalLoad: {
    current: number;
    capacity: number;
    trend: number[];
  };
}