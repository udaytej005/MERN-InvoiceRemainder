import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const invoiceApi = {
  getAll: () => api.get('/invoices'),
  
  create: (invoiceData) => api.post('/invoices', invoiceData),
  
  triggerReminder: (invoiceId) => 
    api.post('/automation/trigger', { invoiceId }),
};

export const authApi = {
  loginWithGoogle: (code) => 
    api.post('/auth/google/callback', { code }),
};

export default api;