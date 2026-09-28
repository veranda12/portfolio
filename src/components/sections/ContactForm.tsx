"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getDictionary, type Locale } from "@/i18n";

const SELECT_CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

export function ContactForm({ lang = "id" }: { lang?: Locale }) {
  const t = getDictionary(lang).form;
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
        if (json.fieldErrors) {
          // Show field messages in the page language (server copy as fallback).
          const localized: Record<string, string> = {};
          for (const [k, v] of Object.entries(json.fieldErrors as Record<string, string>)) {
            localized[k] = t.fieldErrors[k] ?? v;
          }
          setErrors(localized);
        }
        setMessage(json.fieldErrors ? t.errorCheck : t.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setMessage(t.errorNetwork);
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
          <p className="label-signal">{t.sentEyebrow}</p>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-ink">{t.sentTitle}</h3>
        <p className="mt-3 max-w-md text-ink-muted">{t.sentBody}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ui-link group mt-6 text-sm"
        >
          <span className="link-underline">{t.sendAgain}</span>
          <ArrowRight className="nudge-x h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate>
      <Field label={t.name} name="name" error={errors.name} required />
      <Field label={t.company} name="company" error={errors.company} placeholder={t.optional} />
      <Field label={t.email} name="email" type="email" error={errors.email} required className="sm:col-span-2" />

      <Select label={t.projectType} name="projectType" options={t.projectTypes} placeholder={t.choose} />
      <Select label={t.budget} name="budgetRange" options={t.budgets} placeholder={t.choose} />

      <div className="sm:col-span-2">
        <FieldLabel>{t.message}</FieldLabel>
        <textarea
          name="message"
          rows={5}
          required
          placeholder={t.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          className="ui-input resize-none"
        />
        {errors.message ? <p className="mt-1.5 text-[0.8125rem] text-accent-pink">{errors.message}</p> : null}
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[0.8125rem] leading-relaxed text-ink-muted">{t.note}</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="ui-btn ui-btn-primary group"
        >
          {status === "sending" ? t.sending : t.send}
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

function Select({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder: string;
}) {
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
          {placeholder}
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
