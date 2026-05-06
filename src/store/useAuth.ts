import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@shared/types';
interface AuthStore {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (user: UserSession) => void;
  logout: () => void;
}
export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'way-of-dao-auth-v1',
    }
  )
);