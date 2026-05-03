import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData } from '../types';

interface UserStore {
  user: UserData | null;
  isJoined: boolean;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isJoined: false,

      setUser: (user) => set({ user, isJoined: true }),

      clearUser: () => set({ user: null, isJoined: false }),
    }),
    {
      name: 'gridwars-user',
      // Only persist the user object — isJoined is derived
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.user) state.isJoined = true;
      },
    },
  ),
);
