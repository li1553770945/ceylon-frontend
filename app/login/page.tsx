"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { loginWithPassword } from "@/lib/auth-api";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginWithPassword(email.trim(), password);
      setAuth(data.user, data.profile);
      router.push(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "登录失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Login Form */}
      <div className="flex w-full flex-col justify-between px-8 py-8 md:w-1/2 md:px-16 lg:px-24">
        {/* Top: Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/icons/icon.svg"
              alt="锡兰"
              className="h-6 w-auto"
            />
            <span className="font-serif text-lg font-bold">锡兰</span>
          </Link>
        </div>

        {/* Middle: Form */}
        <div className="mx-auto w-full max-w-[400px]">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
            <p className="text-sm text-muted-foreground">
              登录您的账户
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                邮箱或用户名
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com / 用户名"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  密码
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  忘记密码？
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-ceylonm py-5 text-base font-semibold text-white shadow-md shadow-ceylonm/20 hover:bg-ceylonm/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              登录
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">还没有账户？</span>{" "}
            <Link
              href="/register"
              className="font-medium text-ceylonm hover:underline"
            >
              注册
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回首页
            </Link>
          </div>
        </div>

        {/* Bottom: Terms */}
        <p className="text-center text-xs text-muted-foreground">
          继续使用即表示您同意锡兰的
          <Link href="/" className="hover:text-foreground hover:underline">
            《服务条款》
          </Link>
          和
          <Link href="/" className="hover:text-foreground hover:underline">
            《隐私政策》
          </Link>
          ，并同意接收定期更新邮件。
        </p>
      </div>

      {/* Right - Brand Quote */}
      <div className="relative hidden w-1/2 bg-[#0a0a0a] md:flex md:items-center md:justify-center">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-md px-12">
          <blockquote className="text-2xl font-medium leading-relaxed text-white">
            &ldquo;锡兰，让 AI 接管你的需求工作流，实现软件迭代的智能闭环。&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ceylonm/20">
              <img
                src="/icons/icon.svg"
                alt="锡兰"
                className="h-6 w-auto"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">锡兰团队</p>
              <p className="text-xs text-white/60">CEYLON Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-ceylonm" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
