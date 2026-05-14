# 11. 前端重构注意事项

## 11.1 不要迁移 Supabase 前端耦合

旧项目中存在：

- `lib/supabase-server.ts`
- `lib/supabase-env.ts`
- Supabase auth helpers。
- API route 中直接查询 Supabase。
- Supabase Storage 上传路径假设。

新前端应删除这些思路，只保留业务 UI 和类型概念。所有数据通过 `ceylon-backend` API 获取。

## 11.2 Next API route 不再作为主后端

旧项目 `app/api/**` 中包含认证、项目、需求、博客、上传、CLI 等业务接口。新架构中这些应迁移到 Go 后端。

前端项目中最多保留：

- health check。
- 极薄代理。
- Next 图片优化或站点元信息接口。

## 11.3 需求表格需要拆分

当前 `RequirementsTable.tsx` 承担大量职责。新项目建议拆分：

```text
components/requirements/
  RequirementsView.tsx
  RequirementsToolbar.tsx
  RequirementsTable.tsx
  RequirementRow.tsx
  RequirementCell.tsx
  ColumnHeaderMenu.tsx
  FilterMenu.tsx
  ImportDataDialog.tsx
  useRequirementsData.ts
  useRequirementSyncQueue.ts
```

拆分目标：

- 降低单文件复杂度。
- 让数据请求、同步队列、表格 UI 解耦。
- 便于测试和后续虚拟滚动。

## 11.4 统一字段命名

旧类型中存在：

- `version_view_id`
- `requirement_number`
- `custom_values`
- `display_name`

新后端如果使用 Go JSON，建议保持前端 JSON snake_case 或明确转换为 camelCase。二选一即可，不要混用。

推荐：

- API JSON 使用 snake_case，与数据库和现有类型接近。
- 前端 TypeScript 类型也使用 snake_case，减少映射成本。

## 11.5 优先级模型需确认

当前代码存在两种口径：

- 类型中 `priority: number`，历史 helper 按 P1-P10 颜色。
- 表格 UI 当前使用 P0-P5。

新项目需要统一，建议采用 P0-P5：

| 值 | 标签 |
| --- | --- |
| 0 | P0 |
| 1 | P1 |
| 2 | P2 |
| 3 | P3 |
| 4 | P4 |
| 5 | P5 |

后端和导入映射同步此口径。

## 11.6 国际化与主题存储策略

新前端不再使用 `/:locale` 路由前缀，语言偏好统一存储在 `localStorage` 中：

- 页面首次加载时读取 `localStorage` 中的 `ceylon-locale`。
- 用户通过 UI 切换语言时更新 `localStorage` 并刷新页面或重新挂载国际化上下文。
- 主题模式（light/dark/system）同样存储在 `localStorage` 的 `ceylon-theme` 中。
- 路由保持简洁，不因国际化产生额外层级。

## 11.7 上传接口要提前定型

头像、项目图标、博客封面、导入临时文件都依赖上传能力。建议后端先提供统一 upload API，再迁移页面。

文件限制建议：

| 类型 | 限制 |
| --- | --- |
| 头像 | jpg/png/webp，最大 2MB |
| 项目图标 | jpg/png/webp/svg，最大 2MB |
| 导入文件 | csv/tsv/txt/xlsx/xls，最大 10MB |
| 博客封面 | jpg/png/webp，最大 5MB |

## 11.8 与后端 PRD 的对应关系

前端 PRD 需要和后端 PRD 保持一致：

- 后端 PRD 路径：`/Users/kirigaya/project/ceylonm/ceylon-backend/docs/ceylon-prd`
- 前端 PRD 路径：`/Users/kirigaya/project/ceylonm/ceylon-frontend/docs/ceylon-frontend-prd`

前端重构时优先以后端 PRD 的数据库、认证、基础设施为准。

## 11.9 迁移顺序建议

不要一开始迁移所有公开站点和管理功能。建议先打通：

```text
认证 -> 项目 -> 版本视图 -> 需求表格 -> 成员权限
```

这条主链路跑通后，再迁移博客、管理员、CLI、AI Review、订阅等扩展功能。
