import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Auth {
  account_id: string;
  email: string;
  role: "owner" | "admin" | "customer";
}

interface AuthState {
  auth: Auth | null;
  isAuthLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
  access_token: string | null;
  isAuth: boolean;
  setAuth: (auth: Auth | null, access_token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      access_token: null,
      isAuth: false,
      isAuthLoading: true,
      setAuth: (auth, access_token) => {
        set({ auth, access_token, isAuth: !!auth, isAuthLoading: false });
      },
      setAuthLoading: (loading) => set({ isAuthLoading: loading }),
      clearAuth: () => set({ auth: null, access_token: null, isAuth: false }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.isAuthLoading = false;
      },
    }
  )
);
