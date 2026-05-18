import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const blogPosts = [
  {
    slug: "agile-iteration-with-ceylon",
    title: "如何用 CEYLON 管理敏捷迭代",
    subtitle: "从需求收集到发布追踪的完整实践指南",
    category: "最佳实践",
    date: "2024-12-15",
    content: `
## 引言

敏捷开发的核心在于快速响应变化。CEYLON 提供的迭代闭环功能，让团队可以在一个统一的平台上完成从需求收集到发布追踪的全流程。

## 创建迭代视图

在每个 Sprint 开始前，建议创建一个独立的版本视图。这样可以清晰地看到当前迭代的目标与范围。

## 需求优先级管理

利用 CEYLON 的优先级评分系统，结合业务价值与技术成本，快速确定每个需求的处理顺序。

## 每日站会与进度追踪

通过看板视图，团队成员可以实时了解每个需求的状态变化，减少沟通成本。

## 回顾与度量

迭代结束后，利用内置的报表功能分析周期时间、吞吐量等关键指标，持续改进团队效率。
    `,
  },
  {
    slug: "ai-requirement-analysis-tips",
    title: "AI 辅助需求分析的 5 个技巧",
    subtitle: "让 AI 成为您的产品助理",
    category: "AI 功能",
    date: "2024-12-08",
    content: `
## 技巧一：自动分类

将大量用户反馈批量导入后，AI 会自动按照功能模块、紧急程度等维度进行分类。

## 技巧二：智能摘要

对于长篇需求描述，AI 可以提取核心要点，生成简洁的摘要卡片。

## 技巧三：风险识别

在评审阶段，AI 会基于历史数据标记可能存在技术风险的需求项。

## 技巧四：验收标准生成

输入功能描述后，AI 可以自动生成初步的验收测试用例。

## 技巧五：竞品对比

上传竞品功能清单，AI 会帮助分析功能差异与优先级建议。
    `,
  },
  {
    slug: "ceylon-cli-getting-started",
    title: "CEYLON CLI 入门指南",
    subtitle: "在终端中完成一切需求管理操作",
    category: "开发者",
    date: "2024-11-28",
    content: `
## 安装

\`\`\`bash
npm install -g @ceylon/cli
# 或
brew install ceylon
\`\`\`

## 配置认证

\`\`\`bash
ceylon auth login
\`\`\`

## 常用命令

### 创建需求
\`\`\`bash
ceylon req create --title "新增暗黑模式" --type feature --priority high
\`\`\`

### 列出项目需求
\`\`\`bash
ceylon req list --project my-project --status in_progress
\`\`\`

### 导出报表
\`\`\`bash
ceylon report export --project my-project --format csv
\`\`\`

## 脚本化工作流

结合 Git Hooks，可以在提交代码时自动更新关联需求的状态。
    `,
  },
  {
    slug: "team-collaboration-patterns",
    title: "跨团队协作的最佳模式",
    subtitle: "打破部门墙，实现高效信息流转",
    category: "最佳实践",
    date: "2024-11-20",
    content: `
## 四色角色模型

在 CEYLON 中，我们建议为产品、研发、测试、运营四个团队配置不同的角色权限：

- **产品**：owner / admin，负责需求创建与优先级调整
- **研发**：write，负责状态更新与技术备注
- **测试**：write，负责缺陷提交与验收确认
- **运营**：read，负责查看进度与反馈收集

## 信息流转机制

利用评论 @ mention 功能，确保关键信息能够及时触达相关方。
    `,
  },
  {
    slug: "security-whitepaper",
    title: "CEYLON 安全白皮书",
    subtitle: "数据安全与隐私保护架构解析",
    category: "安全",
    date: "2024-11-10",
    content: `
## 数据传输安全

所有数据通过 TLS 1.3 加密传输，防止中间人攻击。

## 存储加密

静态数据采用 AES-256 加密，密钥由硬件安全模块管理。

## 访问控制

基于 RBAC 的细粒度权限系统，支持项目级、视图级、字段级的权限配置。

## 合规认证

CEYLON 已通过 SOC 2 Type II 与 ISO 27001 认证。
    `,
  },
  {
    slug: "roadmap-2025",
    title: "CEYLON 2025 产品路线图",
    subtitle: "即将发布的重要功能与改进",
    category: "产品动态",
    date: "2024-11-01",
    content: `
## Q1：实时协作

多人同时编辑需求文档，支持光标同步与冲突解决。

## Q2：AI 助手 2.0

更智能的上下文理解，支持自然语言查询与自动报表生成。

## Q3：数据分析仪表盘

自定义可视化图表，支持数据源关联与下钻分析。

## Q4：开放生态

插件市场与第三方集成框架，让 CEYLON 成为需求管理中枢。
    `,
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title,
    description: post.subtitle,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <article className="container-8 py-grid-10 md:py-grid-12">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-grid-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回博客列表
            </Link>

            <header className="mt-grid-4">
              <div className="flex flex-wrap items-center gap-grid-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-grid-1">
                  <Tag className="h-4 w-4" />
                  {post.category}
                </span>
                <span className="flex items-center gap-grid-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
              </div>
              <h1 className="mt-grid-3 text-3xl font-bold tracking-tight md:text-4xl">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="mt-grid-2 text-lg text-muted-foreground">
                  {post.subtitle}
                </p>
              )}
            </header>

            <div className="mt-grid-8 space-y-grid-4 text-sm leading-relaxed text-foreground/90">
              {post.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="mt-grid-4 text-xl font-semibold text-foreground"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc space-y-grid-1 pl-grid-4">
                      {paragraph.split("\n").map((item, j) => (
                        <li key={j} className="text-foreground/80">
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith("```")) {
                  const lines = paragraph.split("\n");
                  const code = lines.slice(1, -1).join("\n");
                  return (
                    <pre
                      key={i}
                      className="overflow-x-auto rounded-md bg-muted p-grid-3 text-xs"
                    >
                      <code>{code}</code>
                    </pre>
                  );
                }
                return (
                  <p key={i} className="text-foreground/80">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
