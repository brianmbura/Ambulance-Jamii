import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import EmergencyRequestForm from './components/Emergency/EmergencyRequestForm';
import DispatchDashboard from './components/Dispatch/DispatchDashboard';
import DriverInterface from './components/Driver/DriverInterface';
import HospitalDashboard from './components/Hospital/HospitalDashboard';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="py-8">
                    <Routes>
                      <Route path="/" element={<EmergencyRequestForm />} />
                      <Route
                        path="/dispatch"
                        element={
                          <ProtectedRoute requiredRoles={['dispatcher']}>
                            <DispatchDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/driver"
                        element={
                          <ProtectedRoute requiredRoles={['driver']}>
                            <DriverInterface />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/hospitals"
                        element={
                          <ProtectedRoute requiredRoles={['hospital', 'dispatcher']}>
                            <HospitalDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute requiredRoles={['analytics', 'dispatcher']}>
                            <AnalyticsDashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;