"use client";

import { useTransition } from "react";
import { cn } from "@/lib/cn";
import { setMessageStatus, deleteMessage } from "@/app/admin/actions";

type Message = {
  id: string;
  name: string;
  company: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: string;
  createdAt: Date;
};

export function MessageCard({ m }: { m: Message }) {
  const [pending, start] = useTransition();
  const date = new Date(m.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "border bg-white p-5 transition-colors",
        m.status === "unread" ? "border-signal/40" : "border-rule",
        pending && "opacity-60"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {m.status === "unread" ? <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden /> : null}
            <h3 className="font-display text-lg font-bold text-ink">{m.name}</h3>
            {m.company ? <span className="font-mono text-[0.66rem] text-ink-faint">· {m.company}</span> : null}
          </div>
          <a href={`mailto:${m.email}`} className="font-mono text-xs text-signal hover:underline">
            {m.email}
          </a>
        </div>
        <span className="font-mono text-[0.62rem] uppercase tracking-label text-ink-faint">{date}</span>
      </div>

      {(m.projectType || m.budgetRange) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {m.projectType ? (
            <span className="bg-surface-2 px-2 py-1 font-mono text-[0.6rem] text-ink-soft">{m.projectType}</span>
          ) : null}
          {m.budgetRange ? (
            <span className="bg-surface-2 px-2 py-1 font-mono text-[0.6rem] text-ink-soft">{m.budgetRange}</span>
          ) : null}
        </div>
      )}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{m.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-3">
        {m.status !== "read" ? (
          <Action onClick={() => start(() => setMessageStatus(m.id, "read"))}>Mark read</Action>
        ) : (
          <Action onClick={() => start(() => setMessageStatus(m.id, "unread"))}>Mark unread</Action>
        )}
        {m.status !== "archived" ? (
          <Action onClick={() => start(() => setMessageStatus(m.id, "archived"))}>Archive</Action>
        ) : (
          <Action onClick={() => start(() => setMessageStatus(m.id, "read"))}>Unarchive</Action>
        )}
        <a
          href={`mailto:${m.email}?subject=Re: your project enquiry`}
          className="border border-rule px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-label text-ink-soft hover:border-signal hover:text-ink"
        >
          Reply
        </a>
        <button
          onClick={() => {
            if (confirm("Delete this message permanently?")) start(() => deleteMessage(m.id));
          }}
          className="ml-auto font-mono text-[0.6rem] uppercase tracking-label text-ink-faint hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Action({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="border border-rule px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-label text-ink-soft hover:border-signal hover:text-ink"
    >
      {children}
    </button>
  );
}
