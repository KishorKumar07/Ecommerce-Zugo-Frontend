import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  async register(userData) {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    // Token and user will be stored by authStore, not here
    return response.data;
  },

  async login(credentials) {
    console.log('🔑 AuthService: Logging in...');
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    console.log('🔑 AuthService: Login response received:', response.data);
    // Token and user will be stored by authStore, not here
    return response.data;
  },

  logout() {
    // Clear Zustand persisted store
    localStorage.removeItem('auth-storage');
    // Clear any old token/user keys (for backward compatibility)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    // Get user from Zustand persisted store
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.user || null;
      } catch (error) {
        console.error('🔴 Error parsing auth-storage:', error);
        return null;
      }
    }
    return null;
  },

  getToken() {
    // Get token from Zustand persisted store
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      } catch (error) {
        console.error('🔴 Error parsing auth-storage:', error);
        return null;
      }
    }
    return null;
  }
};

