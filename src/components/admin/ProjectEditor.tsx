"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { slugify, LAYOUTS } from "@/lib/validators";
import { saveProject, deleteProject } from "@/app/admin/actions";
import { ImageUploader, uploadFile } from "./ImageUploader";

export type EditorImage = { url: string; alt: string; kind: "gallery" | "featured" | "architecture" };
export type EditorCapability = { title: string; detail: string };

export type EditorState = {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  projectType: string;
  year: number;
  clientType: string;
  role: string;
  businessProblem: string;
  solution: string;
  technicalChallenges: string;
  technicalDecisions: string;
  outcome: string;
  caseStudyContent: string;
  architectureText: string;
  featuredImage: string | null;
  architectureImage: string | null;
  demoUrl: string;
  githubUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string | null;
  layout: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  technologies: string[];
  capabilities: EditorCapability[];
  images: EditorImage[];
};

const TABS = ["Basic", "Content", "Technology", "Media", "Architecture", "SEO", "Publishing"] as const;
type Tab = (typeof TABS)[number];

export function ProjectEditor({
  projectId,
  initial,
  allTechnologies,
}: {
  projectId: string | null;
  initial: EditorState;
  allTechnologies: string[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Basic");
  const [state, setState] = useState<EditorState>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  function set<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function onTitle(value: string) {
    setState((s) => ({
      ...s,
      title: value,
      slug: slugTouched ? s.slug : slugify(value),
    }));
  }

  async function persist(
    overrides?: Partial<EditorState>
  ): Promise<{ ok: boolean; error?: string; id?: string; slug?: string }> {
    const payload = { ...state, ...overrides };
    const input = {
      ...payload,
      demoUrl: payload.demoUrl || "",
      githubUrl: payload.githubUrl || "",
      images: payload.featuredImage
        ? [
            { url: payload.featuredImage, alt: payload.title, kind: "featured" as const },
            ...payload.images,
          ]
        : payload.images,
    };
    // featuredImage is stored on the project scalar; images list holds gallery/architecture.
    const galleryOnly = payload.images.filter((im) => im.kind === "gallery");
    const res = await saveProject(projectId, {
      ...input,
      images: galleryOnly,
    } as never);
    return res;
  }

  function save(publishOverride?: boolean) {
    setFeedback(null);
    start(async () => {
      const overrides =
        publishOverride === undefined ? undefined : { published: publishOverride };
      if (overrides) set("published", overrides.published!);
      const res = await persist(overrides);
      if (!res.ok) {
        setFeedback({ kind: "err", msg: res.error || "Save failed" });
        return;
      }
      setFeedback({ kind: "ok", msg: "Saved." });
      if (!projectId && res.id) {
        router.replace(`/admin/projects/${res.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    });
  }

  async function preview() {
    start(async () => {
      const res = await persist();
      if (!res.ok || !res.id) {
        setFeedback({ kind: "err", msg: res.error || "Save before preview failed" });
        return;
      }
      window.open(`/admin/projects/${res.id}/preview`, "_blank");
      if (!projectId) router.replace(`/admin/projects/${res.id}`);
    });
  }

  function remove() {
    if (!projectId) return;
    if (!confirm("Delete this project permanently? This cannot be undone.")) return;
    start(async () => {
      await deleteProject(projectId);
    });
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-console-line pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/projects")}
            className="font-mono text-[0.62rem] uppercase tracking-label text-paper/40 hover:text-signal"
          >
            ← Projects
          </button>
          <h1 className="mt-2 font-display text-2xl font-bold">
            {projectId ? "Edit project" : "New project"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-2 py-1 font-mono text-[0.6rem] uppercase tracking-label",
              state.published ? "bg-signal/15 text-signal" : "bg-console-2 text-paper/50"
            )}
          >
            {state.published ? "Published" : "Draft"}
          </span>
          {state.featured ? (
            <span className="bg-paper/15 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-label text-paper">
              ★ Featured
            </span>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex flex-wrap gap-1 border-b border-console-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-3 py-2 font-mono text-[0.66rem] uppercase tracking-label transition-colors",
              tab === t
                ? "border-signal text-paper"
                : "border-transparent text-paper/40 hover:text-paper/80"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="mt-6 space-y-5">
        {tab === "Basic" && (
          <>
            <Text label="Title *" value={state.title} onChange={onTitle} />
            <Text
              label="Slug *"
              value={state.slug}
              onChange={(v) => {
                setSlugTouched(true);
                set("slug", slugify(v));
              }}
              hint="URL path — /work/your-slug"
            />
            <Text
              label="Short description *"
              value={state.shortDescription}
              onChange={(v) => set("shortDescription", v)}
              hint="One or two sentences shown on cards and listings."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Text label="Category *" value={state.category} onChange={(v) => set("category", v)} hint="e.g. Business Application" />
              <Text label="Project type *" value={state.projectType} onChange={(v) => set("projectType", v)} hint="e.g. POS System" />
              <Text label="Year *" value={String(state.year)} onChange={(v) => set("year", Number(v) || state.year)} type="number" />
              <Text label="Client type *" value={state.clientType} onChange={(v) => set("clientType", v)} hint="e.g. Confidential" />
              <Text label="Role" value={state.role} onChange={(v) => set("role", v)} />
              <Select label="Card layout" value={state.layout} onChange={(v) => set("layout", v)} options={[...LAYOUTS]} />
            </div>
          </>
        )}

        {tab === "Content" && (
          <>
            <Area label="Full description" value={state.fullDescription} onChange={(v) => set("fullDescription", v)} hint="Intro paragraph on the case study." />
            <Area label="Business problem" value={state.businessProblem} onChange={(v) => set("businessProblem", v)} />
            <Area label="Solution" value={state.solution} onChange={(v) => set("solution", v)} />
            <Area label="Technical challenges" value={state.technicalChallenges} onChange={(v) => set("technicalChallenges", v)} />
            <Area label="Technical decisions" value={state.technicalDecisions} onChange={(v) => set("technicalDecisions", v)} />
            <Area label="Outcome" value={state.outcome} onChange={(v) => set("outcome", v)} />
            <Area label="Additional notes" value={state.caseStudyContent} onChange={(v) => set("caseStudyContent", v)} hint="Optional extra case-study prose." />
          </>
        )}

        {tab === "Technology" && (
          <>
            <TechPicker
              selected={state.technologies}
              all={allTechnologies}
              onChange={(techs) => set("technologies", techs)}
            />
            <CapabilityEditor value={state.capabilities} onChange={(c) => set("capabilities", c)} />
          </>
        )}

        {tab === "Media" && (
          <>
            <ImageUploader
              label="Featured image"
              value={state.featuredImage}
              onChange={(url) => set("featuredImage", url)}
              hint="Cover image for cards and the case-study header. If empty, a designed plate is shown."
            />
            <GalleryEditor
              images={state.images}
              onChange={(imgs) => set("images", imgs)}
            />
            <Text label="Demo URL" value={state.demoUrl} onChange={(v) => set("demoUrl", v)} hint="Optional — https://" />
            <Text label="GitHub URL" value={state.githubUrl} onChange={(v) => set("githubUrl", v)} hint="Optional — https://" />
          </>
        )}

        {tab === "Architecture" && (
          <>
            <Area
              label="Architecture diagram (text)"
              value={state.architectureText}
              onChange={(v) => set("architectureText", v)}
              rows={12}
              mono
              hint="Monospace tree/flow. Arrows (│ ├ └ ▼ →) are highlighted automatically."
            />
            <ImageUploader
              label="Architecture image"
              value={state.architectureImage}
              onChange={(url) => set("architectureImage", url)}
              hint="Optional rendered diagram, shown below the text schematic."
            />
          </>
        )}

        {tab === "SEO" && (
          <>
            <Text label="SEO title" value={state.seoTitle} onChange={(v) => set("seoTitle", v)} hint="Falls back to the project title." />
            <Area label="SEO description" value={state.seoDescription} onChange={(v) => set("seoDescription", v)} rows={3} hint="Falls back to the short description." />
            <ImageUploader label="Open Graph image" value={state.ogImage} onChange={(url) => set("ogImage", url)} hint="Falls back to the featured image." />
          </>
        )}

        {tab === "Publishing" && (
          <>
            <Toggle label="Published" desc="Visible on the public site." value={state.published} onChange={(v) => set("published", v)} />
            <Toggle label="Featured" desc="Highlighted in the featured selection." value={state.featured} onChange={(v) => set("featured", v)} />
            <Text label="Sort order" value={String(state.sortOrder)} onChange={(v) => set("sortOrder", Number(v) || 0)} type="number" hint="Lower numbers appear first." />
          </>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-console-line bg-console/95 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-5 py-3 md:px-10">
          {feedback ? (
            <span className={cn("mr-auto font-mono text-xs", feedback.kind === "ok" ? "text-signal" : "text-red-400")}>
              {feedback.msg}
            </span>
          ) : (
            <span className="mr-auto font-mono text-[0.62rem] text-paper/30">
              {projectId ? `ID ${projectId.slice(0, 8)}…` : "Unsaved new project"}
            </span>
          )}

          <button
            onClick={() => save(false)}
            disabled={pending}
            className="border border-console-line px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/80 hover:border-paper/50 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={preview}
            disabled={pending}
            className="border border-console-line px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/80 hover:border-paper/50 disabled:opacity-50"
          >
            Preview
          </button>
          {state.published ? (
            <button
              onClick={() => save(false)}
              disabled={pending}
              className="border border-paper/30 px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper hover:bg-console-2 disabled:opacity-50"
            >
              Unpublish
            </button>
          ) : null}
          <button
            onClick={() => save(true)}
            disabled={pending}
            className="bg-signal px-5 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Working…" : state.published ? "Update" : "Publish"}
          </button>
          {projectId ? (
            <button
              onClick={remove}
              disabled={pending}
              className="px-3 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/40 hover:text-red-400 disabled:opacity-50"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---- field primitives --------------------------------------------------- */

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <label className="block font-mono text-[0.66rem] uppercase tracking-label text-paper/60">{children}</label>
      {hint ? <p className="mt-1 font-mono text-[0.6rem] text-paper/30">{hint}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full border border-console-line bg-console-2 px-3 py-2.5 text-sm text-paper placeholder:text-paper/25 focus:border-signal focus:outline-none";

function Text({
  label,
  value,
  onChange,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  hint,
  rows = 5,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, "resize-y leading-relaxed", mono && "font-mono text-xs")}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between border border-console-line bg-console-2 px-4 py-3 text-left"
    >
      <span>
        <span className="block font-mono text-xs uppercase tracking-label text-paper">{label}</span>
        <span className="mt-0.5 block font-mono text-[0.6rem] text-paper/40">{desc}</span>
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          value ? "bg-signal" : "bg-console-line"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-transform",
            value ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

function TechPicker({
  selected,
  all,
  onChange,
}: {
  selected: string[];
  all: string[];
  onChange: (v: string[]) => void;
}) {
  const [custom, setCustom] = useState("");
  const available = useMemo(() => all.filter((t) => !selected.includes(t)), [all, selected]);

  function add(name: string) {
    const n = name.trim();
    if (!n || selected.includes(n)) return;
    onChange([...selected, n]);
  }

  return (
    <div>
      <FieldLabel hint="Click to add. New technologies are created automatically and grouped as Application (recategorize in Site content later).">
        Technologies
      </FieldLabel>
      <div className="min-h-[3rem] flex flex-wrap gap-2 border border-console-line bg-console-2 p-3">
        {selected.length === 0 ? (
          <span className="font-mono text-[0.66rem] text-paper/30">None selected</span>
        ) : null}
        {selected.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(selected.filter((x) => x !== t))}
            className="group inline-flex items-center gap-1.5 bg-signal/15 px-2.5 py-1 font-mono text-[0.66rem] text-signal"
          >
            {t}
            <span className="text-signal/60 group-hover:text-signal">×</span>
          </button>
        ))}
      </div>

      {available.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {available.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => add(t)}
              className="border border-console-line px-2.5 py-1 font-mono text-[0.62rem] text-paper/50 hover:border-signal hover:text-paper"
            >
              + {t}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(custom);
              setCustom("");
            }
          }}
          placeholder="Add custom technology…"
          className={cn(inputCls, "flex-1")}
        />
        <button
          type="button"
          onClick={() => {
            add(custom);
            setCustom("");
          }}
          className="border border-console-line px-4 font-mono text-[0.66rem] uppercase tracking-label text-paper/70 hover:border-signal"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function CapabilityEditor({
  value,
  onChange,
}: {
  value: EditorCapability[];
  onChange: (v: EditorCapability[]) => void;
}) {
  function update(i: number, patch: Partial<EditorCapability>) {
    onChange(value.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  return (
    <div className="mt-6">
      <FieldLabel hint="Business capabilities told as outcomes — what the system lets the business do.">
        Capabilities
      </FieldLabel>
      <div className="space-y-3">
        {value.map((c, i) => (
          <div key={i} className="border border-console-line bg-console-2 p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.62rem] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <input
                value={c.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Capability title"
                className="flex-1 border-0 bg-transparent text-sm font-semibold text-paper placeholder:text-paper/25 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="font-mono text-[0.6rem] text-paper/40 hover:text-signal"
              >
                Remove
              </button>
            </div>
            <textarea
              value={c.detail}
              onChange={(e) => update(i, { detail: e.target.value })}
              rows={2}
              placeholder="Detail (optional)"
              className="mt-2 w-full resize-y border-t border-console-line bg-transparent pt-2 text-xs text-paper/70 placeholder:text-paper/25 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...value, { title: "", detail: "" }])}
        className="mt-3 border border-console-line px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/70 hover:border-signal"
      >
        + Add capability
      </button>
    </div>
  );
}

function GalleryEditor({
  images,
  onChange,
}: {
  images: EditorImage[];
  onChange: (v: EditorImage[]) => void;
}) {
  const gallery = images.filter((i) => i.kind === "gallery");
  const [busy, setBusy] = useState(false);

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: EditorImage[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        uploaded.push({ url, alt: "", kind: "gallery" });
      }
      onChange([...images, ...uploaded]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FieldLabel hint="Screenshots shown in the case study.">Gallery</FieldLabel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.map((img, i) => {
          const globalIdx = images.indexOf(img);
          return (
            <div key={i} className="border border-console-line bg-console-2 p-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
              </div>
              <input
                value={img.alt}
                onChange={(e) =>
                  onChange(images.map((x, idx) => (idx === globalIdx ? { ...x, alt: e.target.value } : x)))
                }
                placeholder="Alt text"
                className="mt-2 w-full bg-transparent font-mono text-[0.62rem] text-paper/70 placeholder:text-paper/25 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== globalIdx))}
                className="mt-1 font-mono text-[0.6rem] text-paper/40 hover:text-signal"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
      <label className="mt-3 inline-block cursor-pointer border border-console-line px-4 py-2 font-mono text-[0.66rem] uppercase tracking-label text-paper/70 hover:border-signal">
        {busy ? "Uploading…" : "+ Add images"}
        <input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      </label>
    </div>
  );
}
