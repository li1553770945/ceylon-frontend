"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ThemeMode } from "@/types";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  getEffectiveMode: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (mode) => {
        set({ mode });
        applyTheme(mode);
      },
      getEffectiveMode: () => {
        const { mode } = get();
        if (mode === "system") {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        }
        return mode;
      },
    }),
    {
      name: "ceylon-theme",
    }
  )
);

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const effective =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;

  if (effective === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function initTheme() {
  const stored = localStorage.getItem("ceylon-theme");
  const mode: ThemeMode =
    stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  applyTheme(mode);
}
