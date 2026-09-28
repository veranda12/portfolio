import { Building2, Rocket, Store, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Boop } from "@/components/motion/Boop";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const AUDIENCES: { id: string; label: string; title: string; body: string; systems: string[] }[] = [
  {
    id: "RTL",
    label: "Retail & Multi-Outlet",
    title: "Kelola banyak cabang dari satu sistem",
    body: "Kasir yang cepat dipakai staf, stok akurat lintas cabang, dan laporan penjualan yang bisa dilihat kapan saja dari mana saja.",
    systems: ["POS", "Inventory", "Laporan penjualan", "Multi-outlet"],
  },
  {
    id: "FNB",
    label: "F&B, Resto & Cafe",
    title: "Operasional dapur sampai kasir yang nyambung",
    body: "POS terhubung ke kitchen display, QRIS, promo & voucher, integrasi marketplace, plus rekap kas per shift yang rapi.",
    systems: ["POS + KDS", "QRIS", "GoFood / GrabFood / ShopeeFood", "Promo & shift"],
  },
  {
    id: "B2B",
    label: "B2B & Perusahaan",
    title: "Kredibel di depan, terstruktur di belakang",
    body: "Company profile yang meyakinkan dan bisa Anda update sendiri, plus internal tool/dashboard yang menyatukan data operasional.",
    systems: ["Company website", "Dashboard internal", "Integrasi sistem", "SEO"],
  },
  {
    id: "STP",
    label: "Startup",
    title: "Dari ide ke produksi, cepat",
    body: "MVP dengan stack modern dan satu partner full-stack yang bisa menangani dari front-end sampai database dan deployment.",
    systems: ["MVP", "Next.js / Spring Boot", "REST API", "Deployment"],
  },
];

const ICONS: Record<string, LucideIcon> = { RTL: Store, FNB: UtensilsCrossed, B2B: Building2, STP: Rocket };
// Asymmetric 2×2 bento: wide/narrow, then narrow/wide.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function Audiences() {
  return (
    <Section id="audiences">
      <SectionHeader index="002" title="Untuk Siapa" note="Industri" />

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {AUDIENCES.map((a, i) => {
          const Icon = ICONS[a.id] ?? Store;
          return (
            <ScrollReveal
              boop
              key={a.id}
              className={cn("ui-card ui-card-interactive rounded-card bg-surface p-6 shadow-card md:p-8", SPANS[i % 4])}
              delay={(i % 2) * 70}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-card bg-surface-elevated">
                  <Boop trigger="parent" rotation={i % 2 ? -12 : 12}>
                    <Icon className={cn("h-5 w-5", i % 2 ? "text-accent-blue" : "text-accent-pink")} />
                  </Boop>
                </span>
                <span className="text-[0.8125rem] font-semibold text-ink-muted">{a.id}</span>
              </div>
              <p className="label-signal mt-6">{a.label}</p>
              <h3 className="mt-2 text-[1.375rem] font-bold leading-snug text-ink md:text-[1.5rem]">{a.title}</h3>
              <p className="mt-3 max-w-xl text-body text-ink-muted">{a.body}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {a.systems.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}
