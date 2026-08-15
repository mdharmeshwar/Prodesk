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
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setLoading: (isLoading) => set({ isLoading }),
      login: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),
      syncAuth: (user, token) => set({ user, token, isAuthenticated: !!token && !!user, isLoading: false }),
      initialize: async () => {
        const { token, user } = get();
        set({ isLoading: true });

        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isAuthenticated: true, isLoading: false, user });
      },
    }),
    {
      name: 'prodesk-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
