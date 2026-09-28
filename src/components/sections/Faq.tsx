import { ArrowRight, Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getDictionary, type Locale } from "@/i18n";


export function Faq({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).faq;
  const FAQS = t.items;
  return (
    <Section id="faq" tone="surface">
      <SectionHeader index="010" title={t.title} note={t.note} />

      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <ScrollReveal className="lg:sticky lg:top-24">
            <p className="max-w-xs text-body text-ink-muted">{t.intro}</p>
            <a href="#contact" className="ui-link group mt-6">
              <span className="link-underline">{t.ask}</span>
              <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
            </a>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="ui-card group rounded-card bg-canvas/60 open:bg-canvas hover:bg-canvas"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-card p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-4">
                    <span className="mt-1 text-[0.8125rem] font-semibold text-accent-pink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.0625rem] font-semibold leading-snug text-ink md:text-[1.125rem]">{f.q}</span>
                  </span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-accent-pink transition-transform duration-500 [transition-timing-function:var(--spring-snappy)] group-open:rotate-45"
                    aria-hidden
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="max-w-2xl px-5 pb-6 pl-[3.25rem] text-body text-ink-muted md:px-6 md:pl-[3.75rem]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
