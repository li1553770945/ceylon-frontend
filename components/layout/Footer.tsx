"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "首页" },
  { href: "/pricing", label: "定价" },
  { href: "/docs", label: "文档" },
  { href: "/blog", label: "博客" },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full border-t bg-background py-8",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <img
            src="/icons/icon.svg"
            alt="锡兰"
            className="h-5 w-auto"
          />
          <span className="font-serif">锡兰</span>
        </div>

        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} 锡兰. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
