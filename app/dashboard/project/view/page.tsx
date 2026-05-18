"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import RequirementsTable, {
  type TableColumn,
} from "@/components/requirements/RequirementsTable";
import RequirementsToolbar from "@/components/requirements/RequirementsToolbar";
import ImportDataDialog from "@/components/requirements/ImportDataDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Requirement } from "@/types";
import { CheckCircle2, Columns3, Plus, X } from "lucide-react";

const initialRequirements: Requirement[] = [
  {
    id: "req-1",
    view_id: "view-1",
    requirement_number: 1,
    title: "完成登录注册闭环",
    description: "对接后端登录、注册和 session 恢复接口",
    priority: 0,
    status: "in_progress",
    type: "feature",
    assignee_id: "u1",
    assignee_name: "Alice",
    assignee_avatar: null,
    custom_values: { 端: "Web", 风险: "中" },
    order_index: 1,
    created_at: "2026-05-01T08:00:00Z",
    updated_at: "2026-05-01T08:00:00Z",
  },
  {
    id: "req-2",
    view_id: "view-1",
    requirement_number: 2,
    title: "需求表格支持导入导出",
    description: "CSV/Excel 预览、确认导入和导出",
    priority: 1,
    status: "pending",
    type: "task",
    assignee_id: "u2",
    assignee_name: "Bob",
    assignee_avatar: null,
    custom_values: { 端: "Web", 风险: "低" },
    order_index: 2,
    created_at: "2026-05-02T08:00:00Z",
    updated_at: "2026-05-02T08:00:00Z",
  },
  {
    id: "req-3",
    view_id: "view-1",
    requirement_number: 3,
    title: "团队成员权限管理",
    description: "邀请、改角色和移除成员",
    priority: 2,
    status: "completed",
    type: "improvement",
    assignee_id: null,
    assignee_name: null,
    assignee_avatar: null,
    custom_values: { 端: "Backend", 风险: "中" },
    order_index: 3,
    created_at: "2026-05-03T08:00:00Z",
    updated_at: "2026-05-03T08:00:00Z",
  },
];

const fixedColumns: TableColumn[] = [
  "requirement_number",
  "title",
  "priority",
  "status",
  "type",
  "assignee",
];

function RequirementViewPageContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "proj-1";
  const viewId = searchParams.get("viewId") || "view-1";

  const [requirements, setRequirements] =
    useState<Requirement[]>(initialRequirements);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [customColumns, setCustomColumns] = useState<TableColumn[]>(["端", "风险"]);
  const [newColumn, setNewColumn] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [notice, setNotice] = useState("");

  const columns = useMemo(
    () => [...fixedColumns, ...customColumns],
    [customColumns]
  );

  const visibleRequirements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return requirements
      .filter((req) => {
        const matchesQuery =
          !query ||
          req.title.toLowerCase().includes(query) ||
          req.description?.toLowerCase().includes(query) ||
          req.assignee_name?.toLowerCase().includes(query);
        const matchesFilter = !onlyOpen || req.status !== "completed";
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) =>
        sortAsc
          ? a.requirement_number - b.requirement_number
          : b.requirement_number - a.requirement_number
      );
  }, [requirements, searchQuery, onlyOpen, sortAsc]);

  const addRequirement = () => {
    const nextNumber =
      requirements.reduce((max, req) => Math.max(max, req.requirement_number), 0) + 1;
    const now = new Date().toISOString();
    setRequirements((prev) => [
      ...prev,
      {
        id: `req-${Date.now()}`,
        view_id: viewId,
        requirement_number: nextNumber,
        title: `新需求 ${nextNumber}`,
        description: null,
        priority: 3,
        status: "pending",
        type: "feature",
        assignee_id: null,
        assignee_name: null,
        assignee_avatar: null,
        custom_values: {},
        order_index: nextNumber,
        created_at: now,
        updated_at: now,
      },
    ]);
    setNotice("已创建新需求");
  };

  const addColumn = () => {
    const name = newColumn.trim();
    if (!name || columns.includes(name)) return;
    setCustomColumns((prev) => [...prev, name]);
    setNewColumn("");
    setNotice(`已新增自定义列：${name}`);
  };

  const removeColumn = (name: TableColumn) => {
    setCustomColumns((prev) => prev.filter((col) => col !== name));
    setRequirements((prev) =>
      prev.map((req) => {
        const { [name]: _removed, ...custom_values } = req.custom_values;
        return { ...req, custom_values };
      })
    );
  };

  const exportCsv = () => {
    const header = columns.join(",");
    const rows = visibleRequirements.map((req) =>
      columns
        .map((col) => {
          const value =
            col === "assignee"
              ? req.assignee_name || ""
              : col in req
                ? req[col as keyof Requirement]
                : req.custom_values[col];
          return `"${String(value ?? "").replaceAll('"', '""')}"`;
        })
        .join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${viewId}-requirements.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("已导出 CSV");
  };

  const importRows = (rows: Array<Record<string, string | number | null>>) => {
    const now = new Date().toISOString();
    setRequirements((prev) => [
      ...prev,
      ...rows.map((row, index) => {
        const nextNumber = prev.length + index + 1;
        return {
          id: `import-${Date.now()}-${index}`,
          view_id: viewId,
          requirement_number: nextNumber,
          title: String(row["标题"] || row.title || `导入需求 ${nextNumber}`),
          description: row["描述"] ? String(row["描述"]) : null,
          priority: Number(row["优先级"] ?? row.priority ?? 3),
          status: "pending" as const,
          type: "feature" as const,
          assignee_id: null,
          assignee_name: row["负责人"] ? String(row["负责人"]) : null,
          assignee_avatar: null,
          custom_values: {},
          order_index: nextNumber,
          created_at: now,
          updated_at: now,
        };
      }),
    ]);
    setNotice(`已导入 ${rows.length} 条需求`);
  };

  return (
    <AuthGuard>
      <AppShell
        title="版本视图"
        breadcrumbs={[
          { label: "项目", href: `/dashboard/project?projectId=${projectId}` },
          { label: "需求视图" },
        ]}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                v1.0 MVP 需求
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                搜索、筛选、排序、导入导出和自定义列都在此视图内完成。
              </p>
            </div>
            {notice && (
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {notice}
              </div>
            )}
          </div>

          <RequirementsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAdd={addRequirement}
            onImport={() => setShowImport((value) => !value)}
            onAddColumn={() => setNotice("在下方输入列名后新增自定义列")}
            onSort={() => setSortAsc((value) => !value)}
            onFilter={() => setOnlyOpen((value) => !value)}
            onExport={exportCsv}
          />

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Columns3 className="h-4 w-4 text-ceylon-500" />
              自定义列
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {customColumns.map((column) => (
                <span
                  key={column}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs"
                >
                  {column}
                  <button
                    type="button"
                    aria-label={`删除列 ${column}`}
                    onClick={() => removeColumn(column)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                aria-label="新列名"
                className="w-36"
                placeholder="新列名"
                value={newColumn}
                onChange={(event) => setNewColumn(event.target.value)}
              />
              <Button variant="outline" onClick={addColumn}>
                <Plus className="mr-2 h-4 w-4" />
                新增列
              </Button>
            </div>
          </div>

          {onlyOpen && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
              当前仅显示未完成需求
            </div>
          )}

          {showImport && (
            <ImportDataDialog
              onClose={() => setShowImport(false)}
              onConfirm={importRows}
            />
          )}

          <RequirementsTable
            requirements={visibleRequirements}
            columns={columns}
            onUpdate={(next) =>
              setRequirements((prev) =>
                prev.map((req) => (req.id === next.id ? next : req))
              )
            }
            onDelete={(target) =>
              setRequirements((prev) => prev.filter((req) => req.id !== target.id))
            }
            onBulkDelete={(ids) =>
              setRequirements((prev) => prev.filter((req) => !ids.includes(req.id)))
            }
          />
        </div>
      </AppShell>
    </AuthGuard>
  );
}

export default function RequirementViewPage() {
  return (
    <Suspense fallback={null}>
      <RequirementViewPageContent />
    </Suspense>
  );
}

