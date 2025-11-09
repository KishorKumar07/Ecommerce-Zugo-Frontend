import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: authService.getCurrentUser(),
      token: authService.getToken(),
      isAuthenticated: !!authService.getToken(),
      loading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.login(credentials);
          console.log('🟢 AuthStore: Login successful, updating store with:', data);
          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
            loading: false
          });
          console.log('🟢 AuthStore: Store updated, token:', data.token);
          return data;
        } catch (error) {
          console.error('🔴 AuthStore: Login failed:', error);
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false
          });
          return data;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            loading: false
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }), // only persist these fields
    }
  )
);

