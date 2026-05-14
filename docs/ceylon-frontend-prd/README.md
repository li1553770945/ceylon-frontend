# CEYLON 锡兰前端 PRD

> 本目录根据 `/Users/kirigaya/project/ceylon` 当前前端代码、页面结构、组件、测试、国际化文案和已有文档反向整理，用于快速重构新的 `ceylon-frontend` 项目。后续新前端应对接 `ceylon-backend`，不再直接依赖 Supabase Auth / Database / Storage。

## 文档导航

1. [前端产品概览](./01-overview/README.md)
2. [技术栈与工程结构](./02-tech-stack/README.md)
3. [信息架构与路由](./03-information-architecture/README.md)
4. [页面与功能模块](./04-page-modules/README.md)
5. [状态管理与数据流](./05-state-and-data/README.md)
6. [后端对接与 API 契约](./06-backend-integration/README.md)
7. [设计系统与国际化](./07-design-system-i18n/README.md)
8. [认证、会话与权限前端逻辑](./08-auth-session/README.md)
9. [非功能需求](./09-non-functional/README.md)
10. [验收标准与重构路线](./10-acceptance-roadmap/README.md)
11. [前端重构注意事项](./11-rebuild-notes/README.md)

## 前端一句话

CEYLON 前端是面向产品、研发、测试、运营团队的需求管理工作台，提供公开官网、登录注册、项目控制台、版本视图表格、团队协作、导入导出、CLI 授权、博客与管理员后台等完整 Web 体验。

## 新项目技术口径

- 前端仍建议采用 Next.js + React + TypeScript。
- 前端只负责 UI、路由、状态、表单、文件预解析、会话展示与 API 调用。
- 所有用户、项目、需求、博客、Token、上传签名等业务逻辑由 `ceylon-backend` 提供。
- 不在前端项目内继续保留 Next API route 作为业务后端，除非作为极薄的反向代理或运行时健康检查。
- 不再引入 Supabase client、Supabase Auth Helper、Supabase Storage SDK。
- 会话推荐由 `ceylon-backend` 签发 JWT Access Token + Refresh Token，前端通过 HttpOnly Cookie 或受控 token 存储完成请求认证。

## MVP 优先级摘要

| 优先级 | 范围 |
| --- | --- |
| P0 | 官网入口、登录/注册/找回密码、会话恢复、项目列表、项目详情、版本视图、需求表格 CRUD、成员管理、基础权限态 |
| P1 | 自定义列、搜索/筛选/排序、CSV/Excel 导入、导出、头像/项目图标上传、CLI Token 管理、CLI OAuth 授权 |
| P2 | 博客与管理后台、访问分析、AI 评审 Diff、订阅页面、PWA、SEO、复杂表格性能优化 |

## 推荐阅读顺序

1. 先读 [前端产品概览](./01-overview/README.md)，确认前端承担的产品边界。
2. 再读 [信息架构与路由](./03-information-architecture/README.md)，确定新项目路由。
3. 读 [页面与功能模块](./04-page-modules/README.md)，拆页面任务。
4. 读 [后端对接与 API 契约](./06-backend-integration/README.md)，与 `ceylon-backend` 对齐接口。
5. 读 [认证、会话与权限前端逻辑](./08-auth-session/README.md)，先统一登录态和鉴权体验。
6. 最后读 [前端重构注意事项](./11-rebuild-notes/README.md)，避免把旧项目中的 Supabase/BFF 边界带进新项目。
