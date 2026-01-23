import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
  checkAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      signIn: (user) => {
        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("valyu_user", JSON.stringify(user));
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },

      signOut: () => {
        set({ isLoading: true });

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("valyu_user");
          localStorage.removeItem("valyu_access_token");
        }

        // Clear state
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      checkAuthFromStorage: () => {
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("valyu_user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            if (user && user.id && user.email) {
              set({ user, isAuthenticated: true });
              return;
            }
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }

        // No valid stored user
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "globalthreatmap-auth",
    }
  )
);
