import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Phone, Clock, CheckCircle, AlertTriangle, Truck, Route } from 'lucide-react';

interface Assignment {
  id: string;
  patientName: string;
  location: string;
  emergencyType: string;
  severity: string;
  phone: string;
  timestamp: Date;
  status: 'assigned' | 'en_route' | 'arrived' | 'completed';
  estimatedTime: string;
  hospitalDestination?: string;
}

const DriverInterface: React.FC = () => {
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>({
    id: 'REQ-001',
    patientName: 'John Doe',
    location: 'Kenyatta Avenue, Nairobi CBD',
    emergencyType: 'Cardiac Emergency',
    severity: 'Critical',
    phone: '+254712345678',
    timestamp: new Date(),
    status: 'assigned',
    estimatedTime: '8 minutes',
    hospitalDestination: 'Kenyatta National Hospital'
  });

  const [driverInfo] = useState({
    callSign: 'Alpha-1',
    name: 'Michael Wanjiku',
    ambulanceType: 'Advanced Life Support',
    currentLocation: 'Westlands, Nairobi'
  });

  const updateStatus = (newStatus: Assignment['status']) => {
    if (currentAssignment) {
      setCurrentAssignment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!currentAssignment) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Active Assignment</h2>
          <p className="text-xl text-gray-600 mb-8">
            You're currently available for dispatch. New assignments will appear here.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Vehicle Status</h3>
              <p className="text-sm text-blue-700">Ready and operational</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Equipment Check</h3>
              <p className="text-sm text-green-700">All systems functional</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-yellow-900 mb-2">On Standby</h3>
              <p className="text-sm text-yellow-700">Awaiting dispatch</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <span>Driver Interface - {driverInfo.callSign}</span>
          </h1>
          <p className="text-gray-600 mt-2">Driver: {driverInfo.name} | Vehicle: {driverInfo.ambulanceType}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{currentAssignment.status.replace('_', ' ').toUpperCase()}</div>
            <div className="text-xs text-gray-500">Current Status</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{currentAssignment.estimatedTime}</div>
            <div className="text-xs text-gray-500">ETA</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Assignment Details */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Assignment</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSeverityColor(currentAssignment.severity)}`}>
                {currentAssignment.severity} Priority
              </span>
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{currentAssignment.patientName}</p>
                        <p className="text-sm text-gray-600">Patient Name</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{currentAssignment.phone}</p>
                        <p className="text-sm text-gray-600">Contact Number</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{currentAssignment.emergencyType}</p>
                        <p className="text-sm text-gray-600">Emergency Type</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Destination</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">{currentAssignment.location}</p>
                        <p className="text-sm text-gray-600">Emergency Location</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Route className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{currentAssignment.hospitalDestination}</p>
                        <p className="text-sm text-gray-600">Hospital Destination</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{new Date(currentAssignment.timestamp).toLocaleTimeString()}</p>
                        <p className="text-sm text-gray-600">Request Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button 
                className="bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 text-lg"
                onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(currentAssignment.location)}`, '_blank')}
              >
                <Navigation className="h-6 w-6" />
                <span>OPEN NAVIGATION</span>
              </button>

              <button 
                className="bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-3 text-lg"
                onClick={() => window.open(`tel:${currentAssignment.phone}`, '_self')}
              >
                <Phone className="h-6 w-6" />
                <span>CALL PATIENT</span>
              </button>
            </div>

            {/* Status Update Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Update Assignment Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentAssignment.status === 'assigned' && (
                  <button
                    onClick={() => updateStatus('en_route')}
                    className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    EN ROUTE TO PATIENT
                  </button>
                )}

                {currentAssignment.status === 'en_route' && (
                  <button
                    onClick={() => updateStatus('arrived')}
                    className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    ARRIVED ON SCENE
                  </button>
                )}

                {currentAssignment.status === 'arrived' && (
                  <button
                    onClick={() => updateStatus('completed')}
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    PATIENT TRANSPORTED
                  </button>
                )}

                {currentAssignment.status === 'completed' && (
                  <button
                    onClick={() => setCurrentAssignment(null)}
                    className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    COMPLETE ASSIGNMENT
                  </button>
                )}
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <span className="text-sm text-blue-600 font-bold uppercase">
                    {currentAssignment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency Call to Dispatch</span>
              </button>
              <button className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Contact Hospital</span>
              </button>
              <button className="w-full bg-yellow-100 text-yellow-700 py-3 px-4 rounded-lg text-sm hover:bg-yellow-200 transition-colors flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Request Backup</span>
              </button>
              <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Report Equipment Issue</span>
              </button>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Call Sign:</span>
                <span className="font-semibold text-gray-900">{driverInfo.callSign}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold text-gray-900">{driverInfo.ambulanceType}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Current Location:</span>
                <span className="font-semibold text-gray-900 text-sm">{driverInfo.currentLocation}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Equipment Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Defibrillator:</span>
                  <span className="text-green-600 font-medium">✓ Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Oxygen Supply:</span>
                  <span className="text-green-600 font-medium">✓ Full</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Medical Supplies:</span>
                  <span className="text-green-600 font-medium">✓ Stocked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">GPS System:</span>
                  <span className="text-green-600 font-medium">✓ Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Dispatch:</strong> "Alpha-1, proceed to Kenyatta Avenue for cardiac emergency"
                </p>
                <p className="text-xs text-blue-600 mt-1">2 minutes ago</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Hospital:</strong> "Bed prepared in ER, ETA confirmed"
                </p>
                <p className="text-xs text-green-600 mt-1">5 minutes ago</p>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Send message to dispatch..."
              />
              <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Send Message
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Completed transport to Nairobi Hospital</span>
                <span className="text-gray-400 ml-auto">1h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Responded to accident on Uhuru Highway</span>
                <span className="text-gray-400 ml-auto">3h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Equipment maintenance completed</span>
                <span className="text-gray-400 ml-auto">5h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverInterface;