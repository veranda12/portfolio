import { ArrowRight, Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Section, SectionHeader } from "@/components/ui/Section";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Berapa biaya membuat website atau sistemnya?",
    a: "Tergantung scope dan kompleksitas. Setelah konsultasi, Anda menerima estimasi biaya yang transparan di dalam proposal dengan pembayaran bertahap (DP + termin) dan tanpa biaya tersembunyi.",
  },
  {
    q: "Berapa lama pengerjaannya?",
    a: "Landing/company website umumnya 1–3 minggu; aplikasi bisnis, POS, atau integrasi bisa beberapa minggu hingga bulan tergantung fitur. Timeline pasti selalu dicantumkan di proposal sebelum mulai.",
  },
  {
    q: "Setelah jadi, siapa yang mengurus dan memperbaiki?",
    a: "Tersedia dukungan setelah launch dan opsi maintenance berkelanjutan. Kode sumber, dokumentasi, dan akses diserahkan ke Anda, jadi tidak ada ketergantungan yang mengunci.",
  },
  {
    q: "Bisa integrasi dengan sistem atau aplikasi yang sudah saya pakai?",
    a: "Bisa. Saya terbiasa menghubungkan REST API, webhook, payment gateway & QRIS, WebSocket, hingga marketplace F&B (GoFood/GrabFood/ShopeeFood) dan layanan pihak ketiga lain.",
  },
  {
    q: "Apakah data dan ide bisnis saya aman?",
    a: "Ya. Saya siap menandatangani NDA, menerapkan praktik keamanan standar (autentikasi aman, hashing, backup), dan kepemilikan kode serta data ada sepenuhnya pada Anda.",
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Bertahap mengikuti milestone: DP di awal lalu termin sesuai progres, dengan invoice resmi setiap tahap.",
  },
  {
    q: "Saya di luar kota atau luar negeri, apakah bisa?",
    a: "Bisa. Saya bekerja remote dengan komunikasi rutin dan update progres yang jelas, bekerja dengan tim di mana saja.",
  },
  {
    q: "Bisa melanjutkan atau memperbaiki proyek yang sudah ada?",
    a: "Bisa. Termasuk modernisasi sistem lama, refactoring, migrasi, dan menambah fitur pada aplikasi yang sudah berjalan.",
  },
];

export function Faq() {
  return (
    <Section id="faq" tone="surface">
      <SectionHeader index="010" title="Pertanyaan Umum" note="FAQ" />

      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <ScrollReveal className="lg:sticky lg:top-24">
            <p className="max-w-xs text-body text-ink-muted">
              Masih ada yang ingin ditanyakan? Kirim pesan saya jawab dengan jujur, termasuk kalau
              ternyata saya bukan orang yang tepat untuk proyek Anda.
            </p>
            <a href="#contact" className="ui-link group mt-6">
              <span className="link-underline">Ajukan pertanyaan</span>
              <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
            </a>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-8">
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="ui-card group rounded-card bg-canvas/60 open:bg-canvas hover:bg-canvas"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-card p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-4">
                    <span className="mt-1 text-[0.8125rem] font-semibold text-accent-pink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.0625rem] font-semibold leading-snug text-ink md:text-[1.125rem]">{f.q}</span>
                  </span>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-accent-pink transition-transform duration-500 [transition-timing-function:var(--spring-snappy)] group-open:rotate-45"
                    aria-hidden
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="max-w-2xl px-5 pb-6 pl-[3.25rem] text-body text-ink-muted md:px-6 md:pl-[3.75rem]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
