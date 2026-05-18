"use client";

import { create } from "zustand";
import { type User, type Profile, type Session } from "@/types";
import { apiJson } from "@/lib/api-client";

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

  clearAuth: () =>
    set({ user: null, profile: null, isAuthenticated: false, loading: false }),

  setLoading: (loading) => set({ loading }),

  checkSession: async () => {
    try {
      const data = await apiJson<Session>("/api/v1/auth/session");
      if (data.authenticated && data.user && data.profile) {
        set({
          user: data.user,
          profile: data.profile,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
