import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Auth {
  account_id: string;
  email: string;
  role: "owner" | "admin" | "customer";
}

interface AuthState {
  auth: Auth | null;
  access_token: string | null;
  isAuth: boolean;
  setAuth: (auth: Auth | null, access_token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      access_token: null,
      isAuth: false,
      setAuth: (auth, access_token) => {
        set({ auth, access_token, isAuth: true });
      },
      clearAuth: () => set({ auth: null, access_token: null, isAuth: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
