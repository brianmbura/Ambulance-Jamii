import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { initializeSocket } from './store/slices/socketSlice';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmergencyRequestPage from './pages/EmergencyRequestPage';
import DispatchDashboard from './pages/DispatchDashboard';
import DriverDashboard from './pages/DriverDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { user, isLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load user from localStorage on app start
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    // Initialize socket connection when user is authenticated
    if (token && user) {
      dispatch(initializeSocket(token));
    }
  }, [dispatch, token, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emergency" element={<EmergencyRequestPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRedirect />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dispatch"
            element={
              <ProtectedRoute roles={['dispatcher', 'super_admin']}>
                <Layout>
                  <DispatchDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver"
            element={
              <ProtectedRoute roles={['driver', 'super_admin']}>
                <Layout>
                  <DriverDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hospital"
            element={
              <ProtectedRoute roles={['hospital_admin', 'super_admin']}>
                <Layout>
                  <HospitalDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={['analytics_admin', 'dispatcher', 'super_admin']}>
                <Layout>
                  <AnalyticsDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Component to redirect to appropriate dashboard based on user role
const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  const roleRedirects = {
    dispatcher: '/dispatch',
    driver: '/driver',
    hospital_admin: '/hospital',
    analytics_admin: '/analytics',
    super_admin: '/dispatch', // Default to dispatch for super admin
  };

  const redirectPath = roleRedirects[user.role] || '/emergency';
  return <Navigate to={redirectPath} replace />;
};

export default App;