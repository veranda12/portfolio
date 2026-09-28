"use client";

import { useState } from "react";
import Image from "next/image";

export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

// Single-image field with upload + preview + clear.
export function ImageUploader({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block font-mono text-[0.66rem] uppercase tracking-label text-ink-soft">
        {label}
      </label>
      <div className="flex items-start gap-4">
        <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden border border-rule bg-surface-2">
          {value ? (
            <Image src={value} alt={label} fill className="object-cover" sizes="128px" />
          ) : (
            <span className="font-mono text-[0.6rem] text-ink-faint">no image</span>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => handle(e.target.files?.[0])}
            className="block w-full font-mono text-[0.66rem] text-ink-soft file:mr-3 file:border file:border-rule file:bg-surface-2 file:px-3 file:py-1.5 file:font-mono file:text-[0.6rem] file:uppercase file:tracking-label file:text-ink-soft"
          />
          {hint ? <p className="mt-1.5 font-mono text-[0.6rem] text-ink-faint">{hint}</p> : null}
          {busy ? <p className="mt-1.5 font-mono text-[0.6rem] text-signal">Uploading…</p> : null}
          {error ? <p className="mt-1.5 font-mono text-[0.6rem] text-signal">{error}</p> : null}
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-2 font-mono text-[0.6rem] uppercase tracking-label text-ink-faint hover:text-signal"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
