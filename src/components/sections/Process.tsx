import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getDictionary, type Locale } from "@/i18n";



export function Process({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).process;
  const STEPS = t.steps;
  const INCLUDES = t.includes;
  return (
    <Section id="process">
      <SectionHeader index="006" title={t.title} note={t.note} />

      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 lg:grid-cols-12 lg:gap-12">
        {/* Steps as a connected timeline */}
        <div className="lg:col-span-7">
          <ol className="relative flex flex-col gap-3">
            <span className="absolute bottom-8 left-[1.4rem] top-8 w-px bg-line md:left-[1.65rem]" aria-hidden />
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.no} as="li" delay={i * 60} className="relative">
                <div className="ui-card flex gap-4 rounded-card p-3 hover:bg-surface md:gap-5 md:p-4">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-[0.8125rem] font-semibold text-accent-pink md:h-9 md:w-9">
                    {s.no}
                  </span>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[1.25rem] font-bold text-ink">{s.title}</h3>
                      <span className="label">{s.time}</span>
                    </div>
                    <p className="mt-1.5 max-w-md text-body text-ink-muted">{s.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </ol>
        </div>

        {/* What you get + investment note */}
        <div className="lg:col-span-5">
          <ScrollReveal className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="rounded-panel bg-surface p-6 shadow-card md:p-8">
              <p className="label-signal">{t.includesTitle}</p>
              <ul className="mt-5 space-y-3.5">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-elevated" aria-hidden>
                      <Check className="h-3 w-3 text-accent-pink" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-panel bg-surface-elevated p-6 shadow-card md:p-8">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-accent-blue">
                {t.costTitle}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{t.costBody}</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {t.payBefore}
                <span className="font-semibold text-ink">{t.payStrong}</span>
                {t.payAfter}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Section>
  );
}
