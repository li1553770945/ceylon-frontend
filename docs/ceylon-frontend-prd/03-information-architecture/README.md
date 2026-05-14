# 3. 信息架构与路由

## 3.1 路由总览

| 路由 | 类型 | 说明 |
| --- | --- | --- |
| `/` | 入口 | 官网首页 |
| `/login` | 公开 | 登录 |
| `/register` | 公开 | 注册 / onboarding |
| `/forgot-password` | 公开 | 找回密码 |
| `/reset-password` | 公开 | 重置密码 |
| `/pricing` | 公开 | 定价 |
| `/docs` | 公开 | 文档/产品说明 |
| `/blog` | 公开 | 博客列表 |
| `/blog/:slug` | 公开 | 博客详情 |
| `/profile` | 受保护 | 个人资料 |
| `/settings` | 受保护 | 账号设置、CLI Token |
| `/admin` | 管理员 | 管理后台首页 |
| `/admin/blog` | 管理员 | 博客管理 |
| `/admin/blog/:slug` | 管理员 | 博客编辑 |
| `/admin/invites` | 管理员 | 邀请码管理 |
| `/cli-oauth/verify` | 受保护 | CLI OAuth / Device Flow 授权确认 |
| `/dashboard` | 受保护 | 项目列表 |
| `/dashboard/project/:projectId` | 受保护 | 项目概览 |
| `/dashboard/project/:projectId/settings` | 受保护 | 项目设置 |
| `/dashboard/project/:projectId/team` | 受保护 | 项目成员 |
| `/dashboard/project/:projectId/view/:viewId` | 受保护 | 需求版本视图表格 |
| `/dashboard/project/:projectId/view/:viewId/review/:reviewId` | 受保护 | AI 评审 Diff |
| `/dashboard/subscription` | 受保护 | 订阅信息 |

## 3.2 导航层级

```text
公开站点
  首页
  定价
  文档
  博客
  登录 / 注册

工作台
  项目列表
    新建项目
    项目搜索
    项目卡片菜单
  项目详情
    统计卡片
    版本视图列表
    团队
    设置
  版本视图
    需求表格
    自定义列
    搜索筛选排序
    导入导出
    批量操作

账号
  个人资料
  账号设置
  CLI Token
  订阅

管理员
  数据概览
  邀请码
  博客管理
```

## 3.3 公开站点信息架构

首页需要展示：

- AI 驱动需求管理定位。
- 核心能力：反馈处理、迭代闭环、智能导入、本地 AI/CLI 集成。
- 定价方案摘要：Starter、Team、Enterprise。
- 博客/产品更新入口。
- 登录态感知：已登录用户优先跳转 Dashboard。

博客需要：

- 列表页支持分类筛选。
- 详情页支持 SEO metadata、OG 信息。
- Markdown 内容支持代码、表格、LaTeX、Mermaid。

## 3.4 工作台信息架构

工作台围绕“项目 -> 版本视图 -> 需求”展开：

```text
Project
  VersionView
    Requirement
      Fixed fields: title, description, priority, status, type, assignee
      Custom fields: text/select/person
```

侧边栏应支持：

- 项目切换。
- 当前项目下版本视图切换。
- 全局搜索入口。
- 快速创建项目/视图。
- 个人资料、设置、退出登录。

## 3.5 受保护路由规则

- 未登录访问 `/dashboard/**`、`/:locale/profile`、`/:locale/settings`、`/:locale/admin/**` 时跳转登录页。
- 登录后访问登录/注册页，可跳转 Dashboard 或保留“切换账号”能力。
- 管理员页面前端根据 session 中的 `role` 做入口隐藏，但最终权限必须由后端校验。
- 项目权限前端只用于体验控制，不能作为安全边界。
