"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authStore";
import type { CliToken } from "@/types";
import { KeyRound, LogOut, Plus, Trash2 } from "lucide-react";

const initialTokens: CliToken[] = [
  {
    id: "cli-1",
    name: "MacBook Pro",
    created_at: "2026-05-01T08:00:00Z",
    last_used_at: "2026-05-12T09:30:00Z",
    expires_at: null,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [tokens, setTokens] = useState<CliToken[]>(initialTokens);
  const [tokenName, setTokenName] = useState("");
  const [createdSecret, setCreatedSecret] = useState("");

  const createToken = () => {
    const name = tokenName.trim();
    if (!name) return;
    const now = new Date().toISOString();
    setTokens((prev) => [
      {
        id: `cli-${Date.now()}`,
        name,
        created_at: now,
        last_used_at: null,
        expires_at: null,
      },
      ...prev,
    ]);
    setCreatedSecret(`ceylon_${Math.random().toString(36).slice(2)}_${Date.now()}`);
    setTokenName("");
  };

  const logout = async () => {
    try {
      await apiPost("/api/v1/auth/logout", {});
    } catch {
      // Local logout should still complete if the server token is already invalid.
    }
    clearAuth();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <AppShell title="账号设置">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">账号设置</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              管理登录状态、CLI Token 和危险操作。
            </p>
          </div>

          <section className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-ceylon-500" />
              <h2 className="font-semibold">CLI Token</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="tokenName">Token 名称</Label>
                <Input
                  id="tokenName"
                  placeholder="例如：本机 CLI"
                  value={tokenName}
                  onChange={(event) => setTokenName(event.target.value)}
                />
              </div>
              <Button className="self-end" onClick={createToken}>
                <Plus className="mr-2 h-4 w-4" />
                创建 Token
              </Button>
            </div>

            {createdSecret && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <p className="font-medium">Token 仅展示一次</p>
                <code className="mt-2 block break-all rounded bg-white/70 p-2 text-xs">
                  {createdSecret}
                </code>
              </div>
            )}

            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">名称</th>
                    <th className="px-4 py-3 text-left font-medium">最近使用</th>
                    <th className="px-4 py-3 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tokens.map((token) => (
                    <tr key={token.id}>
                      <td className="px-4 py-3 font-medium">{token.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {token.last_used_at
                          ? new Date(token.last_used_at).toLocaleString()
                          : "尚未使用"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setTokens((prev) =>
                              prev.filter((item) => item.id !== token.id)
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">退出登录</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                清除本地登录状态并返回登录页。
              </p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </section>

          <section className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <h2 className="font-semibold text-destructive">删除账号</h2>
            <p className="text-sm text-muted-foreground">
              删除账号需要后端二次确认和数据归档策略，前端保留入口。
            </p>
            <Button variant="destructive">申请删除账号</Button>
          </section>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

