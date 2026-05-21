"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/pricing", label: "定价" },
  { href: "/docs", label: "文档" },
  { href: "/blog", label: "博客" },
];

export function PublicNavbar({ className }: { className?: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icons/icon.svg"
              alt="CEYLON"
              className="h-6 w-auto"
            />
            <span className="font-serif text-xl font-bold">锡兰</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-[#c85c1b] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c85c1b]/90"
            >
              进入控制台
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#c85c1b] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c85c1b]/90"
              >
                免费开始使用
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="菜单"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-[#c85c1b] px-4 py-2 text-center text-sm font-medium text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  进入控制台
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-foreground/80"
                    onClick={() => setMobileOpen(false)}
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-[#c85c1b] px-4 py-2 text-center text-sm font-medium text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    免费开始使用
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
