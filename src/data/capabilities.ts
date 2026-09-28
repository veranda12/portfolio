// Structured content for /capabilities. Sourced from the CV — nothing here
// should claim a technology or technique the CV doesn't support. Skills can
// optionally reference project slugs (from prisma/seed.ts) so the page can
// link a capability to real portfolio work.

export type CapabilityGroup = {
  number: string;
  title: string;
  description: string;
  skills: string[];
  relatedSlugs?: string[];
};

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    number: "01",
    title: "Backend",
    description: "Tempat sebagian besar pekerjaan saya berada: layanan dan API yang menjalankan logika bisnis.",
    skills: ["Java (Spring Boot)", "Java (ZK Framework)", "Go", "Node.js", "Express.js", "CodeIgniter", "Laravel"],
    relatedSlugs: [],
  },
  {
    number: "02",
    title: "Frontend",
    description: "Antarmuka yang dipakai staf operasional dan tim internal setiap hari.",
    skills: ["React.js", "Next.js"],
    relatedSlugs: [],
  },
  {
    number: "03",
    title: "Database",
    description: "Desain skema dan tuning query, terutama saat datanya besar dan harus tetap akurat.",
    skills: ["PostgreSQL", "OracleDB (PL/SQL)"],
    relatedSlugs: [],
  },
  {
    number: "04",
    title: "Data & Integrasi",
    description: "Menghubungkan sistem internal dengan pipeline data dan layanan pihak ketiga.",
    skills: ["SSIS", "GraphQL", "Apache Kafka", "Redis"],
    relatedSlugs: [],
  },
  {
    number: "05",
    title: "Tools & Platform",
    description: "Alur kerja sehari-hari untuk kolaborasi, tracking, dan pengujian API.",
    skills: ["Jenkins", "OpenShift", "Git", "Bitbucket", "Jira", "Postman"],
  },
  {
    number: "06",
    title: "Infrastruktur & Deployment",
    description: "Menjalankan dan merilis software secara aman di produksi.",
    skills: ["Nginx", "CI/CD Pipeline"],
  },
];

export type Technique = {
  number: string;
  title: string;
  body: string;
};

export const TECHNIQUES: Technique[] = [
  {
    number: "01",
    title: "Dari kebutuhan bisnis ke kontrak teknis",
    body: "Memahami kebutuhan bisnis terlebih dahulu, lalu menerjemahkannya ke BRD, ERD, kontrak API, dan analisis arsitektur sebelum mulai menulis kode. Dengan begitu, struktur sistem dan batas antar bagian sudah jelas sejak awal, dan tim lain punya acuan yang sama tentang apa yang sedang dibangun.",
  },
  {
    number: "02",
    title: "Migrasi sistem lama tanpa menghentikan bisnisnya",
    body: "Memindahkan aplikasi legacy ke arsitektur modern secara bertahap, misalnya migrasi POS dari Java 8/ZK Framework 7 ke aplikasi desktop Wails (Go + React), sambil mempertahankan alur kerja yang sudah terbiasa dipakai pengguna.",
  },
  {
    number: "03",
    title: "Tuning database sampai ke level query",
    body: "Mengoptimalkan query dan package PL/SQL untuk memangkas waktu eksekusi batch dan menghilangkan bottleneck yang berulang, bukan sekadar menambah resource server.",
  },
  {
    number: "04",
    title: "Integrasi yang tahan terhadap dunia nyata",
    body: "Merancang kontrak REST API dan pipeline data (SSIS) yang tetap benar saat menghadapi kondisi asinkron, duplikasi event, dan koneksi yang tidak sempurna.",
  },
  {
    number: "05",
    title: "Rilis yang terkontrol",
    body: "Mengatur build dan deployment lewat CI/CD (Jenkins, OpenShift) dan mekanisme distribusi versi terpusat, sehingga rilis baru bisa disebar secara terkendali, bukan manual satu per satu.",
  },
];

export type ExperienceEntry = {
  company: string;
  context?: string;
  role: string;
  period: string;
  setting: string;
  summary: string;
  highlights: string[];
  areas: string[];
  relatedSlugs?: string[];
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "PT Sebastian Citra Indonesia",
    role: "Fullstack Developer",
    period: "Agustus 2025 — Sekarang",
    setting: "Onsite",
    summary:
      "Mengerjakan modernisasi POS Roti'O & Beard Papa's, pengembangan sistem terpusat untuk operasional resort, serta integrasi backend untuk kebutuhan multi-outlet.",

    highlights: [
      "Memimpin migrasi POS legacy berbasis Java 8 / ZK Framework 7 ke aplikasi desktop Wails dengan Go dan React.js dalam arsitektur monolitik, dengan tetap mempertahankan alur kerja yang sudah digunakan di outlet.",

      "Memodernisasi tampilan POS tanpa mengubah pola navigasi dan proses operasional yang sudah familiar bagi pengguna, sehingga perubahan teknologi tidak mengharuskan pengguna mempelajari ulang seluruh alur kerja.",

      "Mengganti mekanisme update aplikasi POS berbasis Git dengan sistem distribusi versi terpusat menggunakan MinIO untuk mengontrol distribusi dan rilis aplikasi desktop.",

      "Memimpin pilot implementasi di 1 outlet untuk menguji stabilitas aplikasi, alur operasional, pengalaman pengguna, dan mekanisme update sebelum rencana rollout ke 900+ outlet.",

      "Merancang dan mengimplementasikan arsitektur backend menggunakan Java 21 dan Spring Boot untuk POS multi-outlet, termasuk mendefinisikan kontrak REST API untuk pemrosesan order real-time yang terintegrasi dengan GoBiz/GoFood.",

      "Memimpin pengembangan end-to-end sistem manajemen resort Lagundi yang mencakup POS, platform internal terpusat, parking, dan reservasi area seperti gazebo, private hut, dan bean bag.",

      "Merancang platform internal sebagai pusat master data dan konfigurasi untuk item, harga, promo, serta aturan parkir dengan arsitektur multi-area yang dapat digunakan untuk beberapa resort.",

      "Mengembangkan POS dan platform internal menggunakan Java 21 / ZK Framework 9 serta aplikasi parking berbasis Wails dengan Go dan React.js.",

      "Mengimplementasikan pengelolaan transaksi, shift staf, End-of-Day, revenue recognition, dan rekonsiliasi bank berbasis kode area, sehingga POS, reservasi, dan parking dapat berjalan dalam satu alur operasional.",

      "Melakukan optimasi query dan refactoring backend untuk mengurangi bottleneck serta meningkatkan response time aplikasi.",

      "Mendukung proses build dan deployment menggunakan Jenkins CI/CD serta konfigurasi Nginx untuk akses HTTPS di environment produksi.",
    ],

    areas: [
      "POS Multi-Outlet",
      "Migrasi Sistem",
      "Arsitektur Backend",
      "Integrasi GoBiz/GoFood",
      "Resort Management",
    ],

    relatedSlugs: [
      "multi-outlet-pos",
      "payment-gateway-qris-integration",
    ],
  },

  {
    company: "PT Mandiri Utama Finance",
    role: "Fullstack Developer",
    period: "Oktober 2021 — Agustus 2025",
    setting: "Onsite",
    summary:
      "Mengembangkan sistem multi finance enterprise, mengoptimalkan batch processing dan database, serta memodernisasi aplikasi web untuk kebutuhan operasional finance skala nasional.",

    highlights: [
      "Mengembangkan dan melakukan tuning daily closing batch job menggunakan PL/SQL yang berjalan di 98 cabang secara nasional dan memproses jutaan data transaksi pembayaran cicilan.",

      "Mengurangi runtime closing UAT dari sekitar 20 menit menjadi 1–5 menit, serta runtime produksi per batch 10 cabang dari sekitar 15 menit menjadi 7 menit.",

      "Melakukan tuning pada query dan package database untuk mengurangi cost eksekusi serta mengatasi bottleneck yang berulang pada proses batch.",

      "Mengurangi insiden produksi harian dari 1–2 isu kritikal dan sekitar 3 isu medium menjadi hanya beberapa isu minor per bulan.",

      "Menerjemahkan kebutuhan bisnis menjadi backend service dan fitur aplikasi web untuk sistem finance enterprise.",

      "Memigrasikan frontend aplikasi dari CodeIgniter ke Next.js untuk meningkatkan maintainability dan pengalaman pengguna.",

      "Mengoptimalkan SQL kompleks dan response time API untuk mengurangi beban database serta masalah performa yang berulang.",

      "Mengembangkan dan mengelola SSIS data pipeline untuk kebutuhan integrasi data enterprise.",

      "Mengelola build dan deployment aplikasi pada environment development dan UAT menggunakan Jenkins dengan OpenShift sebagai deployment platform.",

      "Menggunakan Jira untuk task management dan Bitbucket sebagai source control serta collaborative development workflow.",

      "Mendukung investigasi dan penyelesaian masalah produksi, khususnya pada periode deployment dan proses finance yang bersifat kritikal.",
    ],

    areas: [
      "Finance Enterprise",
      "Database & Query Tuning",
      "Batch Processing",
      "SSIS",
      "Frontend Migration",
      "Production Support",
    ],
  },
];

export const EDUCATION = {
  institution: "Universitas Teknokrat Indonesia, Bandar Lampung",
  degree: "Informatika",
  gpa: "IPK 3.53",
  period: "2017 — 2021",
};

export type TechIndexGroup = { label: string; items: string[] };

export const TECH_INDEX: TechIndexGroup[] = [
  { label: "Bahasa & Framework Backend", items: ["Java", "Spring Boot", "ZK Framework", "Go", "Node.js", "Express.js", "CodeIgniter", "Laravel"] },
  { label: "Frontend", items: ["React.js", "Next.js"] },
  { label: "Database", items: ["PostgreSQL", "OracleDB (PL/SQL)", "MySQL", "Firebase", "Supabase", "MongoDB"] },
  { label: "Data & Integrasi", items: ["REST API", "SSIS", "GraphQL", "Apache Kafka", "Redis"] },
  { label: "Tools & Platform", items: ["Jenkins", "OpenShift", "Git", "Bitbucket", "Jira", "Postman"] },
  { label: "Infrastruktur", items: ["Nginx", "CI/CD Pipeline"] },
];
