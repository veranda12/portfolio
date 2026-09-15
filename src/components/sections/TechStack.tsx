import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SelectedWork";

type Group = { category: string; items: string[] };

const CAPTIONS: Record<string, string> = {
  Application: "Tempat logika bisnis dan antarmuka berjalan",
  Data: "Tempat sumber kebenaran disimpan",
  Integration: "Bagaimana sistem saling berkomunikasi",
  Infrastructure: "Tempat semuanya berjalan di produksi",
};

// Grouped by capability, not a logo wall. Secondary to the work.
export function TechStack({ groups }: { groups: Group[] }) {
  return (
    <section id="stack" className="scroll-mt-16 border-b border-rule">
      <div className="shell py-16 md:py-24">
        <SectionHeader index="006" title="Stack" note="Dikelompokkan per kapabilitas" />

        <div className="mt-12 grid grid-cols-1 gap-px border border-rule bg-rule md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <ScrollReveal key={g.category} className="bg-paper p-6 md:p-8" delay={i * 60}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-semibold">{g.category}</h3>
                <span className="font-mono text-[0.66rem] text-ink-faint">{String(g.items.length).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 font-mono text-[0.66rem] leading-relaxed text-ink-faint">
                {CAPTIONS[g.category] ?? ""}
              </p>
              <ul className="mt-5 space-y-2.5">
                {g.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink-soft">
                    <span className="h-1 w-1 shrink-0 bg-signal" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
