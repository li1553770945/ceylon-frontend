// ==================== Auth ====================
export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface Profile {
  id: string;
  email: string;
  username?: string;
  display_name: string;
  avatar_url: string | null;
  role: "user" | "admin" | "super_user";
  subscription_tier: "free" | "pro" | "team" | "enterprise";
}

export interface Session {
  authenticated: boolean;
  user: User | null;
  profile: Profile | null;
  permissions: {
    is_admin: boolean;
  };
}

export type ThemeMode = "light" | "dark" | "system";

// ==================== Project ====================
export interface Project {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "admin" | "write" | "read";
  email: string;
  display_name: string;
  avatar_url: string | null;
}

export interface ProjectStats {
  total_requirements: number;
  completed: number;
  in_progress: number;
  bug: number;
}

// ==================== Version View ====================
export interface VersionView {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomColumn {
  id: string;
  view_id: string;
  name: string;
  type: "text" | "select" | "person";
  options: SelectOption[] | null;
  order_index: number;
  created_at: string;
}

export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

// ==================== Requirement ====================
export type RequirementStatus = "pending" | "in_progress" | "completed" | "rejected";
export type RequirementType = "feature" | "bug" | "improvement" | "task";

export interface Requirement {
  id: string;
  view_id: string;
  requirement_number: number;
  title: string;
  description: string | null;
  priority: number;
  status: RequirementStatus;
  type: RequirementType;
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_avatar: string | null;
  custom_values: Record<string, unknown>;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ==================== Blog ====================
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  status: "draft" | "published" | "archived";
  author_id: string | null;
  published_at: string | null;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== Invite ====================
export interface InviteCode {
  id: string;
  code: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  note: string | null;
  is_active: boolean;
  created_at: string;
}

// ==================== CLI Token ====================
export interface CliToken {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

// ==================== Analytics ====================
export interface AdminAnalytics {
  total_users: number;
  total_projects: number;
  total_requirements: number;
  total_blog_posts: number;
}

// ==================== API ====================
export interface ApiError {
  code: string | number;
  message: string;
  details?: Record<string, unknown>;
}

export type ProjectRole = "owner" | "admin" | "write" | "read";
