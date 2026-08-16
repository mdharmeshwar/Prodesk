import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setLoading: (isLoading) => set({ isLoading }),
      login: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
      syncAuth: (user, token) => set({ user, token, isAuthenticated: !!token && !!user, isLoading: false }),
    }),
    {
      name: 'prodesk-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
