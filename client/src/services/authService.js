import api from './api';

const API_URL = '/api/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Get current user
const getMe = async () => {
  const response = await api.get(`${API_URL}/me`);
  
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Update profile
const updateProfile = async (profileData) => {
  const response = await api.put(`${API_URL}/profile`, profileData);
  
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put(`${API_URL}/change-password`, passwordData);
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    await api.post(`${API_URL}/logout`);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const authService = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
};

export default authService;