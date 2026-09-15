"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { saveSocialLink, deleteSocialLink } from "@/app/admin/actions";

type Social = { id: string; label: string; url: string; handle: string; sortOrder: number };

const inputCls =
  "w-full border border-console-line bg-console-2 px-3 py-2 text-sm text-paper placeholder:text-paper/25 focus:border-signal focus:outline-none";

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
          <div key={l.id} className="flex flex-wrap items-center gap-2 border border-console-line bg-console p-3">
            <span className="font-mono text-xs text-paper">{l.label}</span>
            <span className="font-mono text-[0.66rem] text-paper/40">{l.url}</span>
            {l.handle ? <span className="font-mono text-[0.66rem] text-paper/30">{l.handle}</span> : null}
            <button
              onClick={() =>
                start(async () => {
                  await deleteSocialLink(l.id);
                  router.refresh();
                })
              }
              className="ml-auto font-mono text-[0.6rem] uppercase tracking-label text-paper/40 hover:text-red-400"
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
        className="mt-3 border border-console-line px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/70 hover:border-signal"
      >
        + Add link
      </button>
    </div>
  );
}
