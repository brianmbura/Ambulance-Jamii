import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Lock, User, Shield, LogIn, Activity, Truck, Building2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'dispatcher'
  });
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const roles = [
    { 
      value: 'dispatcher', 
      label: 'Emergency Dispatcher', 
      icon: Activity, 
      color: 'text-blue-600',
      description: 'Coordinate emergency responses and manage ambulance dispatch'
    },
    { 
      value: 'driver', 
      label: 'Ambulance Driver', 
      icon: Truck, 
      color: 'text-green-600',
      description: 'Receive assignments and provide emergency medical transport'
    },
    { 
      value: 'hospital', 
      label: 'Hospital Administrator', 
      icon: Building2, 
      color: 'text-red-600',
      description: 'Manage hospital capacity and emergency room availability'
    },
    { 
      value: 'analytics', 
      label: 'Analytics Manager', 
      icon: TrendingUp, 
      color: 'text-purple-600',
      description: 'Monitor system performance and generate reports'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password, formData.role);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const quickLogin = (role: string, email: string) => {
    setFormData({
      email,
      password: 'demo123',
      role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
            <div className="bg-red-600 p-4 rounded-2xl">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AMBULANCE</h1>
              <h1 className="text-4xl font-bold text-red-600">JAMII</h1>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Emergency Medical Services Platform
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Streamlining emergency response through intelligent dispatch, 
            real-time tracking, and coordinated hospital management.
          </p>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">8.5m</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">156</div>
              <div className="text-sm text-gray-600">Lives Saved</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Service Available</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">System Access Portal</h3>
            <p className="text-red-100">Select your role and sign in to continue</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  SELECT YOUR ROLE
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.role === role.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${
                            formData.role === role.value ? 'text-blue-600' : role.color
                          }`} />
                          <div>
                            <div className="font-semibold text-gray-900">{role.label}</div>
                            <div className="text-sm text-gray-600">{role.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-6 w-6" />
                    <span>Access System</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">Demo Access Credentials:</h4>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => quickLogin(role.value, `${role.value}@jamii.com`)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{role.label}</span>
                      <span className="text-sm text-gray-500">{role.value}@jamii.com</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                All demo accounts use password: <strong>demo123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;