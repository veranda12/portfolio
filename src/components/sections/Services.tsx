import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SelectedWork";

type Service = {
  id: string;
  title: string;
  summary: string;
  deliverables: string;
};

// Not a pricing table — a capability ledger. Each row expands on hover/focus.
export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="scroll-mt-16 border-b border-rule">
      <div className="shell py-16 md:py-24">
        <SectionHeader index="004" title="Yang Saya Bangun" note="Layanan" />

        <div className="mt-12 border-t border-rule">
          {services.map((s, i) => {
            const deliverables = s.deliverables.split("\n").map((d) => d.trim()).filter(Boolean);
            return (
              <ScrollReveal key={s.id}>
                <div className="group grid grid-cols-1 gap-6 border-b border-rule py-8 transition-colors hover:bg-paper-dim/50 md:grid-cols-12 md:py-10">
                  <div className="flex items-start gap-5 md:col-span-5">
                    <span className="font-mono text-sm text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                      {s.title}
                    </h3>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-base leading-relaxed text-ink-soft">{s.summary}</p>
                  </div>
                  <div className="md:col-span-3">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 md:flex-col md:gap-1.5">
                      {deliverables.map((d) => (
                        <li key={d} className="font-mono text-[0.72rem] text-ink-faint">
                          <span className="text-signal">—</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
