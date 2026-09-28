import { cn } from "@/lib/cn";

// Page section: 3rem → 6rem vertical rhythm, 1200px content column.
export function Section({
  id,
  tone = "canvas",
  className,
  innerClassName,
  children,
  ...rest
}: {
  id?: string;
  tone?: "canvas" | "surface";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "id">) {
  return (
    <section
      id={id}
      className={cn(id && "scroll-mt-20", tone === "surface" && "bg-surface", className)}
      {...rest}
    >
      <div className={cn("shell section-y", innerClassName)}>{children}</div>
    </section>
  );
}

// Section heading block. `eyebrow` and `note` only ever receive existing copy.
export function SectionHeading({
  title,
  eyebrow,
  note,
  as: Heading = "h2",
  className,
}: {
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  note?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
        <Heading className="text-section-sm text-ink md:text-section">{title}</Heading>
      </div>
      {note ? <Eyebrow tone="muted">{note}</Eyebrow> : null}
    </div>
  );
}

// Legacy-compatible header used across the home + capabilities pages. The
// sequential index is kept in the DOM but hidden, as it was before.
export function SectionHeader({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <>
      <span className="hidden">{index}</span>
      <SectionHeading title={title} note={note} />
    </>
  );
}

// Small eyebrow / metadata label.
export function Eyebrow({
  tone = "pink",
  as: Tag = "p",
  className,
  children,
}: {
  tone?: "pink" | "muted" | "blue";
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "text-[0.8125rem] font-semibold uppercase tracking-[0.06em]",
        tone === "pink" && "text-accent-pink",
        tone === "muted" && "text-ink-muted",
        tone === "blue" && "text-accent-blue",
        className
      )}
    >
      {children}
    </Tag>
  );
}
