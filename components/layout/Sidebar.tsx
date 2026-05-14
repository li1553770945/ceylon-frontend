"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Plus,
  Settings,
  LogOut,
  User,
  X,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { ProjectSwitcher } from "./ProjectSwitcher";

interface ViewItem {
  id: string;
  name: string;
}

interface SidebarProps {
  projects?: { id: string; name: string }[];
  currentProjectId?: string;
  views?: ViewItem[];
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent font-medium text-accent-foreground"
          : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function Sidebar({
  projects = [],
  currentProjectId,
  views = [],
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const profile = useAuthStore((s) => s.profile);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
          CEYLON
          <span className="h-2 w-2 rounded-full bg-[#f97316]" />
        </Link>
        {mobileOpen && (
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-input md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-2">
        <ProjectSwitcher projects={projects} currentProjectId={currentProjectId} />
      </div>

      <div className="mt-6 flex-1 overflow-auto px-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          视图
        </div>
        <div className="flex flex-col gap-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="工作台" active />
          {views.map((v) => (
            <NavItem key={v.id} href={`/dashboard/views/${v.id}`} icon={Eye} label={v.name} />
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            快捷操作
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              新建项目
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              新建视图
            </button>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            设置
          </Link>
          <button
            type="button"
            onClick={() => clearAuth()}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{profile?.display_name || "用户"}</span>
            <span className="text-xs text-muted-foreground">{profile?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r bg-background md:block">
        {content}
      </aside>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 bg-background shadow-lg md:hidden">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
