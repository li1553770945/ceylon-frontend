# 5. 状态管理与数据流

## 5.1 状态分类

| 状态 | 推荐归属 | 示例 |
| --- | --- | --- |
| 会话状态 | Zustand + session endpoint | user、profile、loading |
| 主题状态 | Zustand + localStorage | light、dark、system |
| 页面数据 | 页面组件局部状态或数据请求库 | 项目、视图、需求、成员 |
| 表格临时状态 | 需求表格组件/上下文 | 筛选、排序、列宽、选中行 |
| 表单状态 | 组件局部状态 / React Hook Form | 登录、项目设置、博客编辑 |
| 国际化状态 | next-intl | locale、messages |

## 5.2 Auth Store

当前项目 `stores/authStore.ts` 提供：

- `user`
- `profile`
- `loading`
- `logout()`
- `checkSession()`
- `setAuth()`

新项目应保留概念，但替换 session 来源：

```text
GET /api/v1/auth/session
  -> { user, profile, permissions? }
```

前端不应自行解码或信任 JWT 中的全部业务权限。权限展示可以读 session 返回值，但最终以接口返回为准。

## 5.3 Theme Store

当前主题状态包含：

- `mode`: `light` / `dark` / `system`
- `getEffectiveMode()`
- 主题主色：`CEYLON_ORANGE`

新项目应继续支持：

- 系统主题跟随。
- 用户手动切换。
- localStorage 持久化。
- MUI ThemeProvider 或等价主题 Provider。

## 5.4 API Client

应提供统一客户端，例如 `lib/api-client.ts`：

```ts
type ApiOptions = RequestInit & {
  auth?: boolean
}

export async function apiJson<T>(path: string, options?: ApiOptions): Promise<T> {
  // 拼接 NEXT_PUBLIC_API_BASE_URL
  // 默认 credentials: 'include'
  // 统一处理 401/403/422/500
}
```

统一能力：

- 自动拼接后端 base URL。
- 默认携带 cookie。
- JSON 请求头。
- 错误响应转为统一 `ApiError`。
- 401 时触发 auth store 清空或 refresh 流程。
- 支持 AbortSignal，避免页面切换后 setState。

## 5.5 数据刷新策略

MVP 可以使用 React `useEffect` + 局部 state，后续可引入 SWR/TanStack Query。

建议规则：

| 场景 | 刷新方式 |
| --- | --- |
| 项目列表 | 页面进入时拉取，创建/删除后局部更新 |
| 项目概览 | stats 与 views 可并行请求 |
| 需求表格 | 首次拉全量，局部编辑 optimistic update |
| 成员列表 | 邀请/改角色/移除后重新拉取 |
| 博客列表 | 公开页可 ISR/缓存，管理页实时请求 |
| CLI Token | 创建后只展示一次明文 token，列表不显示完整 token |

## 5.6 表格同步模型

需求表格需要更强的交互体验，建议：

1. 用户编辑单元格。
2. 前端立即更新本地状态。
3. 将 patch 写入 pending queue。
4. debounce 后提交后端。
5. 后端返回最新实体。
6. 前端合并返回值。
7. 失败时显示同步错误，并提供重试/刷新。

关键要求：

- pending create 使用本地临时 ID，后端成功后替换真实 ID。
- pending patch 同一行可合并。
- pending delete 优先级高于 patch。
- 离开页面前应尝试 flush。
- 如果后端返回版本冲突，前端提示刷新。

## 5.7 文件上传数据流

头像和项目图标不再上传 Supabase Storage。

推荐两种模式：

| 模式 | 说明 |
| --- | --- |
| 后端中转上传 | 前端 `multipart/form-data` 上传到后端，后端写对象存储并返回 URL |
| 预签名直传 | 前端向后端申请 signed URL，浏览器直传对象存储，再通知后端保存 object key |

MVP 推荐后端中转上传，简单稳定：

```text
POST /api/v1/uploads/avatar
POST /api/v1/uploads/project-icon
```

## 5.8 URL 状态

建议保留在 URL 中的状态：

- locale。
- projectId、viewId、reviewId。
- Dashboard 项目搜索 query。
- CLI OAuth device/session 参数。
- reset password code/token。

不建议写入 URL 的状态：

- 表格列宽。
- 批量选择行。
- 未提交的表单草稿。
- Access Token / Refresh Token。
