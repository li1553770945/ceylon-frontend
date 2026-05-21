"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiJson } from "@/lib/api-client";
import { updateCurrentProfile } from "@/lib/auth-api";
import { useAuthStore } from "@/stores/authStore";
import { Camera, Loader2, Mail, Save, User } from "lucide-react";

export default function ProfilePage() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDisplayName(profile?.display_name || "");
    setAvatarPreview(profile?.avatar_url || "");
    setAvatarFile(null);
  }, [profile]);

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const body = new FormData();
        body.append("file", avatarFile);
        const uploaded = await apiJson<{ url: string }>("/api/v1/uploads/avatar", {
          method: "POST",
          body,
        });
        avatarUrl = uploaded.url;
      }

      const data = await updateCurrentProfile({
        nickname: displayName.trim() || profile.display_name,
        avatar_url: avatarUrl,
      });
      setAuth(data.user, data.profile);
      setSaved(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "保存失败";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <AppShell title="个人资料">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">个人资料</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              管理显示名称、头像和账号邮箱。
            </p>
          </div>

          <section className="space-y-6 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="头像预览"
                    width={80}
                    height={80}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label
                  htmlFor="avatar"
                  className="inline-flex cursor-pointer items-center rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  上传头像
                </Label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatar}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  支持 jpg、png、webp，建议小于 2MB。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">显示名称</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setSaved(false);
                }}
                placeholder="输入显示名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  className="pl-9"
                  value={profile?.email || user?.email || ""}
                  readOnly
                />
              </div>
            </div>

            {saved && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                资料已更新
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              保存资料
            </Button>
          </section>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
