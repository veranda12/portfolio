import { cn } from "@/lib/cn";

type Tone = "surface" | "elevated";

const TONES: Record<Tone, string> = {
  surface: "bg-surface",
  elevated: "bg-surface-elevated",
};

// Depth comes from background layering (canvas → surface → elevated), not
// borders. `interactive` adds the spring lift used on clickable cards;
// pair it with a `group` link/wrapper.
export function Card({
  as: Tag = "div",
  tone = "surface",
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}: {
  as?: React.ElementType;
  tone?: Tone;
  interactive?: boolean;
  padded?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag
      className={cn(
        "ui-card relative rounded-card",
        TONES[tone],
        padded && "p-6",
        interactive && "ui-card-interactive",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Larger container for demo panels and showcase blocks (radius 1rem).
export function Panel({
  as: Tag = "div",
  className,
  children,
  ...rest
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag className={cn("relative rounded-panel bg-surface-elevated p-6 md:p-8", className)} {...rest}>
      {children}
    </Tag>
  );
}

// Small pill tag for tech names and metadata.
export function Tag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-3 py-1 text-[0.8125rem] font-medium text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
