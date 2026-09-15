import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/sections/SelectedWork";

export function About({ settings }: { settings: Record<string, string> }) {
  const body = settings["about.body"].split("\n").filter((p) => p.trim());
  const principles = [
    settings["about.principle1"],
    settings["about.principle2"],
    settings["about.principle3"],
  ].filter(Boolean);

  return (
    <section id="about" className="scroll-mt-16 border-b border-rule bg-ink text-paper">
      <div className="shell py-16 md:py-24">
        <div className="flex flex-col gap-4 border-t border-paper/30 pt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-baseline gap-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-label text-signal">[ 005 ]</span>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">Pendekatan</h2>
          </div>
          <span className="font-mono text-[0.68rem] uppercase tracking-label text-paper/50">Filosofi engineering</span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <ScrollReveal className="md:col-span-7">
            <h3 className="max-w-2xl font-display text-2xl font-semibold leading-snug md:text-4xl">
              {settings["about.heading"]}
            </h3>
            <div className="mt-8 max-w-2xl space-y-5">
              {body.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-paper/75 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-5 md:pl-8" delay={100}>
            <p className="font-mono text-[0.68rem] uppercase tracking-label text-paper/50">Prinsip</p>
            <ul className="mt-6 divide-y divide-paper/15 border-y border-paper/15">
              {principles.map((p, i) => (
                <li key={i} className="flex gap-4 py-5">
                  <span className="font-mono text-sm text-signal">0{i + 1}</span>
                  <span className="text-base leading-relaxed text-paper/85">{p}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
