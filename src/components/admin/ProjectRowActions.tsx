"use client";

import { useTransition } from "react";
import { togglePublish, toggleFeature, moveProject } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

export function ProjectRowActions({
  id,
  published,
  featured,
  isFirst,
  isLast,
}: {
  id: string;
  published: boolean;
  featured: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div className={cn("flex items-center gap-1.5", pending && "opacity-50")}>
      <button
        type="button"
        onClick={() => start(() => togglePublish(id, !published))}
        title={published ? "Unpublish" : "Publish"}
        className={cn(
          "px-2 py-1 font-mono text-[0.6rem] uppercase tracking-label transition-colors",
          published ? "bg-signal/15 text-signal hover:bg-signal/25" : "bg-surface-2 text-ink-faint hover:text-ink"
        )}
      >
        {published ? "Live" : "Draft"}
      </button>
      <button
        type="button"
        onClick={() => start(() => toggleFeature(id, !featured))}
        title={featured ? "Unfeature" : "Feature"}
        className={cn(
          "px-2 py-1 font-mono text-[0.6rem] uppercase tracking-label transition-colors",
          featured ? "bg-ink/10 text-ink" : "bg-surface-2 text-ink-faint hover:text-ink"
        )}
      >
        ★
      </button>
      <div className="flex flex-col">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => start(() => moveProject(id, "up"))}
          className="px-1.5 font-mono text-[0.6rem] text-ink-faint hover:text-signal disabled:opacity-20"
          title="Move up"
        >
          ▲
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => start(() => moveProject(id, "down"))}
          className="px-1.5 font-mono text-[0.6rem] text-ink-faint hover:text-signal disabled:opacity-20"
          title="Move down"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
