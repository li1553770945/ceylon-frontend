"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogPost } from "@/types";
import {
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/blog-api";
import {
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const emptyForm: Partial<BlogPost> = {
  slug: "",
  title: "",
  subtitle: "",
  category: "",
  status: "draft",
  cover_image: "",
  excerpt: "",
  content: "",
  meta_title: "",
  meta_description: "",
};

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === "new";

  const [form, setForm] = useState<Partial<BlogPost>>(emptyForm);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }
    getBlogPost(slug)
      .then((post) => setForm(post))
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false));
  }, [slug, isNew]);

  const handleChange = (field: keyof BlogPost, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        status: publish ? "published" : (form.status || "draft"),
      };
      if (isNew) {
        await createBlogPost(payload as Omit<BlogPost, "id" | "created_at" | "updated_at" | "view_count">);
      } else {
        await updateBlogPost(slug, payload);
      }
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这篇博客吗？此操作不可撤销。")) return;
    setSaving(true);
    try {
      await deleteBlogPost(slug);
      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requireAdmin>
        <AdminShell>
          <div className="space-y-grid-4">
            <div className="flex items-center gap-grid-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-grid-4 rounded-lg border border-border bg-card p-grid-6 shadow-sm">
              <div className="grid gap-grid-4 md:grid-cols-2">
                <div className="space-y-2"><Skeleton className="h-4 w-8" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-8" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-8" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-8" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-9 w-full" /></div>
              </div>
              <div className="space-y-2"><Skeleton className="h-4 w-8" /><Skeleton className="h-20 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-80 w-full" /></div>
              <div className="grid gap-grid-4 md:grid-cols-2">
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-9 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-9 w-full" /></div>
              </div>
            </div>
          </div>
        </AdminShell>
      </AuthGuard>
    );
  }

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
              {!isNew && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </Button>
              )}
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

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

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
                    placeholder="why-we-created-ceylon"
                    disabled={!isNew}
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
                    placeholder="产品动态 / 最佳实践 / 技术"
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
                  <Label htmlFor="cover_image">封面 URL</Label>
                  <Input
                    id="cover_image"
                    value={form.cover_image || ""}
                    onChange={(e) => handleChange("cover_image", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">摘要</Label>
                <textarea
                  id="excerpt"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.excerpt || ""}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
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
                  <Label htmlFor="meta_title">SEO 标题</Label>
                  <Input
                    id="meta_title"
                    value={form.meta_title || ""}
                    onChange={(e) => handleChange("meta_title", e.target.value)}
                    placeholder="SEO 标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">SEO 描述</Label>
                  <Input
                    id="meta_description"
                    value={form.meta_description || ""}
                    onChange={(e) => handleChange("meta_description", e.target.value)}
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
