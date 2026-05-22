"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Calendar, Tag, ImageOff } from "lucide-react";
import { getBlogPost } from "@/lib/blog-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/types";

function BlogDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-24" />

      <div className="mt-grid-4">
        <div className="flex flex-wrap items-center gap-grid-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="mt-grid-3 h-10 w-3/4 md:h-12" />
        <Skeleton className="mt-grid-2 h-6 w-1/2" />
      </div>

      <Skeleton className="mt-grid-6 h-64 w-full rounded-lg md:h-80" />

      <div className="mt-grid-8 space-y-grid-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getBlogPost(slug)
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("zh-CN");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicNavbar />
        <main className="flex-1">
          <article className="container-8 py-grid-10 md:py-grid-12">
            <BlogDetailSkeleton />
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicNavbar />
        <main className="flex-1">
          <div className="container-8 py-grid-10 md:py-grid-12 text-center">
            <p className="text-destructive">{error || "文章未找到"}</p>
            <Link
              href="/blog"
              className="mt-grid-4 inline-flex items-center gap-grid-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回博客列表
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <article className="container-8 py-grid-10 md:py-grid-12">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-grid-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回博客列表
            </Link>

            <header className="mt-grid-4">
              <div className="flex flex-wrap items-center gap-grid-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-grid-1">
                  <Tag className="h-4 w-4" />
                  {post.category}
                </span>
                <span className="flex items-center gap-grid-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </div>
              <h1 className="mt-grid-3 text-3xl font-bold tracking-tight md:text-4xl">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="mt-grid-2 text-lg text-muted-foreground">
                  {post.subtitle}
                </p>
              )}
            </header>

            {/* Cover Image */}
            <div className="mt-grid-6 overflow-hidden rounded-lg">
              {post.cover_image ? (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-64 w-full object-cover md:h-80"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-muted md:h-80">
                  <ImageOff className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>

            <div className="mt-grid-8 space-y-grid-4 text-sm leading-relaxed text-foreground/90">
              {post.content.split("\n\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="mt-grid-4 text-xl font-semibold text-foreground"
                    >
                      {trimmed.replace("## ", "")}
                    </h2>
                  );
                }
                if (trimmed.startsWith("> ")) {
                  return (
                    <blockquote
                      key={i}
                      className="border-l-4 border-primary/30 pl-grid-4 italic text-muted-foreground"
                    >
                      {trimmed.replace("> ", "")}
                    </blockquote>
                  );
                }
                if (trimmed.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc space-y-grid-1 pl-grid-4">
                      {trimmed.split("\n").map((item, j) => (
                        <li key={j} className="text-foreground/80">
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (trimmed.startsWith("```")) {
                  const lines = trimmed.split("\n");
                  const code = lines.slice(1, -1).join("\n");
                  return (
                    <pre
                      key={i}
                      className="overflow-x-auto rounded-md bg-muted p-grid-3 text-xs"
                    >
                      <code>{code}</code>
                    </pre>
                  );
                }
                return (
                  <p key={i} className="text-foreground/80">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
