import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(credentials);
          localStorage.setItem('token', data.token);
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.register(userData);
          localStorage.setItem('token', data.token);
          set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      getMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await authService.getMe();
          set({ user: data.user, isAuthenticated: true, isLoading: false, token });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          localStorage.removeItem('token');
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (err) {}
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
        window.location.href = '/login';
      },

      updateProfile: async (data) => {
        try {
          const response = await authService.updateProfile(data);
          set({ user: response.data.user });
          return { success: true };
        } catch (error) {
          return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
