import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, AlertTriangle, Truck, Navigation, Users, Activity } from 'lucide-react';
import { mockRequests, mockAmbulances } from '../../utils/mockData';
import { EmergencyRequest, Ambulance } from '../../types';

const DispatchDashboard: React.FC = () => {
  const [requests, setRequests] = useState<EmergencyRequest[]>(mockRequests);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const assignAmbulance = (requestId: string, ambulanceId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'assigned', assignedAmbulance: ambulanceId, estimatedArrival: new Date(Date.now() + 480000) }
        : req
    ));
    setAmbulances(prev => prev.map(amb => 
      amb.id === ambulanceId 
        ? { ...amb, status: 'dispatched' }
        : amb
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'dispatched': return 'text-blue-600 bg-blue-100';
      case 'busy': return 'text-orange-600 bg-orange-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    completed: requests.filter(r => r.status === 'completed').length,
    available: ambulances.filter(a => a.status === 'available').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <span>Dispatch Control Center</span>
          </h1>
          <p className="text-gray-600 mt-2">Real-time emergency coordination and ambulance management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
              <div className="text-xs text-gray-500">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Emergency Requests */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Filter Tabs */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Emergency Requests</h2>
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'All', count: requests.length },
                    { key: 'pending', label: 'Pending', count: stats.pending },
                    { key: 'assigned', label: 'Assigned', count: stats.assigned },
                    { key: 'completed', label: 'Completed', count: stats.completed }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === tab.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredRequests.map((request) => (
                  <div 
                    key={request.id}
                    className={`border rounded-xl p-6 transition-all cursor-pointer ${
                      selectedRequest === request.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                          <p className="text-gray-600">{request.emergencyType}</p>
                          <p className="text-sm text-gray-500">Request ID: {request.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSeverityColor(request.severityLevel)}`}>
                          {request.severityLevel}
                        </span>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'dispatched' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{request.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(request.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Ambulances:</h4>
                        <div className="flex flex-wrap gap-2">
                          {ambulances.filter(a => a.status === 'available').map((ambulance) => (
                            <button
                              key={ambulance.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                assignAmbulance(request.id, ambulance.id);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <Truck className="h-4 w-4" />
                              <span>{ambulance.callSign} - {ambulance.type}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.assignedAmbulance && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-blue-900">
                                Assigned: {ambulances.find(a => a.id === request.assignedAmbulance)?.callSign}
                              </p>
                              <p className="text-sm text-blue-700">
                                Driver: {ambulances.find(a => a.id === request.assignedAmbulance)?.driver}
                              </p>
                            </div>
                            {request.estimatedArrival && (
                              <div className="text-right">
                                <p className="text-sm font-semibold text-blue-900">ETA</p>
                                <p className="text-sm text-blue-700">
                                  {new Date(request.estimatedArrival).toLocaleTimeString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ambulance Fleet Status */}
        <div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fleet Status</h2>
            <div className="space-y-4">
              {ambulances.map((ambulance) => (
                <div key={ambulance.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ambulance.callSign}</h3>
                        <p className="text-sm text-gray-600">{ambulance.driver}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ambulance.status)}`}>
                      {ambulance.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{ambulance.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-xs font-mono">{ambulance.location.lat.toFixed(4)}, {ambulance.location.lng.toFixed(4)}</span>
                    </div>
                  </div>

                  {ambulance.status === 'available' && (
                    <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                      Ready for Assignment
                    </button>
                  )}

                  {ambulance.status === 'dispatched' && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800 text-center">En Route to Emergency</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  Emergency Broadcast
                </button>
                <button className="w-full bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  Contact All Units
                </button>
                <button className="w-full bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg text-sm hover:bg-yellow-200 transition-colors">
                  System Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map and Analytics Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Map */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Real-time Map View</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Refresh Map
            </button>
          </div>
          <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center relative overflow-hidden">
            {/* Map Placeholder with Ambulance Markers */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
            <div className="relative z-10 text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Google Maps Integration</p>
              <p className="text-sm text-gray-500 mt-2">Real-time ambulance tracking and emergency locations</p>
            </div>
            
            {/* Simulated Ambulance Markers */}
            <div className="absolute top-4 left-4 bg-green-500 text-white p-2 rounded-full text-xs font-bold">
              A1
            </div>
            <div className="absolute top-16 right-8 bg-blue-500 text-white p-2 rounded-full text-xs font-bold">
              B2
            </div>
            <div className="absolute bottom-8 left-12 bg-green-500 text-white p-2 rounded-full text-xs font-bold">
              C3
            </div>
            <div className="absolute bottom-4 right-4 bg-orange-500 text-white p-2 rounded-full text-xs font-bold">
              D4
            </div>
            
            {/* Emergency Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-500 text-white p-3 rounded-full animate-pulse">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Dispatched</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Emergency</span>
              </div>
            </div>
            <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          
          <div className="space-y-6">
            {/* Response Time */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Average Response Time</span>
                <span className="text-lg font-bold text-blue-600">8.5 min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: ≤ 10 minutes</p>
            </div>

            {/* Success Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-lg font-bold text-green-600">98.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: ≥ 95%</p>
            </div>

            {/* Fleet Utilization */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Fleet Utilization</span>
                <span className="text-lg font-bold text-orange-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Optimal: 70-85%</p>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-blue-700">Emergencies</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">22</div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">7.2</div>
                <div className="text-xs text-orange-700">Avg Time</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-xs text-purple-700">Active</div>
              </div>
            </div>
          </div>

          {/* Emergency Alerts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">System Alerts</h3>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>High Volume:</strong> 3 pending requests in queue
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>All Systems:</strong> Operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchDashboard;