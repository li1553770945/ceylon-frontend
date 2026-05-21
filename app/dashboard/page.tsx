"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Plus, FolderOpen, MoreHorizontal } from "lucide-react";

const mockProjects = [
  {
    id: "proj-1",
    name: "CEYLON 前端重构",
    description: "将现有前端迁移到 Next.js + Tailwind + shadcn/ui",
    icon_url: null,
    owner_name: "锦恢",
  },
  {
    id: "proj-2",
    name: "移动端适配",
    description: "iOS 和 Android 客户端的需求跟踪",
    icon_url: null,
    owner_name: "产品经理 A",
  },
  {
    id: "proj-3",
    name: "AI 评审模块",
    description: "集成大模型进行需求自动评审和 Diff 生成",
    icon_url: null,
    owner_name: "锦恢",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects] = useState(mockProjects);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard>
      <AppShell>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">项目列表</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建项目
            </Button>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/project?projectId=${project.id}`}
                className="group relative rounded-lg border bg-card p-5 shadow-sm transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ceylon-100 text-ceylon-600 dark:bg-ceylon-900 dark:text-ceylon-300">
                    <FolderOpen className="h-5 w-5" />
                  </div>
                  <button className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold">{project.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  所有者: {project.owner_name}
                </p>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <FolderOpen className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                未找到匹配的项目
              </p>
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}
