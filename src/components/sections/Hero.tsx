import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Globe, LayoutDashboard, Plug } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Boop } from "@/components/motion/Boop";
import { Sparkles } from "@/components/motion/Sparkles";
import { getDictionary, lp, type Locale } from "@/i18n";

type HeroProps = {
  settings: Record<string, string>;
  stats: { projects: number; years: string };
  lang: Locale;
};

// Icons/tones per capability tile; the copy comes from the dictionary.
const CAPABILITY_STYLE: { icon: LucideIcon; tone: string }[] = [
  { icon: Globe, tone: "text-accent-blue" },
  { icon: LayoutDashboard, tone: "text-accent-pink" },
  { icon: Plug, tone: "text-accent-pink" },
  { icon: Activity, tone: "text-accent-blue" },
];

export function Hero({ settings, stats, lang }: HeroProps) {
  const t = getDictionary(lang);
  const CAPABILITIES = t.hero.capabilities.map((c, i) => ({ ...c, ...CAPABILITY_STYLE[i] }));
  return (
    <section className="relative overflow-hidden">
      <HeroBackdrop />

      <div className="shell relative pb-16 pt-6 md:pb-28 md:pt-10">
        {/* Metadata rail */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.8125rem] text-ink-muted">
          <div className="flex items-center gap-2.5">
            <span className="status-dot" aria-hidden />
            <span className="label">{settings["hero.availability"]}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="label hidden sm:inline">
              {t.hero.basedIn} {settings["contact.location"].split(",")[0].trim()}
            </span>
            <span className="label-signal">{stats.projects.toString().padStart(2, "0")} {t.common.projectsCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-6">
            <p className="mb-4 inline-block -rotate-2 font-hand text-[1.75rem] font-bold leading-none text-accent-pink md:text-[2rem]">
              {settings["hero.kicker"]}
            </p>
            <h1 className="text-hero-sm text-ink sm:text-[3.25rem] sm:leading-[1.1] lg:text-hero">
              {settings["hero.line1"]}
              <br />
              <span className="text-accent-pink">
                <Sparkles>{settings["hero.line2"]}</Sparkles>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-body text-ink-muted md:text-[1.25rem]">
              {settings["hero.statement"]}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={lp(lang, "/#work")} className="ui-btn ui-btn-secondary group">
                {t.hero.seeWork}
                <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
              </Link>
              <Link href={lp(lang, "/#contact")} className="ui-btn ui-btn-primary group">
                {t.common.startProject}
                <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
              </Link>
            </div>
          </div>

          {/* Visual: the four things I build, drawn as one connected system,
              with the mascot standing beside it. */}
          <div className="relative pb-28 lg:col-span-6 lg:pb-0 lg:pl-28">
            <div className="relative mx-auto max-w-md rounded-[1.5rem] bg-panel p-2.5 shadow-lift lg:ml-auto lg:rotate-[1.5deg]">
              <div className="relative grid grid-cols-2 gap-3 rounded-[1.125rem] bg-canvas p-3 pb-6 sm:gap-4 sm:p-5 sm:pb-8">
                {/* connectors to the hub */}
                <span className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 border-l border-dashed border-line" aria-hidden />
                <span className="absolute left-6 top-1/2 h-px w-[calc(100%-3rem)] -translate-y-1/2 border-t border-dashed border-line" aria-hidden />
                <span
                  className="absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-panel shadow-lift"
                  aria-hidden
                >
                  <span className="status-dot" />
                </span>

                {CAPABILITIES.map(({ title, sub, icon: Icon, tone }, i) => (
                  <div key={title} className={i % 2 === 1 ? "translate-y-3" : ""}>
                    <div data-boop className="ui-card relative h-full rounded-card bg-surface p-4 shadow-card hover:-translate-y-1 hover:shadow-card-hover sm:p-5">
                      <Boop trigger="parent" rotation={i % 2 ? -12 : 12}>
                        <Icon className={`h-5 w-5 ${tone}`} strokeWidth={2} />
                      </Boop>
                      <p className="mt-4 text-[0.9375rem] font-semibold leading-snug text-ink sm:text-base">{title}</p>
                      <p className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Boop
              rotation={-6}
              y={-6}
              className="absolute -bottom-2 right-2 z-20 w-24 sm:w-28 lg:bottom-[-2.5rem] lg:-left-6 lg:right-auto lg:w-40"
            >
              <Image
                src="/mascot/hero.webp"
                alt=""
                width={346}
                height={603}
                priority
                sizes="(min-width: 1024px) 160px, 112px"
                className="h-auto w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.35)]"
              />
            </Boop>
          </div>
        </div>
      </div>
    </section>
  );
}

// Soft, low-contrast shapes behind the hero — layered surfaces, no glow.
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
      <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-surface/60" />
      <div className="absolute -right-10 top-48 h-64 w-64 rounded-full bg-accent-pink/[0.06]" />
      <svg
        className="absolute inset-x-0 bottom-0 h-24 w-full text-surface/50 md:h-32"
        viewBox="0 0 1440 128"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0 96c120-40 240-56 360-40s220 52 360 44 220-64 360-72 240 28 360 52v48H0z" />
      </svg>
    </div>
  );
}
