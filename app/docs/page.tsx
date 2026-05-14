import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Layers, Zap, Shield, Code } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "快速入门",
    items: [
      "创建您的第一个项目",
      "导入现有需求",
      "邀请团队成员",
      "配置工作流",
    ],
  },
  {
    icon: Layers,
    title: "核心概念",
    items: [
      "项目与视图",
      "需求条目",
      "状态与优先级",
      "自定义字段",
    ],
  },
  {
    icon: Zap,
    title: "AI 功能",
    items: [
      "智能分类",
      "自动优先级评估",
      "需求摘要生成",
      "风险识别",
    ],
  },
  {
    icon: Shield,
    title: "安全与合规",
    items: [
      "身份验证",
      "角色与权限",
      "审计日志",
      "数据加密",
    ],
  },
  {
    icon: Code,
    title: "开发者工具",
    items: [
      "REST API 概览",
      "CLI 安装与配置",
      "Webhook 事件",
      "SDK 与示例",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <section className="container-8 py-grid-10 md:py-grid-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              产品文档
            </h1>
            <p className="mt-grid-2 text-muted-foreground">
              了解如何使用 CEYLON 管理您的需求与项目
            </p>
          </div>

          <div className="mt-grid-8 grid gap-grid-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-lg border border-border bg-card p-grid-5 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-grid-3 text-base font-semibold">
                  {section.title}
                </h2>
                <ul className="mt-grid-3 space-y-grid-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground"
                    >
                      {item}
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
