"use client";

import { useFormStatus } from "react-dom";

export function SaveSettingsButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-signal px-6 py-3 font-mono text-[0.66rem] uppercase tracking-label text-paper shadow-lg hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save all content"}
    </button>
  );
}
