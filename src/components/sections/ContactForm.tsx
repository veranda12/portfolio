"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const PROJECT_TYPES = [
  "Website perusahaan",
  "Aplikasi bisnis / internal tool",
  "POS / sistem operasional",
  "Integrasi API / sistem",
  "Integrasi pembayaran",
  "Modernisasi sistem",
  "Belum yakin",
];

const BUDGETS = ["< Rp15 jt", "Rp15 – 50 jt", "Rp50 – 150 jt", "> Rp150 jt", "Diskusikan dulu"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        setMessage(json.error || "Terjadi kesalahan. Silakan coba lagi.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setMessage("Gangguan jaringan. Silakan coba lagi.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-signal bg-paper p-8 md:p-10">
        <div className="flex items-center gap-3">
          <span className="status-dot" aria-hidden />
          <p className="label-signal">Pesan diterima</p>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold">Terima kasih — saya akan menghubungi Anda.</h3>
        <p className="mt-3 max-w-md text-ink-soft">
          Pesan Anda sudah tercatat. Saya membaca setiap pesan secara pribadi dan biasanya membalas
          dalam satu atau dua hari dengan langkah tindak lanjut yang jujur.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-mono text-xs uppercase tracking-label text-signal link-underline"
        >
          Kirim lagi →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <Field label="Nama" name="name" error={errors.name} required />
      <Field label="Perusahaan" name="company" error={errors.company} placeholder="Opsional" />
      <Field label="Email" name="email" type="email" error={errors.email} required className="sm:col-span-2" />

      <Select label="Jenis proyek" name="projectType" options={PROJECT_TYPES} />
      <Select label="Kisaran budget" name="budgetRange" options={BUDGETS} />

      <div className="sm:col-span-2">
        <FieldLabel>Pesan</FieldLabel>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Apa yang perlu dilakukan software untuk bisnis Anda?"
          className={cn(
            "w-full resize-none border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-0",
            errors.message ? "border-signal" : "border-rule-strong focus:border-ink"
          )}
        />
        {errors.message ? <p className="mt-1.5 font-mono text-[0.68rem] text-signal">{errors.message}</p> : null}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs font-mono text-[0.66rem] leading-relaxed text-ink-faint">
          Tanpa spam, tanpa sales funnel. Langsung masuk ke inbox saya.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-signal disabled:opacity-60"
        >
          {status === "sending" ? "Mengirim…" : "Mari Bangun Sesuatu"}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      {status === "error" && message ? (
        <p className="sm:col-span-2 font-mono text-xs text-signal">{message}</p>
      ) : null}
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="label mb-2 block">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>
        {label} {required ? <span className="text-signal">*</span> : null}
      </FieldLabel>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={cn(
          "w-full border bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none",
          error ? "border-signal" : "border-rule-strong focus:border-ink"
        )}
      />
      {error ? <p className="mt-1.5 font-mono text-[0.68rem] text-signal">{error}</p> : null}
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select
        name={name}
        defaultValue=""
        className="w-full border border-rule-strong bg-transparent px-4 py-3 text-sm text-ink focus:border-ink focus:outline-none"
      >
        <option value="" disabled className="text-ink-faint">
          Pilih…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
