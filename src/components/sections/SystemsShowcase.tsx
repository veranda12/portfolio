import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { SectionHeader } from "@/components/sections/SelectedWork";

// Home-page architecture teaser built from the flagship project's schematic.
export function SystemsShowcase({
  architectureText,
  slug,
  title,
}: {
  architectureText: string;
  slug: string;
  title: string;
}) {
  if (!architectureText) return null;

  return (
    <section className="border-b border-rule bg-paper-dim/40">
      <div className="shell py-16 md:py-24">
        <SectionHeader index="003" title="Bagaimana Sistemnya Terhubung" note="Skema unggulan" />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
          <ScrollReveal className="md:col-span-5">
            <p className="label-signal">{title}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Software bisnis nyata sebagian besar soal koneksi — antara lantai toko, database,
              penyedia pembayaran, dan orang-orang yang menjalankan operasional. Inilah bentuk build
              unggulannya: sebuah POS yang mengoordinasikan penjualan, inventory, dan perangkat,
              berkomunikasi dengan central services yang menangani pembayaran, integrasi, dan pesan
              real-time.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Satu sumber kebenaran di PostgreSQL",
                "Sinkronisasi perangkat real-time lewat WebSocket",
                "Event pembayaran dibuat idempotent & terverifikasi",
                "Reporting dipisah dari jalur penjualan",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden />
                  <span className="text-sm text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/work/${slug}`}
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-signal"
            >
              <span className="link-underline">Baca Case Study Engineering-nya</span>
              <span>→</span>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="md:col-span-7" delay={100}>
            <ArchitectureDiagram text={architectureText} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
