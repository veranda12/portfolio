import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Section, SectionHeader } from "@/components/ui/Section";

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
    <Section>
      <SectionHeader index="004" title="Bagaimana Sistem Ini Terhubung" note="Skema unggulan" />
      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-12 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal className="lg:col-span-5">
          <p className="label-signal">{title}</p>
          <p className="mt-4 text-body text-ink-muted">
            Software bisnis itu intinya soal koneksi, antara lantai toko, database, penyedia
            pembayaran, sampai orang-orang yang menjalankan operasional sehari-hari. Contohnya ada
            di proyek ini: POS yang mengatur penjualan, inventory, dan perangkat di lapangan, lalu
            terhubung ke layanan pusat yang menangani pembayaran, integrasi, dan pesan real-time.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Satu sumber kebenaran di PostgreSQL",
              "Sinkronisasi perangkat real-time lewat WebSocket",
              "Event pembayaran dibuat idempotent & terverifikasi",
              "Reporting dipisah dari jalur penjualan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-elevated" aria-hidden>
                  <Check className="h-3 w-3 text-accent-pink" strokeWidth={3} />
                </span>
                <span className="text-[0.9375rem] text-ink">{item}</span>
              </li>
            ))}
          </ul>
          <Link href={`/work/${slug}`} className="ui-link group mt-8">
            <span className="link-underline">Baca Case Study Engineering-nya</span>
            <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
          </Link>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-7" delay={80}>
          <ArchitectureDiagram text={architectureText} />
        </ScrollReveal>
      </div>
    </Section>
  );
}
