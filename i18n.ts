import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const locales = ["zh", "en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export const localeLabels: Record<Locale, string> = {
  zh: "简体中文",
  en: "English",
  ja: "日本語",
};

export function getClientLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem("ceylon-locale") as Locale | null;
  if (stored && locales.includes(stored)) return stored;
  const browserLang = navigator.language.split("-")[0] as Locale;
  if (locales.includes(browserLang)) return browserLang;
  return defaultLocale;
}

export function setClientLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ceylon-locale", locale);
}
