import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "./ContactForm";

export function Contact({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="shell py-16 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <ScrollReveal className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="status-dot" aria-hidden />
              <span className="label-signal">[ 007 ] — Mulai Proyek</span>
            </div>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[0.98] tracking-tight md:text-6xl">
              {settings["contact.heading"]}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              {settings["contact.body"]}
            </p>

            <dl className="mt-10 space-y-5 border-t border-rule pt-8">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="label">Langsung</dt>
                <dd>
                  <a href={`mailto:${settings["contact.email"]}`} className="link-underline font-mono text-sm text-ink">
                    {settings["contact.email"]}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="label">Lokasi</dt>
                <dd className="font-mono text-sm text-ink-soft">{settings["contact.location"]}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="label">Respons</dt>
                <dd className="font-mono text-sm text-ink-soft">1–2 hari kerja</dd>
              </div>
            </dl>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-7" delay={100}>
            <div className="border border-rule bg-paper-dim/40 p-6 md:p-10">
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
