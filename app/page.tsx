"use client";

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
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import HeroScene from "@/components/hero/HeroScene";

const features = [
  {
    icon: MessageSquare,
    title: "智能反馈处理",
    description:
      "自动分析用户反馈，智能提取需求要点并更新到文档。无需人工整理，让每一条用户声音都转化为产品改进。",
  },
  {
    icon: GitPullRequest,
    title: "迭代闭环自动化",
    description:
      "配合 AI 工具，自动追踪需求实现状态。从用户反馈到需求更新再到版本迭代，形成完整的自动化工作流。",
  },
  {
    icon: Import,
    title: "智能需求导入",
    description:
      "基于用户反馈自动生成多套需求方案，以表格形式呈现供你选择。灵活接受、修改或拒绝，让需求决策更智能。",
  },
  {
    icon: Cpu,
    title: "本地 AI 集成",
    description:
      "CLI 工具专为本地 AI 设计，可配合 OpenClaw、Cursor 等工具自动管理需求。让 AI 助手直接操作需求文档，实现端到端自动化。",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    badge: "个人 / 试用",
    description:
      "适合验证需求流程与轻量项目，快速上手 AI 驱动的需求管理。",
  },
  {
    name: "Team",
    badge: "团队首选",
    description:
      "支持多人协作与持续迭代，让产品、研发、运营共享统一需求视图。",
  },
  {
    name: "Enterprise",
    badge: "企业级",
    description:
      "面向复杂组织与高合规场景，提供更高扩展性与管理能力。",
  },
];

const blogPosts = [
  {
    title: "产品更新",
    description:
      "了解新功能发布节奏与设计思路，快速判断是否适配你的团队。",
  },
  {
    title: "工程实践",
    description:
      "分享需求建模、导入与自动化协作中的关键技术实现与经验。",
  },
  {
    title: "最佳实践",
    description:
      "基于真实项目沉淀方法论，帮助你建立可持续的迭代机制。",
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />

      <main className="flex-1">
        {/* ── Hero: Full-screen with 3D background ── */}
        <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden">
          {/* 3D Scene Background — full bleed */}
          <div className="absolute inset-0 z-0 hidden lg:block">
            <HeroScene />
          </div>

          {/* Mobile fallback gradient */}
          <div
            className="absolute inset-0 z-0 block lg:hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% 30%, #1a0a00 0%, #080808 60%)",
            }}
          />

          {/* Text overlay — left-aligned on desktop */}
          <div className="container-8 relative z-10 flex w-full flex-col items-center justify-center px-6 lg:items-start">
            <div
              className={`max-w-xl transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-ceylonm/30 bg-black/40 px-4 py-1.5 text-sm font-medium text-ceylonm backdrop-blur-sm">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ceylonm" />
                AI 驱动的需求管理平台
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-5xl md:leading-tight lg:text-left">
                让 AI 接管你的需求工作流
              </h1>

              <p className="mt-4 max-w-md text-lg text-white/70 drop-shadow-md md:text-xl md:leading-relaxed lg:text-left">
                锡兰自动将用户反馈转化为需求文档，实现软件迭代的智能闭环。从反馈挖掘新需求，让产品进化永不停歇。
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="gap-2 bg-ceylonm px-6 py-3 text-base font-semibold text-white shadow-lg shadow-ceylonm/25 hover:bg-ceylonm/90"
                  >
                    开始项目
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-white/20 bg-black/30 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
                  >
                    了解更多
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
            className="animate-float absolute bottom-8 z-10 hidden flex-col items-center gap-1 text-white/40 transition-opacity hover:opacity-70 md:flex"
          >
            <span className="text-sm">向下滚动探索更多</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-border bg-muted/30">
          <div className="container-8 py-grid-10 md:py-grid-12">
            <div className="mb-grid-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-ceylonm">
                核心能力
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                AI 原生设计，智能驱动
              </h2>
            </div>
            <div className="grid gap-grid-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border bg-card p-grid-5 transition-all duration-300 hover:-translate-y-1 hover:border-ceylonm/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ceylonm/10 text-ceylonm">
                    <feature.icon className="h-6 w-6" />
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

        {/* ── Pricing ── */}
        <section className="container-8 py-grid-10 md:py-grid-12">
          <div className="mb-grid-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-ceylonm">
              定价方案
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              按团队阶段灵活选择
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              从个人试用到企业规模协作，均可在同一套需求工作流中平滑升级。
            </p>
          </div>
          <div className="grid gap-grid-4 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl border border-border bg-card p-grid-5"
              >
                <span className="inline-block rounded-full bg-ceylonm/10 px-3 py-1 text-xs font-semibold text-ceylonm">
                  {tier.badge}
                </span>
                <h3 className="mt-3 text-lg font-bold">{tier.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-grid-5 text-center">
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-ceylonm text-ceylonm hover:bg-ceylonm/5"
              >
                查看完整定价
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Blog ── */}
        <section className="border-t border-border bg-muted/30">
          <div className="container-8 py-grid-10 md:py-grid-12">
            <div className="mb-grid-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-ceylonm">
                博客精选
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                产品更新与实践沉淀
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                持续发布能力更新、技术细节和真实案例，帮助团队更快落地 AI 需求流程。
              </p>
            </div>
            <div className="grid gap-grid-4 md:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.title}
                  href="/blog"
                  className="group rounded-xl border border-border bg-card p-grid-5 transition-colors hover:border-ceylonm/30"
                >
                  <h3 className="text-base font-semibold transition-colors group-hover:text-ceylonm">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-grid-5 text-center">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="border-ceylonm text-ceylonm hover:bg-ceylonm/5"
                >
                  阅读博客
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
