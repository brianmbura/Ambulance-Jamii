import React, { useState } from 'react';
import { Building2, Bed, Users, AlertTriangle, Plus, Minus, Clock, Activity, TrendingUp } from 'lucide-react';
import { mockHospitals } from '../../utils/mockData';
import { Hospital } from '../../types';

const HospitalDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(mockHospitals[0]);

  const updateBedCount = (hospitalId: string, change: number) => {
    setHospitals(prev => prev.map(hospital => {
      if (hospital.id === hospitalId) {
        const newAvailable = Math.max(0, Math.min(hospital.totalBeds, hospital.availableBeds + change));
        const updated = { ...hospital, availableBeds: newAvailable };
        if (selectedHospital.id === hospitalId) {
          setSelectedHospital(updated);
        }
        return updated;
      }
      return hospital;
    }));
  };

  const updateERStatus = (hospitalId: string, status: Hospital['erStatus']) => {
    setHospitals(prev => prev.map(hospital => {
      if (hospital.id === hospitalId) {
        const updated = { ...hospital, erStatus: status };
        if (selectedHospital.id === hospitalId) {
          setSelectedHospital(updated);
        }
        return updated;
      }
      return hospital;
    }));
  };

  const getERStatusColor = (status: Hospital['erStatus']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCapacityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);
  const totalAvailable = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const systemCapacity = Math.round((totalAvailable / totalBeds) * 100);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <span>Hospital Load Balancing Panel</span>
          </h1>
          <p className="text-gray-600 mt-2">Real-time hospital capacity management and emergency room coordination</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalAvailable}</div>
            <div className="text-xs text-gray-500">Available Beds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{totalBeds}</div>
            <div className="text-xs text-gray-500">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getCapacityColor(totalAvailable, totalBeds)}`}>
              {systemCapacity}%
            </div>
            <div className="text-xs text-gray-500">System Load</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Hospital List */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hospital Network Status</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Activity className="h-4 w-4" />
                <span>Live updates every 30 seconds</span>
              </div>
            </div>

            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <div 
                  key={hospital.id}
                  className={`border rounded-xl p-6 transition-all cursor-pointer ${
                    selectedHospital.id === hospital.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                        <p className="text-gray-600">{hospital.address}</p>
                        <p className="text-sm text-gray-500">Distance: {hospital.distance} km</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getERStatusColor(hospital.erStatus)}`}>
                      ER {hospital.erStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{hospital.availableBeds}</div>
                      <div className="text-sm text-gray-500">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-600">{hospital.totalBeds}</div>
                      <div className="text-sm text-gray-500">Total Beds</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getCapacityColor(hospital.availableBeds, hospital.totalBeds)}`}>
                        {Math.round((hospital.availableBeds / hospital.totalBeds) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Capacity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{hospital.specialties.length}</div>
                      <div className="text-sm text-gray-500">Specialties</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">Bed Management:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBedCount(hospital.id, -1);
                          }}
                          className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition-colors"
                          disabled={hospital.availableBeds === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-600 min-w-[80px] text-center font-medium">
                          {hospital.availableBeds} beds
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBedCount(hospital.id, 1);
                          }}
                          className="bg-green-100 text-green-600 p-2 rounded hover:bg-green-200 transition-colors"
                          disabled={hospital.availableBeds === hospital.totalBeds}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {hospital.availableBeds === 0 && (
                      <span className="text-red-600 text-sm font-medium flex items-center bg-red-50 px-3 py-1 rounded-lg">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        FULL CAPACITY
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Panel */}
        <div className="space-y-6">
          {/* Selected Hospital Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hospital Management</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedHospital.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Beds:</span>
                  <span className="font-semibold">{selectedHospital.availableBeds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ER Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getERStatusColor(selectedHospital.erStatus)}`}>
                    {selectedHospital.erStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Update ER Status</h4>
                <div className="space-y-2">
                  {['open', 'busy', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateERStatus(selectedHospital.id, status as Hospital['erStatus'])}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        selectedHospital.erStatus === status
                          ? status === 'open' ? 'bg-green-600 text-white' :
                            status === 'busy' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Network Capacity</span>
                  <span className="text-lg font-bold text-blue-600">{systemCapacity}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${systemCapacity}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hospitals Online:</span>
                  <span className="font-semibold text-green-600">
                    {hospitals.filter(h => h.erStatus !== 'closed').length}/{hospitals.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Critical Alerts:</span>
                  <span className="font-semibold text-red-600">
                    {hospitals.filter(h => h.availableBeds === 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Load:</span>
                  <span className="font-semibold text-blue-600">{systemCapacity}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">AI Recommendations</h3>
            
            <div className="space-y-3">
              {hospitals.filter(h => h.availableBeds > 5).length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Optimal Assignment</h4>
                  <p className="text-sm text-green-700">
                    {hospitals.filter(h => h.availableBeds > 5)[0]?.name} has high availability
                  </p>
                </div>
              )}

              {hospitals.filter(h => h.availableBeds <= 2 && h.availableBeds > 0).length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Capacity Warning</h4>
                  <p className="text-sm text-yellow-700">
                    {hospitals.filter(h => h.availableBeds <= 2 && h.availableBeds > 0).length} hospital(s) approaching capacity
                  </p>
                </div>
              )}

              {hospitals.filter(h => h.availableBeds === 0).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Critical Alert</h4>
                  <p className="text-sm text-red-700">
                    {hospitals.filter(h => h.availableBeds === 0).length} hospital(s) at full capacity
                  </p>
                </div>
              )}
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Generate Capacity Report
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors">
                Emergency Broadcast
              </button>
              <button className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                Update All Statuses
              </button>
              <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg text-sm hover:bg-green-200 transition-colors">
                Export Daily Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Alerts & Notifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hospitals.filter(h => h.availableBeds === 0).length > 0 && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-red-800">Full Capacity Alert</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  {hospitals.filter(h => h.availableBeds === 0).map(h => h.name).join(', ')} 
                  {hospitals.filter(h => h.availableBeds === 0).length > 1 ? ' are' : ' is'} at full capacity
                </p>
                <button className="text-xs bg-red-600 text-white px-3 py-1 rounded">
                  Notify Dispatch
                </button>
              </div>
            )}

            {hospitals.filter(h => h.erStatus === 'closed').length > 0 && (
              <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">ER Closures</h3>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  {hospitals.filter(h => h.erStatus === 'closed').length} emergency room(s) currently closed
                </p>
                <button className="text-xs bg-orange-600 text-white px-3 py-1 rounded">
                  View Details
                </button>
              </div>
            )}

            {hospitals.every(h => h.availableBeds > 0 && h.erStatus !== 'closed') && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">All Systems Operational</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  All hospitals are accepting patients with available capacity
                </p>
                <button className="text-xs bg-green-600 text-white px-3 py-1 rounded">
                  View Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;