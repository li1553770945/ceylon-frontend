import Link from "next/link";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "agile-iteration-with-ceylon",
    title: "如何用 CEYLON 管理敏捷迭代",
    subtitle: "从需求收集到发布追踪的完整实践指南",
    summary:
      "探索 CEYLON 的迭代闭环功能，学习如何在每个 Sprint 中高效管理需求、追踪进度并度量交付质量。",
    category: "最佳实践",
    date: "2024-12-15",
  },
  {
    slug: "ai-requirement-analysis-tips",
    title: "AI 辅助需求分析的 5 个技巧",
    subtitle: "让 AI 成为您的产品助理",
    summary:
      "利用内置 AI 能力，快速提炼核心需求、识别潜在风险并生成验收标准，大幅提升需求文档质量。",
    category: "AI 功能",
    date: "2024-12-08",
  },
  {
    slug: "ceylon-cli-getting-started",
    title: "CEYLON CLI 入门指南",
    subtitle: "在终端中完成一切需求管理操作",
    summary:
      "安装并配置 CEYLON 命令行工具，学习常用命令与脚本化工作流，让工程师效率翻倍。",
    category: "开发者",
    date: "2024-11-28",
  },
  {
    slug: "team-collaboration-patterns",
    title: "跨团队协作的最佳模式",
    subtitle: "打破部门墙，实现高效信息流转",
    summary:
      "分享产品、研发、测试、运营四部门在 CEYLON 中协同工作的典型模式与权限配置建议。",
    category: "最佳实践",
    date: "2024-11-20",
  },
  {
    slug: "security-whitepaper",
    title: "CEYLON 安全白皮书",
    subtitle: "数据安全与隐私保护架构解析",
    summary:
      "深入解析 CEYLON 的端到端加密、访问控制与合规认证体系，帮助安全团队评估风险。",
    category: "安全",
    date: "2024-11-10",
  },
  {
    slug: "roadmap-2025",
    title: "CEYLON 2025 产品路线图",
    subtitle: "即将发布的重要功能与改进",
    summary:
      "预览下一代 AI 助手、实时协作编辑器、以及更强大的数据分析仪表盘。",
    category: "产品动态",
    date: "2024-11-01",
  },
];

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="container-8 py-grid-10 md:py-grid-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              博客
            </h1>
            <p className="mt-grid-2 text-muted-foreground">
              产品更新、最佳实践与技术分享
            </p>
          </div>

          <div className="mt-grid-8 grid gap-grid-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-lg border border-border bg-card p-grid-5 transition-colors hover:border-primary/30"
              >
                <div className="flex items-center gap-grid-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-grid-3 text-base font-semibold transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-grid-1 text-sm text-muted-foreground">
                  {post.subtitle}
                </p>
                <p className="mt-grid-2 flex-1 text-sm leading-relaxed text-muted-foreground/80">
                  {post.summary}
                </p>
                <div className="mt-grid-4 flex items-center gap-grid-1 text-sm font-medium text-primary">
                  阅读更多
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
