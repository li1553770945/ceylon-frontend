"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InviteCode } from "@/types";
import {
  Plus,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  KeyRound,
} from "lucide-react";

const mockInvites: InviteCode[] = [
  {
    id: "1",
    code: "CEYLON-2025-ABCD",
    max_uses: 10,
    used_count: 3,
    expires_at: "2025-12-31T23:59:59Z",
    note: "内测用户邀请",
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    code: "CEYLON-2025-EFGH",
    max_uses: 5,
    used_count: 5,
    expires_at: "2025-06-30T23:59:59Z",
    note: "早期支持者",
    is_active: false,
    created_at: "2025-01-15T00:00:00Z",
  },
];

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<InviteCode[]>(mockInvites);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    max_uses: 10,
    expires_at: "",
    note: "",
  });

  const handleCreate = () => {
    const newCode: InviteCode = {
      id: Math.random().toString(36).slice(2),
      code: `CEYLON-${Date.now().toString(36).toUpperCase()}`,
      max_uses: form.max_uses,
      used_count: 0,
      expires_at: form.expires_at || null,
      note: form.note || null,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setInvites((prev) => [newCode, ...prev]);
    setForm({ max_uses: 10, expires_at: "", note: "" });
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setInvites((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_active: !i.is_active } : i))
    );
  };

  const handleDelete = (id: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <AuthGuard requireAdmin>
      <AdminShell>
        <div className="space-y-grid-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">邀请码管理</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                创建和管理用户注册邀请码
              </p>
            </div>
            <Button
              className="bg-ceylon-500 hover:bg-ceylon-600"
              onClick={() => setShowForm((s) => !s)}
            >
              <Plus className="mr-2 h-4 w-4" />
              创建邀请码
            </Button>
          </div>

          {showForm && (
            <div className="rounded-lg border border-border bg-card p-grid-4 shadow-sm space-y-grid-3">
              <div className="grid gap-grid-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">最大使用次数</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min={1}
                    value={form.max_uses}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, max_uses: parseInt(e.target.value) || 1 }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires_at">过期时间</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, expires_at: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">备注</Label>
                  <Input
                    id="note"
                    value={form.note}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, note: e.target.value }))
                    }
                    placeholder="用途说明"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-grid-2">
                <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                  取消
                </Button>
                <Button size="sm" className="bg-ceylon-500 hover:bg-ceylon-600" onClick={handleCreate}>
                  确认创建
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">邀请码</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">最大次数</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">已使用</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">过期时间</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">备注</th>
                    <th className="px-grid-4 py-3 text-left font-medium text-muted-foreground">状态</th>
                    <th className="px-grid-4 py-3 text-right font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-grid-4 py-3 font-mono text-xs">
                        <div className="flex items-center gap-grid-2">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                          {invite.code}
                          <button
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => navigator.clipboard.writeText(invite.code)}
                            title="复制"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-grid-4 py-3">{invite.max_uses}</td>
                      <td className="px-grid-4 py-3">{invite.used_count}</td>
                      <td className="px-grid-4 py-3 text-muted-foreground">
                        {invite.expires_at
                          ? new Date(invite.expires_at).toLocaleDateString("zh-CN")
                          : "永不过期"}
                      </td>
                      <td className="px-grid-4 py-3 text-muted-foreground">{invite.note || "—"}</td>
                      <td className="px-grid-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            invite.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {invite.is_active ? "生效中" : "已停用"}
                        </span>
                      </td>
                      <td className="px-grid-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(invite.id)}
                            title={invite.is_active ? "停用" : "启用"}
                          >
                            {invite.is_active ? (
                              <ToggleRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invite.id)}
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {invites.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-grid-4 py-12 text-center text-muted-foreground">
                        暂无邀请码
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminShell>
    </AuthGuard>
  );
}
