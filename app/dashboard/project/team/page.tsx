"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type ProjectMember } from "@/types";
import { UserPlus, X } from "lucide-react";

const mockMembers: ProjectMember[] = [
  {
    id: "m1",
    project_id: "proj-1",
    user_id: "u1",
    role: "owner",
    email: "alice@example.com",
    display_name: "Alice",
    avatar_url: null,
  },
  {
    id: "m2",
    project_id: "proj-1",
    user_id: "u2",
    role: "admin",
    email: "bob@example.com",
    display_name: "Bob",
    avatar_url: null,
  },
  {
    id: "m3",
    project_id: "proj-1",
    user_id: "u3",
    role: "write",
    email: "carol@example.com",
    display_name: "Carol",
    avatar_url: null,
  },
  {
    id: "m4",
    project_id: "proj-1",
    user_id: "u4",
    role: "read",
    email: "dave@example.com",
    display_name: "Dave",
    avatar_url: null,
  },
];

function ProjectTeamPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "proj-1";

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMembers(mockMembers);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    // TODO: apiPost(`/api/v1/projects/${projectId}/members`, { email: inviteEmail, role: "read" })
    setInviteEmail("");
  };

  const handleRemove = (memberId: string) => {
    if (!confirm("确定移除该成员？")) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    // TODO: apiDelete(`/api/v1/projects/${projectId}/members/${memberId}`)
  };

  const handleRoleChange = (
    memberId: string,
    newRole: ProjectMember["role"]
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    // TODO: apiPatch(`/api/v1/projects/${projectId}/members/${memberId}`, { role: newRole })
  };

  return (
    <AuthGuard>
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-2xl font-semibold tracking-tight">团队成员</h1>

          <div className="flex gap-2">
            <Input
              placeholder="输入邮箱邀请成员"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleInvite}>
              <UserPlus className="mr-2 h-4 w-4" />
              邀请
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">成员</th>
                    <th className="px-4 py-3 text-left font-medium">角色</th>
                    <th className="px-4 py-3 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((member) => (
                    <tr key={member.id} className="bg-card">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ceylon-100 text-xs font-medium text-ceylon-600 dark:bg-ceylon-900/30 dark:text-ceylon-400">
                            {(
                              member.display_name?.[0] || member.email[0]
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.display_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(
                              member.id,
                              e.target.value as ProjectMember["role"]
                            )
                          }
                        >
                          <option value="owner">owner</option>
                          <option value="admin">admin</option>
                          <option value="write">write</option>
                          <option value="read">read</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(member.id)}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}

export default function ProjectTeamPage() {
  return (
    <Suspense fallback={null}>
      <ProjectTeamPageContent />
    </Suspense>
  );
}
