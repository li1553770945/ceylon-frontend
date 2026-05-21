"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import {
  loginWithPassword,
  sendLoginCode,
  loginWithCode,
} from "@/lib/auth-api";
import { setAuthTokens } from "@/lib/api-client";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CaptchaDialog = dynamic(
  () => import("@/components/captcha/CaptchaDialog"),
  { ssr: false }
);

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const teamMembers = [
  {
    name: "锦恢",
    avatar:
      "https://kirigaya.cn/api/storage/image/avatar_32e16cb9-e5a4-4526-82fa-15ab7a7c06b9.jpg",
  },
  {
    name: "peacesheep",
    avatar:
      "https://pic1.zhimg.com/80/v2-c22e2bac5ed568b497cba1be8a59468d_1440w.png",
  },
];

function QuoteAuthor() {
  const member = useMemo(
    () => teamMembers[Math.floor(Math.random() * teamMembers.length)],
    []
  );
  return (
    <div className="mt-8 flex items-center gap-3">
      <img
        src={member.avatar}
        alt={member.name}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
      />
      <div>
        <p className="text-sm font-medium text-white">{member.name}</p>
        <p className="text-xs text-white/60">CEYLON Team</p>
      </div>
    </div>
  );
}

function SeparatorWithText({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{text}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function WatchaIcon({ className }: { className?: string }) {
  return (
    <img
      src="/icons/watcha-logo.png"
      alt="观猹"
      className={className}
    />
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const setAuth = useAuthStore((s) => s.setAuth);

  // OAuth callback handler
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const expiresIn = searchParams.get("expires_in");

    if (accessToken && refreshToken) {
      setAuthTokens({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: Number(expiresIn) || 3600,
      });
      // Clear tokens from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("access_token");
      url.searchParams.delete("refresh_token");
      url.searchParams.delete("expires_in");
      window.history.replaceState({}, "", url.toString());

      // Fetch profile and redirect
      import("@/lib/auth-api").then(({ fetchCurrentProfile }) => {
        fetchCurrentProfile()
          .then((data) => {
            setAuth(data.user, data.profile);
            router.push(next);
          })
          .catch(() => {
            // ignore
          });
      });
    }
  }, [searchParams, router, next, setAuth]);

  const [loginMethod, setLoginMethod] = useState<"password" | "code">(
    "password"
  );

  // Password login state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Code login state
  const [codeEmail, setCodeEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [captchaOpen, setCaptchaOpen] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOAuth = (provider: "github" | "watcha") => {
    const redirectUrl = `${window.location.origin}/login?next=${encodeURIComponent(next)}`;
    const state = `web:${redirectUrl}`;
    window.location.href = `${API_BASE}/api/v1/auth/oauth/${provider}?state=${encodeURIComponent(state)}`;
  };

  const handleCaptchaSuccessForSendCode = async (captchaToken: string) => {
    setCaptchaOpen(false);
    if (!codeEmail || countdown > 0) return;
    setError("");
    try {
      await sendLoginCode(codeEmail.trim(), captchaToken);
      setCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "发送失败";
      setError(msg);
    }
  };

  const handleSendCode = () => {
    if (!codeEmail || countdown > 0) return;
    setCaptchaOpen(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginWithPassword(identifier.trim(), password);
      setAuth(data.user, data.profile);
      router.push(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "登录失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginWithCode(codeEmail.trim(), code.trim());
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
            <img src="/icons/icon.svg" alt="锡兰" className="h-6 w-auto" />
            <span className="font-serif text-lg font-bold">锡兰</span>
          </Link>
        </div>

        {/* Middle: Form */}
        <div className="mx-auto w-full max-w-[400px]">
          <CaptchaDialog
            open={captchaOpen}
            onClose={() => setCaptchaOpen(false)}
            onSuccess={handleCaptchaSuccessForSendCode}
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              欢迎回来
            </h1>
            <p className="text-sm text-muted-foreground">登录您的账户</p>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 border-border bg-background py-5 text-sm font-medium hover:bg-muted"
              onClick={() => handleOAuth("github")}
            >
              <Github className="h-4 w-4" />
              使用 GitHub 登录
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 border-border bg-background py-5 text-sm font-medium hover:bg-muted"
              onClick={() => handleOAuth("watcha")}
            >
              <WatchaIcon className="h-4 w-4" />
              使用观猹登录
            </Button>
          </div>

          <div className="mt-6">
            <SeparatorWithText text="或使用邮箱" />
          </div>

          {/* Login Method Tabs */}
          <div className="mt-6 flex rounded-lg border border-border p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod("password");
                setError("");
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                loginMethod === "password"
                  ? "bg-ceylonm text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              密码登录
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMethod("code");
                setError("");
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                loginMethod === "code"
                  ? "bg-ceylonm text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              验证码登录
            </button>
          </div>

          {loginMethod === "password" ? (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-6 space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">
                  邮箱或用户名
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="you@example.com / 用户名"
                    className="pl-9"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                登录
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code-email" className="text-sm font-medium">
                  邮箱
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={codeEmail}
                    onChange={(e) => setCodeEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  验证码
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="6位验证码"
                    className="flex-1"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || !codeEmail}
                  >
                    {countdown > 0 ? `${countdown}s` : "发送验证码"}
                  </Button>
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
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                登录
              </Button>
            </form>
          )}

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
      <div
        className="relative hidden w-1/2 md:flex md:items-center md:justify-center"
        style={{
          background:
            "linear-gradient(160deg, #d9824e 0%, #c85c1b 30%, #ae4d13 70%, #893d0f 100%)",
        }}
      >
        {/* Dot grid background with gradient fade */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.75) 1.5px, transparent 1.5px)",
            backgroundSize: "48px 48px",
            maskImage:
              "linear-gradient(160deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 100%)",
            WebkitMaskImage:
              "linear-gradient(160deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        {/* Subtle grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        {/* Radial glow decorations */}
        <div className="absolute inset-0">
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,200,150,0.06) 0%, transparent 35%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-md px-12">
          <blockquote className="text-2xl font-medium leading-relaxed text-white">
            &ldquo;锡兰，让 AI 接管你的需求工作流，实现软件迭代的智能闭环。&rdquo;
          </blockquote>
          <QuoteAuthor />
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
