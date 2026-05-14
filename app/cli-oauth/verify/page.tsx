"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { apiPost } from "@/lib/api-client";
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Loader2,
  LogIn,
} from "lucide-react";

function CliOAuthVerifyContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const device = searchParams.get("device") || "unknown";
  const session = searchParams.get("session") || "";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "approved" | "denied">("idle");

  const handleApprove = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await apiPost("/api/v1/cli/oauth/approve", { session_token: session });
      setResult("approved");
    } catch {
      setResult("denied");
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await apiPost("/api/v1/cli/oauth/deny", { session_token: session });
      setResult("denied");
    } catch {
      setResult("denied");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-grid-4">
        <div className="w-full max-w-sm space-y-grid-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ceylon-50">
            <Terminal className="h-8 w-8 text-ceylon-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">CLI 授权请求</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              设备 <span className="font-mono font-medium">{device}</span> 请求访问你的 CEYLON 账户
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-grid-4">
            <p className="text-sm text-muted-foreground mb-grid-3">
              请先登录后再进行授权操作
            </p>
            <Button asChild className="w-full bg-ceylon-500 hover:bg-ceylon-600">
              <a href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                前往登录
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-grid-4">
      <div className="w-full max-w-sm space-y-grid-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ceylon-50">
          <Terminal className="h-8 w-8 text-ceylon-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">CLI 授权请求</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            设备 <span className="font-mono font-medium">{device}</span> 请求访问你的 CEYLON 账户
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-grid-4 text-left space-y-grid-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">当前用户</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">请求设备</span>
            <span className="font-mono text-xs">{device}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">权限范围</span>
            <span className="font-medium">CLI 基本访问</span>
          </div>
        </div>

        {result === "idle" && (
          <div className="flex gap-grid-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDeny}
              disabled={loading}
            >
              <XCircle className="mr-2 h-4 w-4" />
              拒绝
            </Button>
            <Button
              className="flex-1 bg-ceylon-500 hover:bg-ceylon-600"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              批准
            </Button>
          </div>
        )}

        {result === "approved" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-grid-4 text-emerald-700">
            <CheckCircle2 className="mx-auto h-6 w-6 mb-2" />
            <p className="text-sm font-medium">授权成功</p>
            <p className="text-xs mt-1">你可以关闭此页面并返回终端</p>
          </div>
        )}

        {result === "denied" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-grid-4 text-red-700">
            <XCircle className="mx-auto h-6 w-6 mb-2" />
            <p className="text-sm font-medium">授权已拒绝</p>
            <p className="text-xs mt-1">你可以关闭此页面并返回终端</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CliOAuthVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylon-500" />
        </div>
      }
    >
      <CliOAuthVerifyContent />
    </Suspense>
  );
}
