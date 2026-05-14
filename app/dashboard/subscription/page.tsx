"use client";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "¥0",
    features: ["3 个项目", "基础需求表格", "CSV 导入"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "¥49/月",
    features: ["无限项目", "自定义列", "CLI Token", "导出 Excel"],
  },
  {
    id: "team",
    name: "Team",
    price: "¥199/月",
    features: ["团队权限", "管理员后台", "AI 评审 Diff", "优先支持"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "联系销售",
    features: ["私有部署", "SSO", "审计日志", "专属支持"],
  },
];

export default function SubscriptionPage() {
  const tier = useAuthStore((state) => state.profile?.subscription_tier || "free");

  return (
    <AuthGuard>
      <AppShell title="订阅">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">订阅信息</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              当前套餐、权益对比和升级入口。
            </p>
          </div>

          <div className="rounded-lg border border-ceylon-200 bg-ceylon-50 p-5 text-ceylon-900">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5" />
              <span className="text-sm font-medium">当前套餐</span>
            </div>
            <p className="mt-2 text-2xl font-semibold uppercase">{tier}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const active = plan.id === tier;
              return (
                <section
                  key={plan.id}
                  className={`rounded-lg border bg-card p-5 ${
                    active ? "border-ceylon-400 shadow-sm" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{plan.name}</h2>
                    {active && (
                      <span className="rounded-full bg-ceylon-100 px-2 py-1 text-xs text-ceylon-700">
                        当前
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-2xl font-bold">{plan.price}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-5 w-full"
                    variant={active ? "outline" : "default"}
                  >
                    {plan.id === "enterprise"
                      ? "联系销售"
                      : active
                        ? "已启用"
                        : "升级"}
                  </Button>
                </section>
              );
            })}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}

