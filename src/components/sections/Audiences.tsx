import { Building2, Rocket, Store, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Boop } from "@/components/motion/Boop";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { getDictionary, type Locale } from "@/i18n";



const ICONS: Record<string, LucideIcon> = { RTL: Store, FNB: UtensilsCrossed, B2B: Building2, STP: Rocket };
// Asymmetric 2×2 bento: wide/narrow, then narrow/wide.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function Audiences({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).audiences;
  const AUDIENCES = t.items;
  return (
    <Section id="audiences">
      <SectionHeader index="002" title={t.title} note={t.note} />

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {AUDIENCES.map((a, i) => {
          const Icon = ICONS[a.id] ?? Store;
          return (
            <ScrollReveal
              boop
              key={a.id}
              className={cn("ui-card ui-card-interactive rounded-card bg-surface p-6 shadow-card md:p-8", SPANS[i % 4])}
              delay={(i % 2) * 70}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-card bg-surface-elevated">
                  <Boop trigger="parent" rotation={i % 2 ? -12 : 12}>
                    <Icon className={cn("h-5 w-5", i % 2 ? "text-accent-blue" : "text-accent-pink")} />
                  </Boop>
                </span>
                <span className="text-[0.8125rem] font-semibold text-ink-muted">{a.id}</span>
              </div>
              <p className="label-signal mt-6">{a.label}</p>
              <h3 className="mt-2 text-[1.375rem] font-bold leading-snug text-ink md:text-[1.5rem]">{a.title}</h3>
              <p className="mt-3 max-w-xl text-body text-ink-muted">{a.body}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {a.systems.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
