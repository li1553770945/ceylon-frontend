"use client";

import { create } from "zustand";
import { type User, type Profile, type Session } from "@/types";

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
      const res = await fetch(`${API_BASE}/api/v1/auth/session`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Session invalid");
      const data: Session = await res.json();
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
