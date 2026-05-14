"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";

interface ParsedRow {
  [key: string]: string | number | null;
}

interface ImportDataDialogProps {
  open?: boolean;
  onClose?: () => void;
  onConfirm?: (data: ParsedRow[]) => void;
}

export default function ImportDataDialog({
  open = true,
  onClose,
  onConfirm,
}: ImportDataDialogProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const processFile = (f: File) => {
    setFile(f);
    // Placeholder for PapaParse / xlsx integration
    // Mock parsed data for preview
    const mock: ParsedRow[] = [
      { 编号: "REQ-001", 标题: "用户登录功能", 优先级: 1, 状态: "pending", 类型: "feature", 负责人: "张三" },
      { 编号: "REQ-002", 标题: "修复首页加载慢", 优先级: 0, 状态: "in_progress", 类型: "bug", 负责人: "李四" },
      { 编号: "REQ-003", 标题: "优化数据库索引", 优先级: 3, 状态: "pending", 类型: "improvement", 负责人: "王五" },
    ];
    setParsedData(mock);
    setStep("preview");
  };

  const handleConfirm = () => {
    onConfirm?.(parsedData);
    setStep("done");
  };

  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setStep("upload");
  };

  if (!open) return null;

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-grid-4 py-grid-3">
        <h2 className="text-lg font-semibold">导入需求</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-grid-4 space-y-grid-4">
        {step === "upload" && (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-grid-8 transition-colors ${
                dragOver
                  ? "border-ceylon-500 bg-ceylon-50"
                  : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ceylon-50">
                <Upload className="h-6 w-6 text-ceylon-500" />
              </div>
              <p className="mt-grid-3 text-sm font-medium">
                拖拽文件到此处，或{" "}
                <label className="cursor-pointer text-ceylon-600 hover:underline">
                  点击上传
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                支持 CSV、Excel 格式（最大 5MB）
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-grid-3">
              <h3 className="text-sm font-medium">字段映射规则</h3>
              <div className="mt-grid-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">编号</span>
                  <span>→ requirement_number</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">标题</span>
                  <span>→ title</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">优先级</span>
                  <span>→ priority (0-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">状态</span>
                  <span>→ status</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">类型</span>
                  <span>→ type</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground">负责人</span>
                  <span>→ assignee_name</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "preview" && file && (
          <>
            <div className="flex items-center gap-grid-3 rounded-md border border-border bg-muted/30 px-grid-3 py-2">
              <FileSpreadsheet className="h-5 w-5 text-ceylon-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB · {parsedData.length} 行数据
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                重新选择
              </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      {Object.keys(parsedData[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="px-grid-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        {Object.values(row).map((val, i) => (
                          <td
                            key={i}
                            className="px-grid-4 py-2.5 whitespace-nowrap text-muted-foreground"
                          >
                            {val != null ? String(val) : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-grid-2">
              <Button variant="outline" onClick={handleReset}>
                取消
              </Button>
              <Button className="bg-ceylon-500 hover:bg-ceylon-600" onClick={handleConfirm}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                确认导入
              </Button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center py-grid-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="mt-grid-3 text-lg font-semibold">导入成功</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              已成功导入 {parsedData.length} 条需求数据
            </p>
            <Button className="mt-grid-4 bg-ceylon-500 hover:bg-ceylon-600" onClick={handleReset}>
              继续导入
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
