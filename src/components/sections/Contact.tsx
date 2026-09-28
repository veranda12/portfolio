import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ContactForm } from "./ContactForm";
import { waLink } from "@/lib/whatsapp";
import { getDictionary, type Locale } from "@/i18n";


function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

export function Contact({ settings, lang }: { settings: Record<string, string>; lang: Locale }) {
  const t = getDictionary(lang).contact;
  const BADGES = t.badges;
  const wa = waLink(settings["contact.whatsapp"], settings["contact.whatsappText"]);

  const rows: [string, React.ReactNode][] = [
    [
      t.direct,
      <a key="mail" href={`mailto:${settings["contact.email"]}`} className="link-underline text-ink hover:text-accent-pink">
        {settings["contact.email"]}
      </a>,
    ],
    [t.contact, settings["site.owner"]],
    [t.location, settings["contact.location"]],
    [t.response, t.responseValue],
  ];

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="shell section-y">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <ScrollReveal className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="status-dot" aria-hidden />
              <span className="label-signal">{t.eyebrow}</span>
            </div>
            <h2 className="mt-5 text-section-sm text-ink md:text-[3rem] md:leading-[1.05] md:tracking-[-0.02em]">
              {settings["contact.heading"]}
            </h2>
            <p className="mt-5 max-w-md text-body text-ink-muted">{settings["contact.body"]}</p>

            {/* Free consultation + WhatsApp */}
            <div className="mt-8">
              <p className="flex items-center gap-2 text-[0.8125rem] text-accent-blue">
                <span className="status-dot bg-accent-blue" aria-hidden />
                {settings["contact.consultation"]}
              </p>
              {wa ? (
                <a href={wa} target="_blank" rel="noreferrer noopener" className="ui-btn ui-btn-secondary group mt-4">
                  <WhatsAppGlyph className="h-4 w-4 text-[#25D366]" />
                  {t.whatsapp}
                  <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
                </a>
              ) : null}
            </div>

            <dl className="mt-10 divide-y divide-line rounded-card bg-surface px-5 shadow-card">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                  <dt className="label">{k}</dt>
                  <dd className="text-right text-[0.9375rem] text-ink-muted">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Trust badges */}
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {BADGES.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-button bg-surface-elevated px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink"
                >
                  <Check className="h-3.5 w-3.5 text-accent-pink" strokeWidth={3} aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-7" delay={80}>
            <div className="rounded-panel bg-panel p-6 shadow-lift md:p-10">
              <ContactForm lang={lang} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
