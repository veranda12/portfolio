import { prisma } from "./db";

// Editorial copy that the admin can override, with sensible defaults so the
// public site always renders even before anything is customized.
// Language: Bahasa Indonesia (primary) with English kept for technical terms.

export const SETTING_DEFAULTS = {
  "hero.kicker": "Full-Stack Engineering",
  "hero.line1": "Software untuk",
  "hero.line2": "bisnis nyata.",
  "hero.statement":
    "Saya merancang dan membangun website, aplikasi bisnis, integrasi, dan sistem operasional — software yang benar-benar dijalankan perusahaan setiap hari.",
  "hero.availability": "Tersedia untuk proyek baru",
  "about.heading": "Saya membangun di titik temu antara aturan bisnis, data, dan operasional nyata.",
  "about.body":
    "Sebagian besar pekerjaan saya ada di bagian bisnis yang paling krusial dan tidak glamor: point-of-sale yang tidak boleh mati saat jam sibuk, alur pembayaran yang harus cocok sampai rupiah terakhir, dan inventory yang harus tetap akurat di banyak outlet. Saya mengutamakan ketepatan di kondisi beban nyata, arsitektur yang jelas, dan sistem yang bisa dipercaya oleh tim operasional.\n\nFondasi itu terbawa ke pekerjaan web modern juga — saya membangun front-end Next.js dan React yang cepat dan rapi, didukung API dan database yang siap dijalankan di produksi.",
  "about.principle1": "Ketepatan di atas kepintaran. Sistem bisnis dinilai dari edge case-nya.",
  "about.principle2": "Arsitektur 'membosankan' yang disengaja. Makin sedikit komponen, makin sedikit insiden tengah malam.",
  "about.principle3": "Dibangun untuk dioperasikan, bukan sekadar didemokan.",
  "contact.heading": "Punya sistem yang perlu dibangun?",
  "contact.body":
    "Ceritakan apa yang perlu dilakukan bisnis Anda. Saya akan jujur menilai apakah saya orang yang tepat untuk membangunnya, dan bagaimana pendekatannya.",
  "contact.email": "seirin.fight232@gmail.com",
  "contact.location": "Jakarta Barat, Indonesia",
  "site.name": "Studio",
  "site.role": "Full-Stack Developer / Software Engineer",
  "footer.note":
    "Dirancang dan dibangun sebagai monolith dengan Next.js, TypeScript, dan PostgreSQL — dikelola sepenuhnya lewat CMS-nya sendiri.",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = { ...SETTING_DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
