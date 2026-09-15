import Link from "next/link";

type HeroProps = {
  settings: Record<string, string>;
  stats: { projects: number; years: string };
};

export function Hero({ settings, stats }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <div className="shell relative pb-16 pt-14 md:pb-24 md:pt-20">
        {/* Top metadata rail — the "spec sheet" header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-5">
          <div className="flex items-center gap-3">
            <span className="status-dot" aria-hidden />
            <span className="label">{settings["hero.availability"]}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="label hidden sm:inline">EST — {settings["contact.location"].split("—")[0].trim()}</span>
            <span className="label-signal">{stats.projects.toString().padStart(2, "0")} proyek tercatat</span>
          </div>
        </div>

        {/* Positioning statement */}
        <div className="grid grid-cols-1 gap-8 pt-12 md:grid-cols-12 md:pt-16">
          <div className="md:col-span-1">
            <p className="label rotate-0 md:[writing-mode:vertical-rl] md:rotate-180">
              Positioning / 001
            </p>
          </div>

          <div className="md:col-span-11">
            <p className="label-signal mb-6">{settings["hero.kicker"]}</p>
            <h1 className="font-display text-[clamp(2.75rem,9vw,7.5rem)] font-bold leading-[0.94] tracking-[-0.02em]">
              {settings["hero.line1"]}
              <br />
              <span className="text-signal">{settings["hero.line2"]}</span>
            </h1>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
              <p className="max-w-2xl text-lg leading-relaxed text-ink-soft md:col-span-7 md:text-xl">
                {settings["hero.statement"]}
              </p>
              <div className="md:col-span-5 md:justify-self-end">
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Link
                    href="/#work"
                    className="group inline-flex items-center justify-between gap-6 bg-ink px-6 py-4 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-signal"
                  >
                    Lihat Karya Pilihan
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  <Link
                    href="/#contact"
                    className="group inline-flex items-center justify-between gap-6 border border-ink px-6 py-4 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Mulai Proyek
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom capability strip */}
        <div className="mt-16 grid grid-cols-2 gap-px border border-rule bg-rule md:mt-24 md:grid-cols-4">
          {[
            ["Website", "Perusahaan, B2B & landing"],
            ["Aplikasi bisnis", "POS, inventory, dashboard"],
            ["Integrasi", "API, pembayaran, webhook"],
            ["Sistem operasional", "Real-time & multi-outlet"],
          ].map(([title, sub]) => (
            <div key={title} className="bg-paper p-5">
              <p className="font-display text-base font-semibold">{title}</p>
              <p className="mt-1 font-mono text-[0.68rem] leading-relaxed text-ink-faint">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
