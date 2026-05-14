import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CEYLON - 需求管理工作台",
    template: "%s | CEYLON",
  },
  description:
    "面向产品、研发、测试、运营团队的需求管理工作台，提供可视化项目协作体验。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
