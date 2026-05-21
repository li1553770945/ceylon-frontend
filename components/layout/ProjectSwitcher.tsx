"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FolderKanban, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectItem {
  id: string;
  name: string;
}

interface ProjectSwitcherProps {
  projects?: ProjectItem[];
  currentProjectId?: string;
}

export function ProjectSwitcher({
  projects = [],
  currentProjectId,
}: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = projects.find((p) => p.id === currentProjectId) || projects[0];

  return (
    <div ref={ref} className="relative px-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent"
      >
        <span className="flex items-center gap-2 truncate">
          <FolderKanban className="h-4 w-4 text-[#c85c1b]" />
          <span className="truncate">{current?.name || "选择项目"}</span>
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-4 right-4 z-10 mt-1 rounded-md border bg-popover p-1 shadow-md">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                p.id === currentProjectId
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent/50"
              )}
            >
              <FolderKanban className="h-4 w-4" />
              {p.name}
            </Link>
          ))}
          <div className="my-1 border-t" />
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent/50"
          >
            <Plus className="h-4 w-4" />
            新建项目
          </button>
        </div>
      )}
    </div>
  );
}
