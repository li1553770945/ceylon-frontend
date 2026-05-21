import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CEYLON - 需求管理工作台",
    template: "%s | CEYLON",
  },
  description:
    "面向产品、研发、测试、运营团队的需求管理工作台，提供可视化项目协作体验。",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon.png", sizes: "128x128", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="relative min-h-screen bg-background text-foreground">
        {/* Global background glow */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden="true"
        >
          <div
            className="absolute -left-[20%] -top-[20%] h-[70vh] w-[70vh] rounded-full opacity-[0.08] blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #c85c1b 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
