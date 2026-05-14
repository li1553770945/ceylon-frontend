"use client";

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "免费",
    description: "适合个人开发者和小型团队入门",
    features: [
      { text: "最多 3 个项目", included: true },
      { text: "无限需求条目", included: true },
      { text: "基础表格视图", included: true },
      { text: "CSV 导入导出", included: true },
      { text: "邮件支持", included: true },
      { text: "自定义列", included: false },
      { text: "团队成员管理", included: false },
      { text: "API 访问", included: false },
    ],
    cta: "免费开始",
    popular: false,
  },
  {
    name: "Team",
    price: "¥29",
    period: "/ 用户 / 月",
    description: "适合成长中的产品团队",
    features: [
      { text: "无限项目", included: true },
      { text: "无限需求条目", included: true },
      { text: "高级表格视图", included: true },
      { text: "CSV/Excel 导入导出", included: true },
      { text: "优先邮件支持", included: true },
      { text: "自定义列", included: true },
      { text: "团队成员管理", included: true },
      { text: "API 访问", included: false },
    ],
    cta: "开始试用",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "定制",
    description: "适合大型组织和企业级需求",
    features: [
      { text: "无限项目", included: true },
      { text: "无限需求条目", included: true },
      { text: "高级表格 + AI 评审", included: true },
      { text: "全格式导入导出", included: true },
      { text: "专属客户成功经理", included: true },
      { text: "自定义列 + 工作流", included: true },
      { text: "SSO / SAML", included: true },
      { text: "API + 私有部署", included: true },
    ],
    cta: "联系销售",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="container-8 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              定价方案
            </h1>
            <p className="text-lg text-muted-foreground">
              选择适合您团队的方案，随时升级或降级
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-lg border bg-card p-6 shadow-sm ${
                  tier.popular ? "border-ceylon-500 ring-1 ring-ceylon-500" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ceylon-500 px-3 py-0.5 text-xs font-medium text-white">
                    最受欢迎
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  )}
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ceylon-500" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={
                          feature.included
                            ? "text-sm"
                            : "text-sm text-muted-foreground"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
