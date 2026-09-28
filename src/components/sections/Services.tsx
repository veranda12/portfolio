import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { getDictionary, type Locale } from "@/i18n";

type Service = {
  id: string;
  title: string;
  summary: string;
  deliverables: string;
};

// Not a pricing table — a capability ledger: one tactile row per service on
// a single surface panel, rows separated by background, not borders.
export function Services({ services, lang }: { services: Service[]; lang: Locale }) {
  const t = getDictionary(lang).services;
  return (
    <Section id="services" tone="surface">
      <SectionHeader index="005" title={t.title} note={t.note} />

      <div className="mt-10 flex flex-col gap-3 md:mt-12">
        {services.map((s, i) => {
          const deliverables = s.deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
          return (
            <ScrollReveal key={s.id}>
              <div className="ui-card group grid grid-cols-1 gap-5 rounded-card bg-canvas/60 p-6 hover:bg-canvas md:grid-cols-12 md:gap-8 md:p-8">
                <div className="flex items-start gap-5 md:col-span-5">
                  <span className="mt-1.5 text-[0.8125rem] font-semibold text-accent-pink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.5rem] font-bold leading-tight text-ink md:text-[1.75rem]">{s.title}</h3>
                </div>
                <div className="md:col-span-4">
                  <p className="text-body text-ink-muted">{s.summary}</p>
                </div>
                <div className="md:col-span-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {deliverables.map((d) => (
                      <li key={d}>
                        <Tag>{d}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
