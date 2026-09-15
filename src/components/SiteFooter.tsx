import Link from "next/link";
import { getSocialLinks } from "@/lib/queries";
import { getSettings } from "@/lib/content";

export async function SiteFooter() {
  const [social, settings] = await Promise.all([getSocialLinks(), getSettings()]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper">
      <div className="shell grid grid-cols-1 gap-10 py-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="label">[ Studio ]</p>
          <p className="mt-4 max-w-md font-display text-2xl leading-snug">
            {settings["contact.heading"]}
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-signal link-underline"
          >
            Mulai Proyek →
          </Link>
        </div>

        <div className="md:col-span-3">
          <p className="label mb-4">Terhubung</p>
          <ul className="space-y-2">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-sm text-ink-soft hover:text-ink"
                >
                  {s.label}
                  {s.handle ? <span className="ml-2 text-ink-faint">{s.handle}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="label mb-4">Indeks</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href="/#work" className="link-underline hover:text-ink">Karya</Link></li>
            <li><Link href="/#services" className="link-underline hover:text-ink">Yang Saya Bangun</Link></li>
            <li><Link href="/#about" className="link-underline hover:text-ink">Tentang</Link></li>
            <li><Link href="/work" className="link-underline hover:text-ink">Semua Proyek</Link></li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-rule py-6 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
        <p className="font-mono">© {year} — {settings["site.role"]}</p>
        <p className="max-w-lg font-mono leading-relaxed">{settings["footer.note"]}</p>
      </div>
    </footer>
  );
}
