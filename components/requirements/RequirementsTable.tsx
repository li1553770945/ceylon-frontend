"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Requirement, RequirementStatus, RequirementType } from "@/types";
import RequirementRow from "./RequirementRow";
import {
  ClipboardList,
} from "lucide-react";

export type TableColumn =
  | "requirement_number"
  | "title"
  | "priority"
  | "status"
  | "type"
  | "assignee"
  | string;

interface RequirementsTableProps {
  requirements: Requirement[];
  columns?: TableColumn[];
  onEdit?: (req: Requirement) => void;
  onDelete?: (req: Requirement) => void;
  onUpdate?: (req: Requirement) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const defaultColumns: TableColumn[] = [
  "requirement_number",
  "title",
  "priority",
  "status",
  "type",
  "assignee",
];

const columnLabels: Record<string, string> = {
  requirement_number: "编号",
  title: "标题",
  priority: "优先级",
  status: "状态",
  type: "类型",
  assignee: "负责人",
};

export const statusStyles: Record<RequirementStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export const statusLabels: Record<RequirementStatus, string> = {
  pending: "待处理",
  in_progress: "进行中",
  completed: "已完成",
  rejected: "已拒绝",
};

export const typeStyles: Record<RequirementType, string> = {
  feature: "bg-violet-50 text-violet-700 border-violet-200",
  bug: "bg-red-50 text-red-700 border-red-200",
  improvement: "bg-sky-50 text-sky-700 border-sky-200",
  task: "bg-slate-50 text-slate-600 border-slate-200",
};

export const typeLabels: Record<RequirementType, string> = {
  feature: "功能",
  bug: "缺陷",
  improvement: "优化",
  task: "任务",
};

export const priorityStyles: Record<number, string> = {
  0: "bg-red-50 text-red-700 border-red-200",
  1: "bg-orange-50 text-orange-700 border-orange-200",
  2: "bg-amber-50 text-amber-700 border-amber-200",
  3: "bg-blue-50 text-blue-700 border-blue-200",
  4: "bg-slate-50 text-slate-600 border-slate-200",
  5: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function RequirementsTable({
  requirements,
  columns = defaultColumns,
  onEdit,
  onDelete,
  onUpdate,
  onBulkDelete,
}: RequirementsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected =
    requirements.length > 0 && selectedIds.size === requirements.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(requirements.map((r) => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    onBulkDelete?.(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const visibleColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <div className="space-y-grid-3">
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-grid-4 py-2">
          <span className="text-sm text-muted-foreground">
            已选择 <span className="font-medium text-foreground">{selectedIds.size}</span> 项
          </span>
          <button
            onClick={handleBulkDelete}
            className="text-sm font-medium text-destructive hover:underline"
          >
            批量删除
          </button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-grid-3 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-ceylon-500"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                {visibleColumns.map((col) => (
                  <th
                    key={col}
                    className="px-grid-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {columnLabels[col] || col}
                  </th>
                ))}
                <th className="w-20 px-grid-4 py-3 text-right font-medium text-muted-foreground">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requirements.map((req) => (
                <RequirementRow
                  key={req.id}
                  requirement={req}
                  isSelected={selectedIds.has(req.id)}
                  onSelect={() => toggleSelect(req.id)}
                  onEdit={() => onEdit?.(req)}
                  onDelete={() => onDelete?.(req)}
                  onUpdate={onUpdate}
                  columns={visibleColumns}
                />
              ))}
              {requirements.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleColumns.length + 2}
                    className="px-grid-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ClipboardList className="h-10 w-10 mb-grid-3 opacity-40" />
                      <p className="text-sm font-medium">暂无需求</p>
                      <p className="text-xs mt-1">创建一个新需求开始管理</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
