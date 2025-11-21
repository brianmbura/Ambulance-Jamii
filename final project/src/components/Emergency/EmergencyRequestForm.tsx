import React, { useState } from 'react';
import { MapPin, Phone, User, AlertTriangle, Clock, Navigation } from 'lucide-react';

const EmergencyRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    emergencyType: '',
    severityLevel: 'Medium',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emergencyTypes = [
    'Cardiac Emergency',
    'Accident',
    'Respiratory Emergency',
    'Stroke',
    'Trauma',
    'Allergic Reaction',
    'Other'
  ];

  const severityLevels = [
    { value: 'Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' },
    { value: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
    { value: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300' },
    { value: 'Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
            <div className="flex items-center space-x-4 text-white">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Emergency Request Submitted</h1>
                <p className="text-green-100">Your request has been received and is being processed</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Request Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Request ID:</span>
                    <span className="font-mono text-gray-900">REQ-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Patient Name:</span>
                    <span className="text-gray-900">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Emergency Type:</span>
                    <span className="text-gray-900">{formData.emergencyType}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Severity Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      severityLevels.find(s => s.value === formData.severityLevel)?.bg
                    } ${severityLevels.find(s => s.value === formData.severityLevel)?.color}`}>
                      {formData.severityLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Processing
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Dispatch Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Estimated Arrival Time</h3>
                      <p className="text-blue-700">8-12 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Navigation className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">Ambulance Assigned</h3>
                      <p className="text-blue-700">Alpha-1 (Advanced Life Support)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Instructions</h3>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• Keep your phone accessible for ambulance crew contact</li>
                    <li>• Ensure clear access to your location</li>
                    <li>• Have identification and medical information ready</li>
                    <li>• Stay calm and follow any medical advice given</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '',
                    location: '',
                    emergencyType: '',
                    severityLevel: 'Medium',
                    description: ''
                  });
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Submit Another Request
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Track Ambulance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Emergency Request Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
              <div className="flex items-center space-x-4 text-white">
                <div className="bg-white/20 p-3 rounded-xl">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">AMBULANCE JAMII</h1>
                  <p className="text-red-100">Emergency Request Portal</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <User className="h-5 w-5 mr-2" />
                    PATIENT NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                    placeholder="Full name of patient"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Phone className="h-5 w-5 mr-2" />
                    CONTACT NUMBER
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                    placeholder="+254 700 000 000"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mt-6">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="h-5 w-5 mr-2" />
                  EMERGENCY LOCATION
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                    placeholder="Enter specific address or landmark"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    title="Use current location"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Current Location</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Location services enabled for faster response
                </p>
              </div>

              {/* Emergency Type */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  EMERGENCY TYPE
                </label>
                <select
                  value={formData.emergencyType}
                  onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                  required
                >
                  <option value="">Select type of emergency</option>
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Severity Level */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  SEVERITY LEVEL
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {severityLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, severityLevel: level.value })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all text-center ${
                        formData.severityLevel === level.value
                          ? `${level.bg} ${level.border} ${level.color}`
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">{level.value}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ADDITIONAL DETAILS (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                  rows={4}
                  placeholder="Provide any additional information about the emergency situation"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>REQUESTING AMBULANCE...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-6 w-6" />
                      <span>REQUEST AMBULANCE NOW</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Emergency Guidelines */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Guidelines</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 p-2 rounded-lg mt-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Life-Threatening Emergency</h3>
                  <p className="text-gray-600">Call 999 immediately for cardiac arrest, severe bleeding, or unconsciousness</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Urgent Care</h3>
                  <p className="text-gray-600">Use this form for urgent medical situations requiring ambulance transport</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location Accuracy</h3>
                  <p className="text-gray-600">Provide the most specific address possible for faster response</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Expected Response Times</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-800 font-medium">Critical</span>
                <span className="text-red-600 font-bold">4-6 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-800 font-medium">High</span>
                <span className="text-orange-600 font-bold">6-10 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 font-medium">Medium</span>
                <span className="text-yellow-600 font-bold">10-15 minutes</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Low</span>
                <span className="text-green-600 font-bold">15-20 minutes</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Emergency Hotline</span>
                <span className="font-bold text-red-600">999</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Dispatch Center</span>
                <span className="font-bold text-blue-600">+254 700 123 456</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Support</span>
                <span className="font-bold text-gray-600">support@jamii.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestForm;