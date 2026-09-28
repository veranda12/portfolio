"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { saveSocialLink, deleteSocialLink } from "@/app/admin/actions";

type Social = { id: string; label: string; url: string; handle: string; sortOrder: number };

const inputCls =
  "w-full border border-rule bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none";

export function SocialLinksManager({ links }: { links: Social[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [draft, setDraft] = useState({ label: "", url: "", handle: "" });

  function add() {
    if (!draft.label || !draft.url) return;
    const fd = new FormData();
    fd.set("label", draft.label);
    fd.set("url", draft.url);
    fd.set("handle", draft.handle);
    fd.set("sortOrder", String(links.length));
    start(async () => {
      await saveSocialLink(fd);
      setDraft({ label: "", url: "", handle: "" });
      router.refresh();
    });
  }

  return (
    <div className={cn(pending && "opacity-70")}>
      <div className="space-y-2">
        {links.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center gap-2 border border-rule bg-white p-3">
            <span className="font-mono text-xs text-ink">{l.label}</span>
            <span className="font-mono text-[0.66rem] text-ink-faint">{l.url}</span>
            {l.handle ? <span className="font-mono text-[0.66rem] text-ink-faint">{l.handle}</span> : null}
            <button
              onClick={() =>
                start(async () => {
                  await deleteSocialLink(l.id);
                  router.refresh();
                })
              }
              className="ml-auto font-mono text-[0.6rem] uppercase tracking-label text-ink-faint hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Label (GitHub)" className={inputCls} />
        <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://…" className={inputCls} />
        <input value={draft.handle} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} placeholder="@handle (optional)" className={inputCls} />
      </div>
      <button
        onClick={add}
        className="mt-3 border border-rule px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-ink-soft hover:border-signal"
      >
        + Add link
      </button>
    </div>
  );
}
