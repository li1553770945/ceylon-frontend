"use client";

import { useState } from "react";
import Image from "next/image";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { Camera, Mail, Save, User } from "lucide-react";

export default function ProfilePage() {
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
  const [saved, setSaved] = useState(false);

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (user && profile) {
      setAuth(user, {
        ...profile,
        display_name: displayName.trim() || profile.display_name,
        avatar_url: avatarPreview || profile.avatar_url,
      });
    }
    setSaved(true);
  };

  return (
    <AuthGuard>
      <AppShell title="个人资料">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">个人资料</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              管理显示名、头像和账户邮箱。
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
                onChange={(event) => setDisplayName(event.target.value)}
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

            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存资料
            </Button>
          </section>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
