import { FileLock2, KeyRound, LifeBuoy, Server, ShieldCheck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Boop } from "@/components/motion/Boop";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { getDictionary, type Locale } from "@/i18n";


const ICONS: LucideIcon[] = [LifeBuoy, ShieldCheck, FileLock2, Wallet, KeyRound, Server];
// Bento rhythm instead of a uniform 3-up grid: wide/narrow, narrow/wide, half/half.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

export function Trust({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).trust;
  const ITEMS = t.items;
  return (
    <Section id="jaminan" tone="surface">
      <SectionHeader index="007" title={t.title} note={t.note} />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-12 lg:gap-5">
        {ITEMS.map((it, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <ScrollReveal
              boop
              key={it.title}
              className={cn("ui-card flex gap-5 rounded-card bg-canvas/60 p-6 hover:bg-canvas md:p-7", SPANS[i % SPANS.length])}
              delay={(i % 2) * 70}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-surface-elevated" aria-hidden>
                <Boop trigger="parent" rotation={i % 2 ? -12 : 12}>
                  <Icon className={cn("h-5 w-5", i % 3 === 1 ? "text-accent-blue" : "text-accent-pink")} />
                </Boop>
              </span>
              <div>
                <h3 className="text-[1.125rem] font-bold leading-snug text-ink">{it.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{it.body}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
