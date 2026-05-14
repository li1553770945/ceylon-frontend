"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  Trash2,
  Columns3,
} from "lucide-react";

interface RequirementsToolbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onAdd?: () => void;
  onImport?: () => void;
  onAddColumn?: () => void;
  onSort?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
}

export default function RequirementsToolbar({
  searchQuery = "",
  onSearchChange,
  onAdd,
  onImport,
  onAddColumn,
  onSort,
  onFilter,
  onExport,
  selectedCount = 0,
  onBulkDelete,
}: RequirementsToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  return (
    <div className="flex flex-col gap-grid-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center gap-grid-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索需求..."
            className="pl-9"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <Button variant="outline" size="sm" className="gap-2" onClick={onFilter}>
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">筛选</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-2" onClick={onSort}>
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">排序</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-2" onClick={onExport}>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">导出</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-2" onClick={onAddColumn}>
          <Columns3 className="h-4 w-4" />
          <span className="hidden sm:inline">列</span>
        </Button>

        <Button variant="outline" size="sm" className="gap-2" onClick={onImport}>
          导入
        </Button>
      </div>

      <div className="flex items-center gap-grid-3">
        {selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={onBulkDelete}
          >
            <Trash2 className="h-4 w-4" />
            删除 ({selectedCount})
          </Button>
        )}
        <Button
          size="sm"
          className="gap-2 bg-ceylon-500 hover:bg-ceylon-600"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
          新建需求
        </Button>
      </div>
    </div>
  );
}
