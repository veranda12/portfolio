import { cn } from "@/lib/cn";

// Renders a monospace architecture tree as a styled system panel — part of the
// design language, not a generic flowchart. Highlights arrows and the accent.
export function ArchitectureDiagram({
  text,
  className,
  label = "System architecture",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const lines = text.split("\n");

  return (
    <div className={cn("relative overflow-hidden border border-console-line bg-console text-paper", className)}>
      <div className="flex items-center justify-between border-b border-console-line px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
          <span className="font-mono text-[0.66rem] uppercase tracking-label text-paper/70">{label}</span>
        </div>
        <span className="font-mono text-[0.66rem] uppercase tracking-label text-paper/40">schematic</span>
      </div>

      <pre className="blueprint-dark overflow-x-auto p-6 font-mono text-[0.78rem] leading-6 md:text-sm md:leading-7">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {highlight(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}

function highlight(line: string) {
  // Color arrows/connectors with the signal accent; keep node labels light.
  const parts = line.split(/([│├└─▶▼→·]+)/g);
  return parts.map((part, i) => {
    if (/^[│├└─▶▼→·\s]+$/.test(part) && part.trim().length > 0) {
      return (
        <span key={i} className="text-signal">
          {part}
        </span>
      );
    }
    // Uppercase "headers" (all caps words) get emphasis.
    if (/^[A-Z0-9()./\s&-]+$/.test(part) && /[A-Z]/.test(part) && part.trim().length > 2) {
      return (
        <span key={i} className="font-semibold text-paper">
          {part}
        </span>
      );
    }
    return (
      <span key={i} className="text-paper/75">
        {part}
      </span>
    );
  });
}
