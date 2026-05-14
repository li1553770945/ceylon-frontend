"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  getClientLocale,
  setClientLocale,
  locales,
  localeLabels,
  type Locale,
} from "@/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const [current, setCurrent] = useState<Locale>(getClientLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(locale: Locale) {
    setClientLocale(locale);
    setCurrent(locale);
    setOpen(false);
    window.location.reload();
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors hover:bg-accent"
        aria-label="切换语言"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeLabels[current]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md border bg-popover p-1 shadow-md">
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => handleSelect(locale)}
              className={cn(
                "flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors",
                current === locale
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              )}
            >
              {localeLabels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
