"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogPost } from "@/types";
import { Save, Eye, EyeOff, ArrowLeft } from "lucide-react";

const mockBlog: BlogPost = {
  id: "1",
  slug: "getting-started",
  title: "Getting Started with CEYLON",
  subtitle: "A quick guide",
  category: "教程",
  status: "published",
  cover_url: "",
  summary: "",
  content: "# Getting Started\n\nWelcome to CEYLON!\n\n## Installation\n\nRun the following command...",
  seo_title: "",
  seo_description: "",
  created_at: "2025-01-10T08:00:00Z",
  updated_at: "2025-01-10T08:00:00Z",
};

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Partial<BlogPost>>(
    isNew
      ? {
          slug: "",
          title: "",
          subtitle: "",
          category: "",
          status: "draft",
          cover_url: "",
          summary: "",
          content: "",
          seo_title: "",
          seo_description: "",
        }
      : mockBlog
  );
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof BlogPost, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    // Mock save
    await new Promise((r) => setTimeout(r, 600));
    if (publish) {
      setForm((prev) => ({ ...prev, status: "published" }));
    }
    setSaving(false);
  };

  return (
    <AuthGuard requireAdmin>
      <AdminShell>
        <div className="space-y-grid-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-grid-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/admin/blog")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight">
                {isNew ? "新建博客" : "编辑博客"}
              </h1>
            </div>
            <div className="flex items-center gap-grid-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreview((p) => !p)}
              >
                {preview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {preview ? "编辑" : "预览"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                保存草稿
              </Button>
              <Button
                size="sm"
                className="bg-ceylon-500 hover:bg-ceylon-600"
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                发布
              </Button>
            </div>
          </div>

          {preview ? (
            <div className="rounded-lg border border-border bg-card p-grid-6 shadow-sm prose dark:prose-invert max-w-none">
              <h1>{form.title}</h1>
              {form.subtitle && <p className="text-lg text-muted-foreground">{form.subtitle}</p>}
              <div className="whitespace-pre-wrap">{form.content}</div>
            </div>
          ) : (
            <div className="space-y-grid-4 rounded-lg border border-border bg-card p-grid-6 shadow-sm">
              <div className="grid gap-grid-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug || ""}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="getting-started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={form.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="博客标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">副标题</Label>
                  <Input
                    id="subtitle"
                    value={form.subtitle || ""}
                    onChange={(e) => handleChange("subtitle", e.target.value)}
                    placeholder="副标题（可选）"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">分类</Label>
                  <Input
                    id="category"
                    value={form.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                    placeholder="教程 / 动态 / 技术"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <select
                    id="status"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value as BlogPost["status"])}
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover_url">封面 URL</Label>
                  <Input
                    id="cover_url"
                    value={form.cover_url || ""}
                    onChange={(e) => handleChange("cover_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">摘要</Label>
                <textarea
                  id="summary"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.summary || ""}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  placeholder="文章摘要，用于列表展示"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">正文内容</Label>
                <textarea
                  id="content"
                  className="flex min-h-[320px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  value={form.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="支持 Markdown 格式"
                />
              </div>

              <div className="grid gap-grid-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seo_title">SEO 标题</Label>
                  <Input
                    id="seo_title"
                    value={form.seo_title || ""}
                    onChange={(e) => handleChange("seo_title", e.target.value)}
                    placeholder="SEO 标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo_description">SEO 描述</Label>
                  <Input
                    id="seo_description"
                    value={form.seo_description || ""}
                    onChange={(e) => handleChange("seo_description", e.target.value)}
                    placeholder="SEO 描述"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminShell>
    </AuthGuard>
  );
}
