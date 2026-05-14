# 9. 非功能需求

## 9.1 性能

- 首屏公开首页应尽量静态化或服务端渲染。
- Dashboard 数据请求并行化，避免串行瀑布。
- 需求表格超过 500 行时需要关注渲染性能。
- 大型表格后续可引入虚拟滚动。
- 导入文件前端预览限制行数，完整数据提交后端。

## 9.2 稳定性

- API Client 统一超时、错误解析和重试策略。
- 表格编辑失败需可恢复，不可静默丢数据。
- 上传失败需保留用户已填表单。
- 页面切换时取消无效请求，避免 React setState warning。

## 9.3 安全

- 不在前端保存数据库密钥、JWT secret、对象存储 secret。
- Refresh Token 不进入 localStorage。
- Markdown 渲染必须防止 XSS。
- 文件上传限制类型和大小。
- 管理入口前端隐藏不等于权限校验，后端必须校验。
- 公开 API 错误信息避免泄露内部实现。

## 9.4 SEO

公开页面需要：

- title、description。
- canonical。
- Open Graph。
- sitemap。
- robots。
- 博客详情页动态 metadata。

工作台页面可以 noindex。

## 9.5 PWA

当前项目已有 PWA 线索，新项目可作为 P2：

- manifest。
- app icon。
- service worker。
- 离线提示。

MVP 不要求离线编辑需求，避免同步复杂度过高。

## 9.6 兼容性

- 支持最新 Chrome、Edge、Safari、Firefox。
- 移动端支持公开站点、登录注册、基本项目查看。
- 需求表格核心编辑优先桌面体验。

## 9.7 可观测性

前端应记录：

- 页面浏览。
- 注册/登录成功率。
- 项目创建。
- 需求创建/编辑。
- 导入成功/失败。
- API 错误。

当前旧项目有 `/api/analytics/track`。新项目应改为：

```text
POST /api/v1/analytics/track
```

## 9.8 测试

建议测试层级：

| 层级 | 覆盖 |
| --- | --- |
| 单元/组件 | API client、表单校验、工具函数 |
| E2E | 登录、项目、版本视图、需求 CRUD、成员、导入 |
| 视觉截图 | 首页、Dashboard、需求表格、深色模式 |
| 契约测试 | 前后端 API schema |

迁移后前端仓库至少保留 Playwright E2E。
