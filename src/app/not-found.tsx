import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="theme-site flex min-h-screen items-center">
      <div className="shell grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
        <span className="inline-flex rounded-button bg-surface-elevated px-2.5 py-1 text-[0.8125rem] font-semibold uppercase text-accent-pink">
          Error / 404
        </span>
        <h1 className="mt-5 text-hero-sm text-ink md:text-[5rem] md:leading-[1.05] md:tracking-[-0.02em]">
          Tidak ditemukan.
        </h1>
        <p className="mt-5 max-w-md text-body text-ink-muted">
          Halaman ini tidak ada, atau proyeknya sedang tidak dipublikasikan.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/" className="ui-btn ui-btn-primary group">
            <ArrowLeft className="nudge-back h-4 w-4" strokeWidth={2.25} aria-hidden />
            Beranda
          </Link>
          <Link href="/work" className="ui-btn ui-btn-secondary group">
            Lihat Karya
            <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
          </Link>
        </div>
        </div>
        {/* Mascot, mirrored so it waves and points back at the buttons */}
        <div className="hidden md:col-span-4 md:block">
          <Image
            src="/mascot/wave.webp"
            alt=""
            width={411}
            height={573}
            sizes="280px"
            className="mx-auto h-auto w-full max-w-[17rem] -scale-x-100"
          />
        </div>
      </div>
    </div>
  );
}
