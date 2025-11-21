import { EmergencyRequest, Ambulance, Hospital, AnalyticsData } from '../types';

export const mockRequests: EmergencyRequest[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+254712345678',
    location: {
      address: 'Kenyatta Avenue, Nairobi',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    emergencyType: 'Cardiac Emergency',
    severityLevel: 'Critical',
    status: 'pending',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+254722345679',
    location: {
      address: 'Westlands, Nairobi',
      coordinates: { lat: -1.2634, lng: 36.8104 }
    },
    emergencyType: 'Accident',
    severityLevel: 'High',
    status: 'assigned',
    timestamp: new Date(Date.now() - 600000),
    assignedAmbulance: 'AMB-001',
    estimatedArrival: new Date(Date.now() + 480000),
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: 'AMB-001',
    callSign: 'Alpha-1',
    driver: 'Michael Wanjiku',
    location: { lat: -1.2700, lng: 36.8150 },
    status: 'dispatched',
    type: 'advanced'
  },
  {
    id: 'AMB-002',
    callSign: 'Bravo-2',
    driver: 'Sarah Kimani',
    location: { lat: -1.2800, lng: 36.8200 },
    status: 'available',
    type: 'basic'
  },
  {
    id: 'AMB-003',
    callSign: 'Charlie-3',
    driver: 'David Ochieng',
    location: { lat: -1.2950, lng: 36.8300 },
    status: 'available',
    type: 'critical'
  },
  {
    id: 'AMB-004',
    callSign: 'Delta-4',
    driver: 'Grace Muthoni',
    location: { lat: -1.2600, lng: 36.8050 },
    status: 'busy',
    type: 'advanced'
  }
];

export const mockHospitals: Hospital[] = [
  {
    id: 'HOSP-001',
    name: 'Kenyatta National Hospital',
    address: 'Hospital Road, Nairobi',
    availableBeds: 15,
    totalBeds: 50,
    erStatus: 'open',
    specialties: ['Emergency', 'Trauma', 'Cardiology'],
    distance: 2.5
  },
  {
    id: 'HOSP-002',
    name: 'Nairobi Hospital',
    address: 'Argwings Kodhek Road',
    availableBeds: 8,
    totalBeds: 30,
    erStatus: 'busy',
    specialties: ['Emergency', 'Surgery', 'ICU'],
    distance: 3.2
  },
  {
    id: 'HOSP-003',
    name: 'Aga Khan Hospital',
    address: 'Third Parklands Avenue',
    availableBeds: 12,
    totalBeds: 25,
    erStatus: 'open',
    specialties: ['Emergency', 'Pediatric', 'Maternity'],
    distance: 4.1
  },
  {
    id: 'HOSP-004',
    name: 'MP Shah Hospital',
    address: 'Shivachi Road, Parklands',
    availableBeds: 3,
    totalBeds: 20,
    erStatus: 'busy',
    specialties: ['Emergency', 'Orthopedic'],
    distance: 3.8
  }
];

export const mockAnalytics: AnalyticsData = {
  responseTime: {
    average: 8.5,
    trend: [7.2, 8.1, 6.9, 9.2, 8.5, 7.8, 8.9],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  emergenciesHandled: {
    total: 156,
    byType: {
      'Cardiac Emergency': 45,
      'Accident': 62,
      'Respiratory': 28,
      'Other': 21
    },
    monthly: [120, 134, 145, 156, 142, 158]
  },
  hospitalLoad: {
    current: 78,
    capacity: 125,
    trend: [65, 70, 75, 82, 78, 85, 78]
  }
};