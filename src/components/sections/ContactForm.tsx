"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const PROJECT_TYPES = [
  "Website perusahaan",
  "Aplikasi bisnis / internal tool",
  "POS / sistem operasional",
  "Integrasi API / sistem",
  "Integrasi pembayaran",
  "Modernisasi sistem",
  "Belum yakin",
];

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

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
      <div className="relative overflow-hidden rounded-card bg-surface p-8 pr-36 md:p-10 md:pr-44">
        <Image
          src="/mascot/wave.webp"
          alt=""
          width={411}
          height={573}
          sizes="144px"
          className="absolute -bottom-2 right-2 h-auto w-28 md:right-4 md:w-36"
        />
        <div className="flex items-center gap-3">
          <span className="status-dot" aria-hidden />
          <p className="label-signal">Pesan diterima</p>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-ink">Terima kasih, saya akan menghubungi Anda.</h3>
        <p className="mt-3 max-w-md text-ink-muted">
          Pesan Anda sudah masuk. Saya baca sendiri satu per satu, dan biasanya balas dalam satu
          atau dua hari kerja.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ui-link group mt-6 text-sm"
        >
          <span className="link-underline">Kirim lagi</span>
          <ArrowRight className="nudge-x h-4 w-4" aria-hidden />
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
          aria-invalid={errors.message ? true : undefined}
          className="ui-input resize-none"
        />
        {errors.message ? <p className="mt-1.5 text-[0.8125rem] text-accent-pink">{errors.message}</p> : null}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.8125rem] leading-relaxed text-ink-muted">
          Tanpa spam, tanpa sales funnel. Langsung masuk ke inbox saya.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="ui-btn ui-btn-primary group"
        >
          {status === "sending" ? "Mengirim…" : "Kirim Pesan"}
          <ArrowRight className="nudge-x h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      {status === "error" && message ? (
        <p role="alert" className="text-[0.875rem] text-accent-pink sm:col-span-2">{message}</p>
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
        {label} {required ? <span className="text-accent-pink">*</span> : null}
      </FieldLabel>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        className="ui-input"
      />
      {error ? <p className="mt-1.5 text-[0.8125rem] text-accent-pink">{error}</p> : null}
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
        className="ui-input appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
        style={{ backgroundImage: SELECT_CHEVRON }}
      >
        <option value="" disabled>
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
