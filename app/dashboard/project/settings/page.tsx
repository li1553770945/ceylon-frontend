"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { type Project, type VersionView } from "@/types";
import { Trash2, Plus, ImageIcon } from "lucide-react";

const mockProject: Project = {
  id: "proj-1",
  name: "官网重构",
  description: "全新品牌官网设计与开发",
  icon_url: null,
  owner_id: "user-1",
  created_at: "2024-01-15T08:00:00Z",
  updated_at: "2024-06-01T10:00:00Z",
};

const mockViews: VersionView[] = [
  {
    id: "view-1",
    project_id: "proj-1",
    name: "v1.0 需求池",
    description: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "view-2",
    project_id: "proj-1",
    name: "v2.0 迭代",
    description: null,
    created_at: "",
    updated_at: "",
  },
];

function ProjectSettingsPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "proj-1";

  const [project, setProject] = useState<Project | null>(null);
  const [views, setViews] = useState<VersionView[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProject(mockProject);
      setName(mockProject.name);
      setDescription(mockProject.description || "");
      setViews(mockViews);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleSave = () => {
    // TODO: apiPatch(`/api/v1/projects/${projectId}`, { name, description })
  };

  const handleDelete = () => {
    if (!confirm("确定要删除该项目吗？此操作不可撤销。")) return;
    // TODO: apiDelete(`/api/v1/projects/${projectId}`)
  };

  const handleDeleteView = (viewId: string) => {
    if (!confirm("确定删除该视图？")) return;
    setViews((prev) => prev.filter((v) => v.id !== viewId));
    // TODO: apiDelete(`/api/v1/projects/${projectId}/views/${viewId}`)
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="text-2xl font-semibold tracking-tight">项目设置</h1>

          <section className="space-y-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-muted-foreground">
              基本信息
            </h2>
            <div className="space-y-2">
              <Label htmlFor="name">项目名称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">项目描述</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>项目图标</Label>
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <Button onClick={handleSave} className="mt-2">
              保存更改
            </Button>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">
                版本视图
              </h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                新建视图
              </Button>
            </div>
            <div className="divide-y divide-border">
              {views.map((view) => (
                <div
                  key={view.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm">{view.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteView(view.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <h2 className="text-sm font-medium text-destructive">危险操作</h2>
            <p className="text-xs text-muted-foreground">
              删除项目将永久清除所有相关数据，无法恢复。
            </p>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除项目
            </Button>
          </section>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

export default function ProjectSettingsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectSettingsPageContent />
    </Suspense>
  );
}
