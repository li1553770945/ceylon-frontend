"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  KeyRound,
  PanelLeft,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const adminNav: AdminNavItem[] = [
  { href: "/admin", icon: BarChart3, label: "概览" },
  { href: "/admin/blog", icon: FileText, label: "博客管理" },
  { href: "/admin/invites", icon: KeyRound, label: "邀请码" },
];

interface AdminShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminShell({ children, className }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-200",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Top bar inside sidebar */}
        <div className="flex h-16 items-center gap-2 border-b px-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 text-base font-bold">
              CEYLON
              <span className="h-2 w-2 rounded-full bg-[#c85c1b]" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent",
              collapsed && "mx-auto"
            )}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to dashboard */}
        <div className="mt-auto border-t p-3">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "返回控制台" : undefined}
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            {!collapsed && "返回控制台"}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center border-b bg-background px-6">
          <h1 className="text-lg font-semibold">管理后台</h1>
          <Link
            href="/dashboard"
            className="ml-auto text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            返回控制台
          </Link>
        </header>

        <main className={cn("flex-1 overflow-auto p-6", className)}>{children}</main>
      </div>
    </div>
  );
}
