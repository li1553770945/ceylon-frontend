"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Settings,
  Users,
  LayoutGrid,
  CheckCircle2,
  Clock,
  Bug,
  ListTodo,
} from "lucide-react";

const mockStats = [
  { label: "总需求", value: 128, icon: ListTodo, color: "text-blue-500" },
  { label: "已完成", value: 64, icon: CheckCircle2, color: "text-green-500" },
  { label: "进行中", value: 48, icon: Clock, color: "text-ceylon-500" },
  { label: "Bug", value: 16, icon: Bug, color: "text-red-500" },
];

const mockViews = [
  { id: "view-1", name: "v1.0 MVP", description: "首个最小可用版本" },
  { id: "view-2", name: "v1.1 优化", description: "性能优化和体验改进" },
  { id: "view-3", name: "v2.0 重构", description: "前端架构全面重构" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ceylon-100 text-ceylon-600 dark:bg-ceylon-900 dark:text-ceylon-300">
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  CEYLON 前端重构
                </h1>
                <p className="text-sm text-muted-foreground">
                  将现有前端迁移到 Next.js + Tailwind + shadcn/ui
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/project/${projectId}/team`}>
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  团队
                </Button>
              </Link>
              <Link href={`/dashboard/project/${projectId}/settings`}>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Views */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">版本视图</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockViews.map((view) => (
                <Link
                  key={view.id}
                  href={`/dashboard/project/${projectId}/view/${view.id}`}
                  className="group rounded-lg border bg-card p-5 shadow-sm transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5 text-ceylon-500" />
                    <h3 className="font-semibold">{view.name}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {view.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
