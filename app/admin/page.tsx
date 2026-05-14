"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminShell } from "@/components/layout/AdminShell";
import { useAuthStore } from "@/stores/authStore";
import { Users, FolderKanban, ListChecks, Newspaper } from "lucide-react";
import type { AdminAnalytics } from "@/types";

const mockStats: AdminAnalytics = {
  total_users: 128,
  total_projects: 45,
  total_requirements: 312,
  total_blog_posts: 24,
};

const cards = [
  {
    label: "总用户数",
    value: mockStats.total_users,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "总项目数",
    value: mockStats.total_projects,
    icon: FolderKanban,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "总需求数",
    value: mockStats.total_requirements,
    icon: ListChecks,
    color: "text-ceylon-600",
    bg: "bg-ceylon-50",
  },
  {
    label: "总博客数",
    value: mockStats.total_blog_posts,
    icon: Newspaper,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export default function AdminDashboardPage() {
  const { profile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (profile && profile.role !== "admin" && profile.role !== "super_user") {
      router.push("/dashboard");
    }
  }, [profile, router]);

  return (
    <AuthGuard requireAdmin>
      <AdminShell>
        <div className="space-y-grid-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">管理概览</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              查看平台整体数据与运营概况
            </p>
          </div>

          <div className="grid gap-grid-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-lg border border-border bg-card p-grid-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-md ${card.bg} p-2`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                  <div className="mt-grid-3">
                    <p className="text-2xl font-bold tabular-nums">{card.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AdminShell>
    </AuthGuard>
  );
}
