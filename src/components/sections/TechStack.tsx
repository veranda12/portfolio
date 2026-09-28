import { Cable, Database, Layers, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Boop } from "@/components/motion/Boop";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { getDictionary, type Locale } from "@/i18n";

type Group = { category: string; items: string[] };


const ICONS: Record<string, LucideIcon> = {
  Application: Layers,
  Data: Database,
  Integration: Cable,
  Infrastructure: Server,
};
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

// Grouped by capability, not a logo wall. Secondary to the work.
export function TechStack({ groups, lang }: { groups: Group[]; lang: Locale }) {
  const t = getDictionary(lang).stack;
  const CAPTIONS = t.captions;
  return (
    <Section id="stack">
      <SectionHeader index="009" title={t.title} note={t.note} />

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {groups.map((g, i) => {
          const Icon = ICONS[g.category] ?? Layers;
          return (
            <ScrollReveal
              boop
              key={g.category}
              className={cn("ui-card rounded-card bg-surface p-6 shadow-card md:p-7", SPANS[i % SPANS.length])}
              delay={(i % 2) * 70}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-card bg-surface-elevated" aria-hidden>
                    <Boop trigger="parent" rotation={i % 2 ? -12 : 12}>
                      <Icon className={cn("h-5 w-5", i % 2 ? "text-accent-blue" : "text-accent-pink")} />
                    </Boop>
                  </span>
                  <h3 className="text-[1.125rem] font-bold text-ink">{g.category}</h3>
                </div>
                <span className="text-[0.8125rem] font-semibold text-ink-muted">
                  {String(g.items.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">{CAPTIONS[g.category] ?? ""}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li key={item}>
                    <Tag className="text-ink">{item}</Tag>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
