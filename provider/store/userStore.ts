import type { User } from "@/lib/types/user-type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  setUser: (user: User | null, isUserLoading?: boolean) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  isUserLoading: boolean;
  setUserLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isUserLoading: true, // initialize as true if you want
      setUser: (user, isUserLoading = false) => set({ user, isUserLoading }),
      clearUser: () => set({ user: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : (updates as User),
        })),
      setUserLoading: (loading) => set({ isUserLoading: loading }),
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.isUserLoading = false;
      },
    }
  )
);
