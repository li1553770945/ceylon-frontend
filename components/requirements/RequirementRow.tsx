"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Requirement, RequirementStatus, RequirementType } from "@/types";
import {
  statusStyles,
  statusLabels,
  typeStyles,
  typeLabels,
  priorityStyles,
} from "./RequirementsTable";
import type { TableColumn } from "./RequirementsTable";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface RequirementRowProps {
  requirement: Requirement;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate?: (requirement: Requirement) => void;
  columns: TableColumn[];
}

export default function RequirementRow({
  requirement,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onUpdate,
  columns,
}: RequirementRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const confirmEdit = (nextValue = editValue) => {
    if (!editingField) return;
    const patch: Partial<Requirement> = {};
    if (editingField === "title") {
      patch.title = nextValue.trim() || requirement.title;
    }
    if (editingField === "priority") {
      patch.priority = Number(nextValue);
    }
    if (editingField === "status") {
      patch.status = nextValue as RequirementStatus;
    }
    onUpdate?.({
      ...requirement,
      ...patch,
      updated_at: new Date().toISOString(),
    });
    cancelEdit();
  };

  const renderCell = (col: TableColumn) => {
    switch (col) {
      case "requirement_number":
        return (
          <span className="font-mono text-xs text-muted-foreground">
            #{requirement.requirement_number}
          </span>
        );
      case "title":
        if (editingField === "title") {
          return (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
              />
              <button onClick={() => confirmEdit()} className="text-emerald-600 hover:text-emerald-700">
                <Check className="h-3.5 w-3.5" />
              </button>
              <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        }
        return (
          <span
            className="cursor-pointer hover:text-ceylon-600"
            onClick={() => startEdit("title", requirement.title)}
          >
            {requirement.title}
          </span>
        );
      case "priority":
        if (editingField === "priority") {
          return (
            <div className="flex items-center gap-2">
              <select
                autoFocus
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={editValue}
                onChange={(e) => {
                  confirmEdit(e.target.value);
                }}
                onBlur={cancelEdit}
              >
                {[0, 1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    P{p}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <button
            onClick={() => startEdit("priority", String(requirement.priority))}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              priorityStyles[requirement.priority] || priorityStyles[5]
            )}
          >
            P{requirement.priority}
          </button>
        );
      case "status":
        if (editingField === "status") {
          return (
            <select
              autoFocus
              className="h-8 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={editValue}
              onChange={(e) => {
                confirmEdit(e.target.value);
              }}
              onBlur={cancelEdit}
            >
              {(["pending", "in_progress", "completed", "rejected"] as RequirementStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                )
              )}
            </select>
          );
        }
        return (
          <button
            onClick={() => startEdit("status", requirement.status)}
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusStyles[requirement.status]
            )}
          >
            {statusLabels[requirement.status]}
          </button>
        );
      case "type":
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
              typeStyles[requirement.type]
            )}
          >
            {typeLabels[requirement.type]}
          </span>
        );
      case "assignee":
        return (
          <div className="flex items-center gap-2">
            {requirement.assignee_avatar ? (
              <Image
                src={requirement.assignee_avatar}
                alt={requirement.assignee_name || ""}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                {requirement.assignee_name?.charAt(0) || "?"}
              </div>
            )}
            <span className="text-muted-foreground">
              {requirement.assignee_name || "未分配"}
            </span>
          </div>
        );
      default:
        const customValue = requirement.custom_values?.[col];
        return (
          <span className="text-muted-foreground">
            {customValue != null ? String(customValue) : "—"}
          </span>
        );
    }
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-grid-3 py-3">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border accent-ceylon-500"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      {columns.map((col) => (
        <td key={col} className="px-grid-4 py-3 whitespace-nowrap">
          {renderCell(col)}
        </td>
      ))}
      <td className="px-grid-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
