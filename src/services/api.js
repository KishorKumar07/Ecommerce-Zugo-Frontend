import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand persisted store
    const authStorage = localStorage.getItem('auth-storage');
    let token = null;
    
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      } catch (error) {
        console.error('🔴 Error parsing auth-storage:', error);
      }
    }
    
    console.log('📤 API Request Interceptor');
    console.log('📤 URL:', config.url);
    console.log('📤 Method:', config.method);
    console.log('📤 Token from auth-storage:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ No token found in auth-storage for this request!');
    }
    return config;
  },
  (error) => {
    console.error('🔴 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response interceptor:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error interceptor:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      console.error('🚨 401 ERROR - Clearing auth and redirecting to /login');
      // Clear Zustand persisted store
      localStorage.removeItem('auth-storage');
      // Clear any old token/user keys (for backward compatibility)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // TEMPORARILY DISABLED FOR DEBUGGING
      // window.location.href = '/login';
      console.error('🚨 Redirect to /login is DISABLED for debugging');
    }
    return Promise.reject(error);
  }
);

export default api;

