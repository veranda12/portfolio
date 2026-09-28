"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/validators";
import { saveService, deleteService } from "@/app/admin/actions";

type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  deliverables: string;
  sortOrder: number;
  published: boolean;
};

const empty: Service = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  deliverables: "",
  sortOrder: 0,
  published: true,
};

const inputCls =
  "w-full border border-rule bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none";

export function ServiceManager({ services }: { services: Service[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="mt-6 space-y-4">
      {services.map((s) => (
        <ServiceForm key={s.id} initial={s} />
      ))}

      {creating ? (
        <ServiceForm initial={{ ...empty, sortOrder: services.length }} onDone={() => setCreating(false)} isNew />
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="border border-rule px-4 py-3 font-mono text-[0.66rem] uppercase tracking-label text-ink-soft hover:border-signal"
        >
          + Add service
        </button>
      )}
    </div>
  );
}

function ServiceForm({
  initial,
  isNew = false,
  onDone,
}: {
  initial: Service;
  isNew?: boolean;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function save() {
    setMsg(null);
    start(async () => {
      const res = await saveService(isNew ? null : s.id, {
        title: s.title,
        slug: s.slug || slugify(s.title),
        summary: s.summary,
        detail: "",
        deliverables: s.deliverables,
        sortOrder: s.sortOrder,
        published: s.published,
      } as never);
      if (!res.ok) {
        setMsg({ ok: false, text: res.error || "Save failed" });
        return;
      }
      setMsg({ ok: true, text: "Saved" });
      router.refresh();
      if (isNew && onDone) onDone();
    });
  }

  function remove() {
    if (!confirm("Delete this service?")) return;
    start(async () => {
      await deleteService(s.id);
      router.refresh();
    });
  }

  return (
    <div className={cn("border border-rule bg-white p-4", pending && "opacity-60")}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={s.title}
          onChange={(e) =>
            setS((v) => ({ ...v, title: e.target.value, slug: slugTouched ? v.slug : slugify(e.target.value) }))
          }
          placeholder="Service title"
          className={inputCls}
        />
        <input
          value={s.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setS((v) => ({ ...v, slug: slugify(e.target.value) }));
          }}
          placeholder="slug"
          className={inputCls}
        />
      </div>
      <textarea
        value={s.summary}
        onChange={(e) => setS((v) => ({ ...v, summary: e.target.value }))}
        rows={2}
        placeholder="Summary"
        className={cn(inputCls, "mt-3 resize-y")}
      />
      <textarea
        value={s.deliverables}
        onChange={(e) => setS((v) => ({ ...v, deliverables: e.target.value }))}
        rows={3}
        placeholder="Deliverables — one per line"
        className={cn(inputCls, "mt-3 resize-y font-mono text-xs")}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="number"
          value={s.sortOrder}
          onChange={(e) => setS((v) => ({ ...v, sortOrder: Number(e.target.value) || 0 }))}
          className={cn(inputCls, "w-24")}
          title="Sort order"
        />
        <button
          onClick={() => setS((v) => ({ ...v, published: !v.published }))}
          className={cn(
            "px-3 py-2 font-mono text-[0.6rem] uppercase tracking-label",
            s.published ? "bg-signal/15 text-signal" : "bg-surface-2 text-ink-faint"
          )}
        >
          {s.published ? "Published" : "Hidden"}
        </button>
        {msg ? (
          <span className={cn("font-mono text-[0.62rem]", msg.ok ? "text-signal" : "text-red-600")}>{msg.text}</span>
        ) : null}
        <div className="ml-auto flex gap-2">
          <button
            onClick={save}
            disabled={pending}
            className="bg-signal px-4 py-2 font-mono text-[0.6rem] uppercase tracking-label text-white hover:opacity-90"
          >
            Save
          </button>
          {isNew ? (
            <button onClick={onDone} className="px-3 py-2 font-mono text-[0.6rem] uppercase tracking-label text-ink-faint hover:text-ink">
              Cancel
            </button>
          ) : (
            <button onClick={remove} className="px-3 py-2 font-mono text-[0.6rem] uppercase tracking-label text-ink-faint hover:text-red-600">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
