import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center">
      <div className="shell">
        <p className="label-signal">Error / 404</p>
        <h1 className="mt-4 font-display text-6xl font-semibold tracking-tight md:text-8xl">
          Tidak ditemukan.
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink-soft">
          Halaman ini tidak ada — atau proyeknya sedang tidak dipublikasikan.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-ink px-6 py-4 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-signal"
          >
            ← Beranda
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border border-ink px-6 py-4 font-mono text-xs uppercase tracking-label transition-colors hover:bg-ink hover:text-paper"
          >
            Lihat Karya →
          </Link>
        </div>
      </div>
    </div>
  );
}
