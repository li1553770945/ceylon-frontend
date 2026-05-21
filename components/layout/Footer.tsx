"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Rss } from "lucide-react";

const productLinks = [
  { href: "/", label: "首页" },
  { href: "/pricing", label: "定价" },
  { href: "/docs", label: "文档" },
  { href: "/blog", label: "博客" },
];

const developerLinks = [
  {
    href: "https://kirigaya.cn/",
    label: "锦恢",
    external: true,
  },
  {
    href: "https://peacesheep.xyz/",
    label: "peacesheep",
    external: true,
  },
];

const legalLinks = [
  { href: "/", label: "服务条款" },
  { href: "/", label: "隐私政策" },
  {
    href: "https://beian.miit.gov.cn/#/Integrated/index",
    label: "苏ICP备2022010563号-3",
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-[#0a0a0a]">
      <div className="container-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left — Brand & Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/icons/icon.svg"
                alt="锡兰"
                className="h-6 w-auto"
              />
              <span className="font-serif text-lg font-bold text-white">
                锡兰
              </span>
            </Link>

            {/* Developer links */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://kirigaya.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-white"
                title="锦恢的博客"
              >
                <Rss className="h-4 w-4" />
              </a>
              <a
                href="https://peacesheep.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-white"
                title="peacesheep 的博客"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/li1553770945"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-white"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              获取产品更新和新闻
            </p>
            <div className="mt-3 flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-9 border-white/10 bg-white/5 text-sm text-white placeholder:text-muted-foreground/50 focus-visible:ring-ceylonm"
              />
              <Button
                size="sm"
                className="h-9 bg-ceylonm px-4 text-sm font-medium text-white hover:bg-ceylonm/90"
              >
                订阅
              </Button>
            </div>
          </div>

          {/* Right — Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white">产品</h4>
              <ul className="mt-4 space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-sm font-semibold text-white">开发者</h4>
              <ul className="mt-4 space-y-2.5">
                {developerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white">支持</h4>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-muted-foreground transition-colors hover:text-white"
                  >
                    帮助文档
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">
                    系统状态
                  </span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white">法律</h4>
              <ul className="mt-4 space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href + link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} 锡兰. All rights reserved.
          </p>
          <a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            苏ICP备2022010563号-3
          </a>
        </div>
      </div>
    </footer>
  );
}
