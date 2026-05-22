"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, ImageOff } from "lucide-react";
import { getBlogPosts } from "@/lib/blog-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@/types";

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-1 flex-col p-grid-5">
        <div className="flex items-center gap-grid-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="mt-grid-3 h-5 w-3/4" />
        <Skeleton className="mt-grid-1 h-4 w-1/2" />
        <Skeleton className="mt-grid-2 h-4 w-full" />
        <Skeleton className="mt-grid-1 h-4 w-5/6" />
        <Skeleton className="mt-grid-4 h-4 w-20" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("zh-CN");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="container-8 py-grid-10 md:py-grid-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              博客
            </h1>
            <p className="mt-grid-2 text-muted-foreground">
              产品更新、最佳实践与技术分享
            </p>
          </div>

          {error && (
            <div className="mt-grid-8 text-center text-destructive">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="mt-grid-8 text-center text-muted-foreground">
              暂无博客文章
            </div>
          )}

          <div className="mt-grid-8 grid gap-grid-4 md:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <>
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
                <BlogCardSkeleton />
              </>
            )}

            {!loading &&
              posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/30"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-grid-5">
                    <div className="flex items-center gap-grid-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                        {post.category}
                      </span>
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <h2 className="mt-grid-3 text-base font-semibold transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-grid-1 text-sm text-muted-foreground">
                      {post.subtitle}
                    </p>
                    <p className="mt-grid-2 flex-1 text-sm leading-relaxed text-muted-foreground/80">
                      {post.excerpt || post.content.slice(0, 120) + "..."}
                    </p>
                    <div className="mt-grid-4 flex items-center gap-grid-1 text-sm font-medium text-primary">
                      阅读更多
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
