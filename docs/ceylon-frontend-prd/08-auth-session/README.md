# 8. 认证、会话与权限前端逻辑

## 8.1 新认证方式

后续脱离 Supabase，认证方式与 `agentruler-backend` 一致：

- 用户表在 MySQL / MariaDB。
- 密码使用 bcrypt hash。
- 登录后签发短期 JWT Access Token。
- Refresh Token 仅以 SHA256 hash 存储在数据库。
- 刷新时进行 Token Rotation。

前端只关心：

- 如何登录。
- 如何恢复 session。
- 如何携带凭据请求 API。
- 如何在 401/403 时给出正确体验。

## 8.2 Cookie 优先策略

推荐使用 HttpOnly Cookie：

| Cookie | 说明 |
| --- | --- |
| `ceylon_access_token` | 短期 access token，可由后端设置 HttpOnly |
| `ceylon_refresh_token` | 长期 refresh token，HttpOnly，Secure |

前端请求统一：

```ts
fetch(url, {
  credentials: 'include'
})
```

优点：

- 浏览器 JS 不能直接读取 refresh token。
- 与后端 Token Rotation 更自然。
- 退出登录由后端清 cookie 和 refresh token 记录。

## 8.3 Session 恢复

应用启动时：

1. `AuthProvider` 调用 `GET /api/v1/auth/session`。
2. 后端根据 cookie 返回用户和 profile。
3. 前端写入 auth store。
4. 请求失败或未登录时设置 `user=null`。

需要避免：

- 页面未确认 session 前闪烁到登录页。
- 多个组件同时请求 session。
- 401 后无限刷新。

## 8.4 路由守卫

受保护页面进入逻辑：

```text
loading session -> 显示骨架/加载态
authenticated -> 渲染页面
unauthenticated -> redirect login?next=<current>
```

管理员页面：

```text
session.profile.role in ["admin", "super_user"] -> 渲染
否则 -> 403 页面或跳转 Dashboard
```

项目页面：

- 前端可根据后端返回权限禁用按钮。
- 真实权限仍由项目 API 校验。

## 8.5 角色与权限

系统角色：

| 角色 | 说明 |
| --- | --- |
| `admin` | 系统管理员 |
| `super_user` | 高级用户 |
| `user` | 普通用户 |

订阅等级：

| 等级 | 说明 |
| --- | --- |
| `free` | 免费版 |
| `pro` | 专业版 |
| `team` | 团队版 |
| `enterprise` | 企业版 |

项目角色：

| 角色 | 前端能力 |
| --- | --- |
| owner | 项目所有操作 |
| admin | 成员、视图、需求管理 |
| write | 需求编辑、导入 |
| read | 只读 |

## 8.6 登录注册页面状态

登录页需要：

- `email`
- `password`
- `loading`
- `error`
- `forgotPasswordOpen` 或单独页面

注册页需要：

- `email`
- `password`
- `displayName`
- `avatarFile`
- `avatarPreview`
- `inviteCode`
- `loading`
- `error`
- `verificationState`

## 8.7 退出登录

退出登录流程：

1. 调用 `POST /api/v1/auth/logout`。
2. 后端删除当前 refresh token 并清 cookie。
3. 前端清 auth store。
4. 跳转首页或登录页。

## 8.8 CLI Token 与 Device Flow

CLI Token：

- 列表页显示 token 名称、创建时间、最后使用时间、过期时间。
- 创建成功仅展示一次明文 token。
- 撤销需要确认。

Device Flow：

- CLI 发起设备授权。
- 前端打开 `/:locale/cli-oauth/verify?...`。
- 用户确认授权。
- 后端将 device session 标记为 approved/denied。

前端不能直接生成 CLI token，必须由后端生成和存储 hash。
