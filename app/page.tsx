import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import {
  MessageSquare,
  GitPullRequest,
  Import,
  Cpu,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "反馈处理",
    description:
      "集中收集用户反馈，自动分类与优先级排序，让产品团队快速响应真实需求。",
  },
  {
    icon: GitPullRequest,
    title: "迭代闭环",
    description:
      "从需求提出到开发上线，完整追踪每个迭代周期，确保交付质量可度量。",
  },
  {
    icon: Import,
    title: "智能导入",
    description:
      "支持多种格式一键导入，AI自动解析结构化需求，迁移零成本。",
  },
  {
    icon: Cpu,
    title: "本地AI / CLI 集成",
    description:
      "私有化AI模型支持，配合命令行工具，让工程师在终端即可完成需求管理。",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "免费",
    period: "",
    description: "适合个人开发者和小型项目",
    features: ["1 个项目", "无限需求条目", "基础报表", "社区支持"],
    cta: "免费开始",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Team",
    price: "¥99",
    period: "/ 月",
    description: "适合敏捷开发团队",
    features: [
      "无限项目",
      "高级报表与分析",
      "团队协作空间",
      "API 访问",
      "优先支持",
    ],
    cta: "开始试用",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "定制",
    period: "",
    description: "适合大型组织与私有化部署",
    features: [
      "私有化部署",
      "SSO / SAML",
      "专属客户成功经理",
      "SLA 保障",
      "自定义集成",
    ],
    cta: "联系销售",
    href: "/register",
    highlighted: false,
  },
];

const blogPosts = [
  {
    title: "如何用 CEYLON 管理敏捷迭代",
    summary:
      "探索 CEYLON 的迭代闭环功能，从需求收集到发布追踪的完整实践指南。",
    category: "最佳实践",
    date: "2024-12-15",
    slug: "agile-iteration-with-ceylon",
  },
  {
    title: "AI 辅助需求分析的 5 个技巧",
    summary:
      "利用内置 AI 能力，快速提炼核心需求、识别潜在风险并生成验收标准。",
    category: "AI 功能",
    date: "2024-12-08",
    slug: "ai-requirement-analysis-tips",
  },
  {
    title: "CEYLON CLI 入门指南",
    summary: "在终端中完成需求创建、状态更新与报表导出，提升工程师效率。",
    category: "开发者",
    date: "2024-11-28",
    slug: "ceylon-cli-getting-started",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="container-8 py-grid-12 md:py-grid-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              CEYLON
            </h1>
            <p className="mt-grid-3 text-lg text-muted-foreground md:text-xl">
              AI驱动的需求管理工作台
            </p>
            <p className="mt-grid-2 text-sm text-muted-foreground">
              面向产品、研发、测试、运营团队的可视化协作平台
            </p>
            <div className="mt-grid-6 flex flex-col items-center justify-center gap-grid-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-grid-1">
                  免费开始
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="gap-grid-1">
                  查看文档
                  <BookOpen className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-muted/30">
          <div className="container-8 py-grid-10 md:py-grid-12">
            <div className="mb-grid-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                核心功能
              </h2>
              <p className="mt-grid-2 text-muted-foreground">
                为现代软件团队打造的需求管理工具链
              </p>
            </div>
            <div className="grid gap-grid-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border border-border bg-card p-grid-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-grid-3 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-grid-1 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="container-8 py-grid-10 md:py-grid-12">
          <div className="mb-grid-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              价格方案
            </h2>
            <p className="mt-grid-2 text-muted-foreground">
              灵活的定价，适应不同规模的团队
            </p>
          </div>
          <div className="grid gap-grid-4 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg border p-grid-5 ${
                  tier.highlighted
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <h3 className="text-base font-semibold">{tier.name}</h3>
                <div className="mt-grid-2 flex items-baseline gap-grid-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mt-grid-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-grid-4 space-y-grid-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-grid-1 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-grid-5">
                  <Link href={tier.href}>
                    <Button
                      variant={tier.highlighted ? "default" : "outline"}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Teaser */}
        <section className="border-t border-border bg-muted/30">
          <div className="container-8 py-grid-10 md:py-grid-12">
            <div className="mb-grid-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  博客
                </h2>
                <p className="mt-grid-2 text-muted-foreground">
                  产品更新、最佳实践与技术分享
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-grid-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-grid-4 md:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-lg border border-border bg-card p-grid-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-grid-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mt-grid-3 text-base font-semibold transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-grid-1 text-sm leading-relaxed text-muted-foreground">
                    {post.summary}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-grid-4 sm:hidden">
              <Link
                href="/blog"
                className="flex items-center justify-center gap-grid-1 text-sm font-medium text-primary hover:underline"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
