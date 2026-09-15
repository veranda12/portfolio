import Image from "next/image";
import { cn } from "@/lib/cn";

// When a project has no uploaded image yet, render a designed typographic
// "plate" instead of a broken/empty box. It reads as an intentional spec panel,
// not a placeholder — and is replaced automatically once an image is added.
export function ProjectPlate({
  title,
  index,
  category,
  tech,
  image,
  className,
  dark = false,
  priority = false,
}: {
  title: string;
  index: number;
  category: string;
  tech?: string[];
  image?: string | null;
  className?: string;
  dark?: boolean;
  priority?: boolean;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-dim", className)}>
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  const id = `PRJ-${String(index).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden p-6 md:p-8",
        dark ? "bg-console text-paper" : "bg-ink text-paper",
        className
      )}
    >
      {/* faint blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,241,234,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,241,234,0.5) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[0.68rem] uppercase tracking-label text-signal">{id}</span>
        <span className="font-mono text-[0.68rem] uppercase tracking-label text-paper/60">{category}</span>
      </div>

      <div className="relative">
        <div className="font-display text-[clamp(1.6rem,4vw,3rem)] font-semibold leading-[1.02]">
          {title}
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-x-4 gap-y-1">
        {(tech ?? []).slice(0, 5).map((t) => (
          <span key={t} className="font-mono text-[0.66rem] text-paper/55">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
