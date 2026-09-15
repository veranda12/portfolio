import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/content";
import { updateSettings } from "@/app/admin/actions";
import { SocialLinksManager } from "@/components/admin/SocialLinksManager";
import { SaveSettingsButton } from "@/components/admin/SaveSettingsButton";

// Human-labelled groups of editable copy. Keys match SiteSetting keys.
const GROUPS: { title: string; fields: { key: string; label: string; area?: boolean }[] }[] = [
  {
    title: "Identity",
    fields: [
      { key: "site.name", label: "Site name (nav)" },
      { key: "site.role", label: "Role (footer)" },
    ],
  },
  {
    title: "Hero",
    fields: [
      { key: "hero.kicker", label: "Kicker" },
      { key: "hero.line1", label: "Headline line 1" },
      { key: "hero.line2", label: "Headline line 2 (accent)" },
      { key: "hero.statement", label: "Statement", area: true },
      { key: "hero.availability", label: "Availability note" },
    ],
  },
  {
    title: "About / Approach",
    fields: [
      { key: "about.heading", label: "Heading", area: true },
      { key: "about.body", label: "Body (blank line = new paragraph)", area: true },
      { key: "about.principle1", label: "Principle 1" },
      { key: "about.principle2", label: "Principle 2" },
      { key: "about.principle3", label: "Principle 3" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "contact.heading", label: "Heading", area: true },
      { key: "contact.body", label: "Body", area: true },
      { key: "contact.email", label: "Public email" },
      { key: "contact.location", label: "Location" },
    ],
  },
  {
    title: "Footer",
    fields: [{ key: "footer.note", label: "Footer note", area: true }],
  },
];

const inputCls =
  "w-full border border-console-line bg-console-2 px-3 py-2.5 text-sm text-paper placeholder:text-paper/25 focus:border-signal focus:outline-none";

export default async function ContentPage() {
  const [settings, links] = await Promise.all([
    getSettings(),
    prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="border-b border-console-line pb-6">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Site content</h1>
        <p className="mt-2 font-mono text-[0.66rem] text-paper/40">
          Editorial copy for the public site. Changes publish immediately.
        </p>
      </div>

      <form action={updateSettings} className="mt-6 space-y-8">
        {GROUPS.map((g) => (
          <fieldset key={g.title} className="border border-console-line bg-console p-5">
            <legend className="px-2 font-mono text-[0.66rem] uppercase tracking-label text-signal">{g.title}</legend>
            <div className="space-y-4">
              {g.fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-label text-paper/60">
                    {f.label}
                  </label>
                  {f.area ? (
                    <textarea name={`s:${f.key}`} defaultValue={settings[f.key] ?? ""} rows={3} className={`${inputCls} resize-y`} />
                  ) : (
                    <input name={`s:${f.key}`} defaultValue={settings[f.key] ?? ""} className={inputCls} />
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="sticky bottom-4 flex justify-end">
          <SaveSettingsButton />
        </div>
      </form>

      <div className="mt-10 border-t border-console-line pt-8">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Social links</p>
        <p className="mt-1 font-mono text-[0.62rem] text-paper/40">Shown in the footer.</p>
        <div className="mt-4">
          <SocialLinksManager links={links} />
        </div>
      </div>
    </div>
  );
}
