# 6. 后端对接与 API 契约

## 6.1 总原则

新前端对接 `/Users/kirigaya/project/ceylonm/ceylon-backend`，后端基础设施与 PRD 已按 `agentruler-backend` 方式设计：

- Go + Gin。
- MySQL / MariaDB。
- GORM。
- JWT Access Token + Refresh Token Hash + Token Rotation。
- Redis 用于限流、验证码/设备码、任务状态等。
- 对象存储或 S3 兼容存储。

前端不再直接接触数据库，也不再直接调用 Supabase。

## 6.2 Base URL

本地：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

生产：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.ceylonm.com
```

如果前后端同域部署，也可以通过 Nginx 将 `/api/v1` 反代到后端：

```text
https://ceylonm.com/api/v1 -> ceylon-backend:8000
```

## 6.3 API 命名建议

旧项目 API route 形态为 `/api/...`。新后端建议统一为 `/api/v1/...`。

| 旧前端调用 | 新后端建议 |
| --- | --- |
| `/api/auth/login` | `POST /api/v1/auth/login` |
| `/api/auth/register` | `POST /api/v1/auth/register` |
| `/api/auth/session` | `GET /api/v1/auth/session` |
| `/api/projects` | `GET/POST /api/v1/projects` |
| `/api/projects/:id` | `GET/PATCH/DELETE /api/v1/projects/:id` |
| `/api/projects/:id/views` | `GET/POST /api/v1/projects/:id/views` |
| `/api/version-views/:id/full` | `GET /api/v1/views/:id/full` |
| `/api/requirements/:id` | `PATCH/DELETE /api/v1/requirements/:id` |
| `/api/storage/project-icon` | `POST /api/v1/uploads/project-icon` |
| `/api/settings/tokens` | `GET/POST/DELETE /api/v1/settings/tokens` |

## 6.4 认证 API

### `POST /api/v1/auth/login`

请求：

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

响应：

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "display_name": "User",
    "avatar_url": null,
    "role": "user",
    "subscription_tier": "free"
  }
}
```

后端应同时设置安全 cookie，或返回 access token 给前端按约定存储。

### `POST /api/v1/auth/register`

请求：

```json
{
  "email": "user@example.com",
  "password": "password",
  "display_name": "User",
  "avatar_url": "https://..."
}
```

### `GET /api/v1/auth/session`

响应：

```json
{
  "authenticated": true,
  "user": {},
  "profile": {},
  "permissions": {
    "is_admin": false
  }
}
```

### 其他认证接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/v1/auth/logout` | 当前设备退出 |
| `POST` | `/api/v1/auth/logout-all` | 全设备退出 |
| `POST` | `/api/v1/auth/refresh` | 刷新 access token |
| `POST` | `/api/v1/auth/reset-password` | 发送重置邮件或验证码 |
| `POST` | `/api/v1/auth/update-password` | 更新密码 |
| `POST` | `/api/v1/auth/resend` | 重发验证邮件/验证码 |

## 6.5 项目与版本视图 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/v1/projects` | 当前用户可访问项目 |
| `POST` | `/api/v1/projects` | 创建项目 |
| `GET` | `/api/v1/projects/:projectId` | 项目详情 |
| `PATCH` | `/api/v1/projects/:projectId` | 更新项目 |
| `DELETE` | `/api/v1/projects/:projectId` | 删除项目 |
| `GET` | `/api/v1/projects/:projectId/full` | 项目 + 版本视图 |
| `GET` | `/api/v1/projects/:projectId/stats` | 统计 |
| `GET` | `/api/v1/projects/:projectId/views` | 版本视图列表 |
| `POST` | `/api/v1/projects/:projectId/views` | 创建版本视图 |
| `GET` | `/api/v1/views/:viewId` | 版本视图详情 |
| `PATCH` | `/api/v1/views/:viewId` | 更新版本视图 |
| `DELETE` | `/api/v1/views/:viewId` | 删除版本视图 |
| `GET` | `/api/v1/views/:viewId/full` | 视图、列、需求全量 |

## 6.6 需求与列 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/v1/views/:viewId/requirements` | 新增需求 |
| `PATCH` | `/api/v1/requirements/:requirementId` | 更新需求 |
| `DELETE` | `/api/v1/requirements/:requirementId` | 删除需求 |
| `POST` | `/api/v1/views/:viewId/columns` | 新增自定义列 |
| `PATCH` | `/api/v1/views/:viewId/columns/:columnId` | 更新列 |
| `DELETE` | `/api/v1/views/:viewId/columns/:columnId` | 删除列 |
| `POST` | `/api/v1/projects/:projectId/select-attributes/rename-option` | 重命名 select 选项 |

## 6.7 成员 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/v1/projects/:projectId/members` | 成员列表 |
| `POST` | `/api/v1/projects/:projectId/members` | 邀请成员 |
| `PATCH` | `/api/v1/projects/:projectId/members/:memberId` | 修改角色 |
| `DELETE` | `/api/v1/projects/:projectId/members/:memberId` | 移除成员 |
| `GET` | `/api/v1/users/search?q=` | 用户搜索 |

## 6.8 导入导出 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/v1/projects/:projectId/views/:viewId/import` | 导入解析后的数据 |
| `GET` | `/api/v1/views/:viewId/export` | 可选：后端导出 Excel/CSV |

MVP 可由前端用当前表格数据直接导出 Excel；大型数据集建议改为后端导出。

## 6.9 上传 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/v1/uploads/avatar` | 上传头像 |
| `POST` | `/api/v1/uploads/project-icon` | 上传项目图标 |
| `POST` | `/api/v1/uploads/import-temp` | 可选：上传导入原始文件 |

## 6.10 管理与博客 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/v1/blog` | 公开博客列表 |
| `GET` | `/api/v1/blog/:slug` | 公开博客详情 |
| `GET` | `/api/v1/admin/analytics` | 管理统计 |
| `GET/POST` | `/api/v1/admin/blog` | 管理博客列表/创建 |
| `GET/PUT/DELETE` | `/api/v1/admin/blog/:slug` | 管理博客详情 |
| `GET/POST` | `/api/v1/admin/invites` | 邀请码列表/创建 |
| `PATCH/DELETE` | `/api/v1/admin/invites/:id` | 邀请码更新/删除 |

## 6.11 错误格式

建议后端统一错误响应：

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found",
    "details": {}
  }
}
```

前端处理：

- 401：清理 session，引导登录。
- 403：展示权限不足。
- 404：展示不存在或已删除。
- 409：展示冲突，建议刷新。
- 422：展示字段级校验错误。
- 500：展示通用错误，并记录日志。
