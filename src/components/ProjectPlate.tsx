import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

// When a project has no uploaded image yet, render a designed typographic
// "plate" instead of an empty box — a spec panel on the elevated surface,
// replaced automatically once an image is added. Inside a `group` element it
// shows a "Lihat Proyek" chip on hover.
export function ProjectPlate({
  title,
  index,
  category,
  tech,
  image,
  className,
  dark = false,
  priority = false,
  overlay = true,
  sizes = "(max-width: 768px) 100vw, 66vw",
  overlayLabel = "Lihat Proyek",
}: {
  title: string;
  index: number;
  category: string;
  tech?: string[];
  image?: string | null;
  className?: string;
  dark?: boolean;
  priority?: boolean;
  overlay?: boolean;
  sizes?: string;
  overlayLabel?: string;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden rounded-card bg-surface-elevated", className)}>
        <Image
          src={image}
          alt={title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 [transition-timing-function:var(--spring-snappy)] group-hover:scale-[1.03]"
          priority={priority}
        />
        {overlay ? <HoverOverlay label={overlayLabel} /> : null}
      </div>
    );
  }

  const id = `PRJ-${String(index).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-6 overflow-hidden rounded-card p-5 text-ink md:p-7",
        dark ? "bg-canvas" : "bg-surface-elevated",
        className
      )}
    >
      {/* soft corner shape */}
      <span
        className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent-pink/[0.08] transition-transform duration-500 [transition-timing-function:var(--spring-snappy)] group-hover:scale-110"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.06em]">
        <span className="text-accent-pink">{id}</span>
        <span className="truncate text-ink-muted">{category}</span>
      </div>

      <div className="relative">
        <div className="max-w-[18ch] text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.02em]">
          {title}
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink-muted">
        {(tech ?? []).slice(0, 5).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {overlay ? <HoverOverlay label={overlayLabel} /> : null}
    </div>
  );
}

function HoverOverlay({ label }: { label: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      aria-hidden
    >
      <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-button bg-ink px-3.5 py-2 text-[0.8125rem] font-semibold text-canvas shadow-lift transition-transform duration-500 [transition-timing-function:var(--spring-snappy)] group-hover:translate-y-0">
        {label}
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
      </span>
    </div>
  );
}
