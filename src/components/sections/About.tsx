import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { PrincipleKeys } from "./PrincipleKeys";

export function About({ settings }: { settings: Record<string, string> }) {
  const body = settings["about.body"].split("\n").filter((p) => p.trim());
  const principles = [
    settings["about.principle1"],
    settings["about.principle2"],
    settings["about.principle3"],
  ].filter(Boolean);

  return (
    <Section id="about">
      <SectionHeading
        eyebrow={
          <span className="inline-flex rounded-button bg-surface-elevated px-2.5 py-1 text-[0.8125rem] font-semibold text-accent-pink">
            008
          </span>
        }
        title="Pendekatan"
        note={<span className="label">Filosofi engineering</span>}
      />

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 lg:grid-cols-12 lg:gap-6">
        {/* Story card */}
        <ScrollReveal className="relative overflow-hidden rounded-panel bg-surface p-6 shadow-card md:p-10 lg:col-span-7">
          <span
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-blue/[0.07]"
            aria-hidden
          />
          <h3 className="relative max-w-2xl text-[1.625rem] font-bold leading-snug tracking-[-0.01em] text-ink md:text-[2rem]">
            {settings["about.heading"]}
          </h3>
          <div className="relative mt-6 max-w-2xl space-y-5">
            {body.map((p, i) => (
              <p key={i} className="text-body text-ink-muted">
                {p}
              </p>
            ))}
          </div>
        </ScrollReveal>

        {/* Principles with pressable keycaps */}
        <ScrollReveal className="flex flex-col gap-4 lg:col-span-5" delay={80}>
          <Eyebrow tone="muted" className="px-1 text-[0.8125rem] normal-case tracking-label">
            Prinsip
          </Eyebrow>
          <PrincipleKeys principles={principles} />
        </ScrollReveal>
      </div>
    </Section>
  );
}
