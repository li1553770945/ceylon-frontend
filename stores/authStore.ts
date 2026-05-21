"use client";

import { create } from "zustand";
import { type User, type Profile } from "@/types";
import { clearAuthTokens, getAccessToken, getRefreshToken } from "@/lib/api-client";
import { fetchCurrentProfile } from "@/lib/auth-api";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, profile: Profile) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,

  setAuth: (user, profile) =>
    set({ user, profile, isAuthenticated: true, loading: false }),

  clearAuth: () => {
    clearAuthTokens();
    set({ user: null, profile: null, isAuthenticated: false, loading: false });
  },

  setLoading: (loading) => set({ loading }),

  checkSession: async () => {
    if (!getAccessToken() && !getRefreshToken()) {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
      });
      return;
    }

    try {
      const data = await fetchCurrentProfile();
      set({
        user: data.user,
        profile: data.profile,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      clearAuthTokens();
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
