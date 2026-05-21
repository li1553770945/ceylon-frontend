"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlogPost } from "@/types";
import {
  Plus,
  Search,
  Pencil,
  Filter,
} from "lucide-react";

const mockBlogs: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started",
    title: "Getting Started with CEYLON",
    subtitle: "A quick guide",
    category: "教程",
    status: "published",
    cover_url: null,
    summary: null,
    content: "",
    seo_title: null,
    seo_description: null,
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "2",
    slug: "roadmap-2025",
    title: "CEYLON 2025 Roadmap",
    subtitle: null,
    category: "动态",
    status: "draft",
    cover_url: null,
    summary: null,
    content: "",
    seo_title: null,
    seo_description: null,
    created_at: "2025-02-15T10:00:00Z",
    updated_at: "2025-02-15T10:00:00Z",
  },
  {
    id: "3",
    slug: "api-release",
    title: "API v2 Release",
    subtitle: null,
    category: "技术",
    status: "archived",
    cover_url: null,
    summary: null,
    content: "",
    seo_title: null,
    seo_description: null,
    created_at: "2024-12-01T06:00:00Z",
    updated_at: "2024-12-01T06:00:00Z",
  },
];

const statusLabel: Record<BlogPost["status"], string> = {
  draft: "草稿",
  published: "已发布",
  archived: "已归档",
};

const statusStyle: Record<BlogPost["status"], string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function AdminBlogPage() {
  const [filterStatus, setFilterStatus] = useState<BlogPost["status"] | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return mockBlogs.filter((b) => {
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const matchSearch =
        search.trim() === "" ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.slug.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [filterStatus, search]);

  return (
    <AuthGuard requireAdmin>
      <AdminShell>
        <div className="space-y-grid-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">博客管理</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                管理博客文章，支持草稿、发布与归档
              </p>
            </div>
            <Button asChild className="bg-ceylon-500 hover:bg-ceylon-600">
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                新建博客
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-grid-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索标题或 slug..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-grid-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as BlogPost["status"] | "all")}
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">标题</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">分类</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">状态</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">创建时间</th>
                    <th className="px-grid-4 py-3 text-right font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((blog) => (
                    <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-grid-4 py-3 font-mono text-xs text-muted-foreground">{blog.slug}</td>
                      <td className="px-grid-4 py-3 font-medium">{blog.title}</td>
                      <td className="px-grid-4 py-3 text-muted-foreground">{blog.category}</td>
                      <td className="px-grid-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[blog.status]}`}
                        >
                          {statusLabel[blog.status]}
                        </span>
                      </td>
                      <td className="px-grid-4 py-3 text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString("zh-CN")}
                      </td>
                      <td className="px-grid-4 py-3 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/blog/${blog.slug}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-grid-4 py-12 text-center text-muted-foreground">
                        没有找到符合条件的博客
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminShell>
    </AuthGuard>
  );
}
