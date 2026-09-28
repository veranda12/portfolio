import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getSocialLinks } from "@/lib/queries";
import { getSettings } from "@/lib/content";
import { Boop } from "@/components/motion/Boop";

const INDEX_LINKS = [
  { href: "/#work", label: "Karya" },
  { href: "/capabilities", label: "Kapabilitas" },
  { href: "/#about", label: "Tentang" },
  { href: "/work", label: "Semua Proyek" },
];

// Sky footer: page-coloured clouds hang over a soft sky gradient, with a
// second cloud layer peeking out behind and low clouds drifting in at the
// bottom-left. All colours come from theme tokens (see globals.css).
export async function SiteFooter() {
  const [social, settings] = await Promise.all([getSocialLinks(), getSettings()]);
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-16 overflow-hidden text-[var(--footer-ink)] md:mt-24"
      style={{ background: "linear-gradient(var(--sky-top), var(--sky-bottom))" }}
    >
      <CloudCeiling />
      <LowClouds />

      {/* Mascot peeking up over a cloud at the bottom edge */}
      <Boop
        rotation={4}
        y={-8}
        className="absolute bottom-0 right-[30%] z-0 w-40 sm:w-48 md:right-[4%] md:w-64"
      >
        <Image
          src="/mascot/peek.webp"
          alt=""
          width={463}
          height={306}
          sizes="(min-width: 768px) 256px, 192px"
          className="h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_22%,black_78%,transparent)]"
        />
      </Boop>

      <div className="shell relative z-10 pb-32 pt-32 sm:pb-36 md:pb-8 md:pt-52">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand + repeated contact CTA */}
          <div className="md:col-span-6 lg:col-span-5">
            <Link
              href="/"
              className="text-[1.625rem] font-bold tracking-tight text-[var(--footer-brand)] transition-opacity duration-150 hover:opacity-80"
            >
              {settings["site.name"]}
            </Link>
            <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-[var(--footer-muted)]">
              {settings["footer.note"]}
            </p>

            <div className="mt-10">
              <p className="text-[0.9375rem] font-medium text-[var(--footer-muted)]">{settings["contact.consultation"]}</p>
              <p className="mt-1 text-[1.375rem] font-bold leading-snug tracking-[-0.01em]">
                {settings["contact.heading"]}
              </p>
              <Link href="/#contact" className="ui-btn ui-btn-primary group mt-5">
                Mulai Proyek
                <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:pt-2 lg:col-span-6 lg:col-start-7 lg:justify-items-end">
            <div>
              <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-[var(--footer-muted)]">
                Terhubung
              </p>
              <ul className="space-y-3">
                {social.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1.5 text-[0.9375rem] transition-colors duration-150 hover:text-[var(--footer-brand)]"
                    >
                      <span>
                        {s.label}
                        {s.handle ? <span className="ml-2 text-[var(--footer-muted)]">{s.handle}</span> : null}
                      </span>
                      <ArrowUpRight className="nudge-xy h-3.5 w-3.5 text-[var(--footer-muted)]" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:text-right">
              <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.05em] text-[var(--footer-muted)]">
                Indeks
              </p>
              <ul className="space-y-3 text-[0.9375rem]">
                {INDEX_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition-colors duration-150 hover:text-[var(--footer-brand)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-16 text-[0.8125rem] text-[var(--footer-muted)] md:mt-20">
          © {year} {settings["site.owner"]}. {settings["site.role"]}
        </p>
      </div>
    </footer>
  );
}

// Two layers of cloud bottoms along the top edge. The front layer uses the
// page colour so it reads as the page "hanging" into the sky.
function CloudCeiling() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-44" aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 170" preserveAspectRatio="none">
        <path
          style={{ fill: "var(--cloud-back)" }}
          d="M0 0H1440V120A110 70 0 0 1 1240 138A140 80 0 0 1 990 128A120 70 0 0 1 780 150A150 80 0 0 1 540 132A110 60 0 0 1 350 146A140 80 0 0 1 120 128A80 50 0 0 1 0 136Z"
        />
        <path
          style={{ fill: "var(--canvas)" }}
          d="M0 0H1440V88A95 60 0 0 1 1300 112A120 70 0 0 1 1110 96A150 90 0 0 1 860 118A110 60 0 0 1 690 82A140 80 0 0 1 470 104A120 70 0 0 1 270 78A130 70 0 0 1 60 96A60 40 0 0 1 0 84Z"
        />
      </svg>
    </div>
  );
}

// Soft low clouds drifting in from the bottom-left corner.
function LowClouds() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 h-40 w-[34rem] max-w-[90vw] md:h-64 md:w-[48rem]"
      viewBox="0 0 700 260"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        style={{ fill: "var(--cloud-soft)" }}
        d="M0 260V140A120 90 0 0 1 200 110A150 110 0 0 1 430 150A110 80 0 0 1 580 200A80 60 0 0 1 700 240V260Z"
      />
    </svg>
  );
}
