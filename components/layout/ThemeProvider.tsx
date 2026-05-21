"use client";

import { useEffect } from "react";
import { initTheme, useThemeStore } from "@/stores/themeStore";
import { initLocale } from "@/i18n";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    initTheme();
    initLocale();
  }, []);

  useEffect(() => {
    if (mode !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => initTheme();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return <>{children}</>;
}
