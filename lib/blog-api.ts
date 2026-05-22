import { apiGet, apiPost, apiJson, apiDelete } from "@/lib/api-client";
import type { BlogPost } from "@/types";

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiGet<BlogPost[]>(`/api/v1/blog${query}`, { auth: false });
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  return apiGet<BlogPost>(`/api/v1/blog/${encodeURIComponent(slug)}`, { auth: false });
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return apiGet<BlogPost[]>("/api/v1/admin/blog");
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "created_at" | "updated_at" | "view_count">
): Promise<BlogPost> {
  return apiPost<BlogPost>("/api/v1/admin/blog", data);
}

export async function updateBlogPost(
  slug: string,
  data: Partial<Omit<BlogPost, "id" | "created_at" | "updated_at" | "view_count">>
): Promise<BlogPost> {
  return apiJson<BlogPost>(`/api/v1/admin/blog/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBlogPost(slug: string): Promise<unknown> {
  return apiDelete<unknown>(`/api/v1/admin/blog/${encodeURIComponent(slug)}`);
}
