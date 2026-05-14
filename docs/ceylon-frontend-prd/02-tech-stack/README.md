# 2. 技术栈与工程结构

## 2.1 推荐技术栈

| 分类 | 推荐 | 当前项目依据 |
| --- | --- | --- |
| 框架 | Next.js App Router | 当前 `next` 为 16.x，使用 `app/` 路由 |
| UI | React 19 + TypeScript | 当前大量 client component |
| 组件库 | MUI 7 | 当前页面主要使用 `@mui/material` 和 `@mui/icons-material` |
| 状态管理 | Zustand | 当前 `stores/authStore.ts`、`stores/themeStore.ts` |
| 国际化 | next-intl | 当前 `messages/zh.json`、`en.json`、`ja.json` |
| 表单 | React Hook Form / 原生受控表单 | 当前登录注册、资料、设置页以受控表单为主 |
| 文件解析 | PapaParse、xlsx | 当前 CSV/TSV/Excel 导入 |
| Markdown | react-markdown + remark/rehype | 当前博客支持 GFM、数学公式、代码高亮、Mermaid |
| 测试 | Playwright | 当前 API、DB、E2E 测试均基于 Playwright |
| PWA | Manifest + Service Worker | 当前存在 `public/manifest.json`、`public/sw.js` |

## 2.2 目标目录结构

建议新前端保持以下结构：

```text
ceylon-frontend/
  app/
    [locale]/
      page.tsx
      login/
      register/
      forgot-password/
      reset-password/
      profile/
      settings/
      pricing/
      docs/
      blog/
      admin/
    dashboard/
      page.tsx
      project/[projectId]/
  components/
    admin/
    blog/
    layout/
    requirements/
    review/
    auth/
  hooks/
  i18n/
  lib/
    api-client.ts
    auth-client.ts
    upload-client.ts
  stores/
  styles/
  types/
  messages/
  tests/
```

## 2.3 需要从旧项目迁移的前端模块

| 模块 | 当前路径 | 新项目建议 |
| --- | --- | --- |
| 主布局 | `components/MainLayout.tsx` | 拆为 `components/layout/AppShell.tsx`、`Sidebar.tsx`、`Topbar.tsx` |
| 公开导航 | `components/PublicNavbar.tsx` | 保留，适配新路由和登录态 |
| 认证 Provider | `components/AuthProvider.tsx` | 改为调用 `ceylon-backend` session endpoint |
| 需求表格 | `components/requirements/RequirementsTable.tsx` | 建议拆分 toolbar、header、row、cell editor、dialogs |
| 导入对话框 | `components/requirements/ImportDataDialog.tsx` | 保留前端解析与预览，提交到后端导入 API |
| 博客渲染 | `components/blog/*` | 保留 Markdown 渲染能力 |
| 管理后台壳 | `components/admin/AdminShell.tsx` | 保留，权限由后端会话返回角色控制 |
| 用户搜索 | `components/UserSearch.tsx` | 改为调用后端用户搜索 API |

## 2.4 必须移除或替换

| 旧依赖/模式 | 处理方式 |
| --- | --- |
| `@supabase/auth-helpers-nextjs` | 移除 |
| `@supabase/ssr` | 移除 |
| `@supabase/supabase-js` | 移除，除非仅用于一次性迁移脚本 |
| `lib/supabase-server.ts` | 删除，替换为 `lib/api-client.ts` |
| `lib/supabase-env.ts` | 删除，替换为后端 API base URL 配置 |
| `app/api/**` 业务 route | 迁移到 `ceylon-backend` |
| 浏览器直接上传 Supabase Storage | 改为后端签名上传或后端中转上传 |

## 2.5 环境变量

新前端建议最小化环境变量：

```env
NEXT_PUBLIC_APP_URL=http://localhost:<frontend-port>
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=CEYLON
```

生产环境：

```env
NEXT_PUBLIC_APP_URL=https://ceylonm.com
NEXT_PUBLIC_API_BASE_URL=https://api.ceylonm.com
NEXT_PUBLIC_SITE_NAME=CEYLON
```

注意：

- 不在前端暴露数据库地址、JWT secret、对象存储 secret。
- OAuth client secret、邮件服务 secret、支付 secret 均在后端保存。
- 如果使用 HttpOnly Cookie，会话 cookie domain/path/secure/sameSite 由后端和 Nginx 共同配置。
