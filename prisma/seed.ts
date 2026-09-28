import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
 
const TECHNOLOGIES: { name: string; category: string }[] = [
  { name: "Java", category: "Application" },
  { name: "Spring Boot", category: "Application" },
  { name: "Next.js", category: "Application" },
  { name: "React", category: "Application" },
  { name: "TypeScript", category: "Application" },
  { name: "ZKoss", category: "Application" },
  { name: "PostgreSQL", category: "Data" },
  { name: "MySQL", category: "Data" },
  { name: "Prisma", category: "Data" },
  { name: "Flyway", category: "Data" },
  { name: "ActiveJDBC", category: "Data" },
  { name: "REST API", category: "Integration" },
  { name: "WebSocket", category: "Integration" },
  { name: "Payment Gateway", category: "Integration" },
  { name: "QRIS", category: "Integration" },
  // { name: "JWT", category: "Integration" },
  // { name: "JasperReports", category: "Integration" },
  { name: "Docker", category: "Infrastructure" },
  { name: "Linux", category: "Infrastructure" },
  { name: "Nginx", category: "Infrastructure" },
  { name: "Tomcat", category: "Infrastructure" },
];

type SeedProject = {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  projectType: string;
  year: number;
  clientType: string;
  role?: string;
  businessProblem: string;
  solution: string;
  technicalChallenges: string;
  technicalDecisions: string;
  outcome: string;
  architectureText?: string;
  demoUrl?: string;
  githubUrl?: string;
  layout: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  technologies: string[];
  capabilities: { title: string; detail: string }[];
};
 
const PROJECTS: SeedProject[] = [
  // ---------------------------------------------------------------- FLAGSHIP
  {
    title: "Multi-Outlet POS & Business Management System",
    slug: "multi-outlet-pos",
    shortDescription:
      "Platform point-of-sale dan operasional produksi yang menjalankan banyak outlet dari satu sistem bisnis penjualan, inventory, promo, pembayaran, dan perangkat real-time.",
    fullDescription:
      "Tulang punggung operasional untuk bisnis food & beverage multi-outlet: software yang dipakai staf setiap shift untuk berjualan, dipakai manajer untuk mengontrol inventory dan promo lintas lokasi, sekaligus lapisan integrasi yang menghubungkan lantai toko ke penyedia pembayaran dan reporting back-office.",
    category: "Aplikasi Bisnis",
    projectType: "Platform POS & Operasional",
    year: 2024,
    clientType: "Perusahaan F&B (Rahasia)",
    role: "Full-Stack Engineer",
    businessProblem:
      "Bisnis ini menjalankan beberapa outlet dengan tools yang terpisah-pisah. Tiap lokasi menetapkan harga, memberi diskon, dan menghitung stok dengan caranya sendiri, kas tidak pernah cocok rapi di akhir shift, dan kantor pusat tidak punya gambaran harian yang bisa dipercaya tentang apa yang sebenarnya terjadi di lapangan. Sistem penggantinya punya satu syarat mati: tidak boleh gagal atau melambat saat jam operasional.",
    solution:
      "Satu sistem yang dipakai bersama semua outlet, dengan peran dan data yang dibatasi per lokasi. POS menangani input order cepat, banyak metode pembayaran, dan struk thermal. manajer menjalankan shift, cash settlement, inventory, serta engine promo dan voucher berbasis aturan. kantor pusat mendapat reporting terkonsolidasi. Perangkat fisik kitchen display, customer display, thermal printer",
    technicalChallenges:
      "Menjaga POS tetap responsif dan benar sambil mengoordinasikan hardware nyata dan event pembayaran eksternal adalah inti persoalannya. Notifikasi pembayaran datang secara asinkron dan bisa terduplikasi atau tiba tidak berurutan, jadi tidak ada yang boleh mengasumsikan skenario ideal. Promo bertumpuk dengan cara yang tidak boleh menghasilkan total yang salah. Dan outlet harus tetap bisa berjualan saat jaringan sempat terganggu, lalu rekonsiliasi dengan bersih.",
    technicalDecisions:
      "Saya sengaja membuat arsitekturnya 'membosankan': server Java/ZKoss di Tomcat, PostgreSQL sebagai satu sumber kebenaran, Flyway untuk setiap perubahan skema agar migrasi bisa direview dan di-rollback, dan ActiveJDBC untuk data layer yang tipis dan mudah diprediksi. Perhitungan uang dipusatkan dan diuji, bukan tersebar di banyak layar. Trafik perangkat dan pembayaran berjalan lewat WebSocket dengan acknowledgement eksplisit dan idempotency key, sehingga callback pembayaran ganda tidak akan pernah menyelesaikan satu order dua kali. Reporting dialihkan ke JasperReports agar dokumen berat tidak pernah menghambat jalur penjualan.",
    outcome:
      "Outlet beroperasi dari satu sistem yang konsisten dengan harga, promo, dan inventory yang sama. Shift direkonsiliasi terhadap transaksi tercatat, bukan tebakan, dan kantor pusat bisa melihat aktivitas harian lintas lokasi. Integrasi pembayaran dan perangkat terbukti stabil di beban operasional nyata standar yang benar-benar penting untuk sebuah POS.",
    architectureText: [
      "POS CASHIER",
      "  ├── Sales & Order Entry",
      "  ├── Inventory & Stock Moves",
      "  ├── Promotion / Voucher Engine",
      "  ├── Shift & Cash Settlement",
      "  └── Device Sync (WebSocket)",
      "        │",
      "        ▼",
      "CENTRAL SERVICES",
      "  ├── Payment Gateway Integration",
      "  ├── Third-Party APIs (e.g. GoBiz)",
      "  ├── Real-Time Messaging Hub",
      "  └── Reporting (JasperReports)",
      "        │",
      "        ▼",
      "PostgreSQL  ·  External Providers",
    ].join("\n"),
    layout: "flagship",
    published: true,
    featured: true,
    sortOrder: 0,
    seoTitle: "Multi-Outlet POS & Business Management System Case Study",
    seoDescription:
      "Platform POS dan operasional produksi: penjualan multi-outlet, inventory, promo, perangkat real-time, dan integrasi pembayaran. Java, PostgreSQL, WebSocket.",
    technologies: [
      "Java",
      "ZKoss",
      "Tomcat",
      "PostgreSQL",
      "ActiveJDBC",
      "Flyway",
      "WebSocket",
      "REST API", 
      "Nginx",
    ],
    capabilities: [
      {
        title: "Operasikan banyak outlet dari satu sistem bisnis",
        detail:
          "Harga, promo, inventory, dan peran dibagikan dan dibatasi per lokasi, sehingga setiap outlet bekerja dengan cara yang sama sementara kantor pusat melihat seluruh bisnis.",
      },
      {
        title: "Terima semua metode pembayaran dari satu POS",
        detail:
          "Tunai, kartu, dan QRIS mengalir lewat satu jalur checkout, dengan status pembayaran dikonfirmasi kembali ke terminal secara real-time.",
      },
      {
        title: "Otomatiskan aturan promo dan voucher yang kompleks",
        detail:
          "Engine aturan menerapkan diskon bertumpuk, voucher, dan campaign secara deterministik totalnya selalu bisa dipertanggungjawabkan.",
      },
      {
        title: "Rekonsiliasi setiap shift dengan percaya diri",
        detail:
          "Buka/tutup shift, cash settlement, dan rincian pembayaran direkonsiliasi terhadap transaksi tercatat, bukan hitungan manual.",
      },
      {
        title: "Kendalikan lantai toko secara real-time",
        detail:
          "Kitchen display, customer display, thermal printer, dan scanner berbasis HP tetap sinkron lewat WebSocket selama operasional.",
      },
      {
        title: "Reporting untuk seluruh operasi",
        detail:
          "Laporan penjualan, inventory, dan operasional terkonsolidasi dibuat di sisi server tanpa memperlambat jalur penjualan.",
      },
    ],
  },

  // ------------------------------------------------------- PAYMENT INTEGRATION
  {
    title: "Payment Gateway & QRIS Integration",
    slug: "payment-gateway-qris-integration",
    shortDescription:
      "Integrasi backend yang membuat POS menerima pembayaran QRIS dan gateway secara andal callback asinkron, idempotency, dan status real-time kembali ke terminal.",
    fullDescription:
      "Tinjauan yang fokus pada bagian tersulit dari menerima pembayaran digital di toko: membuat alur pembayaran yang asinkron, melibatkan pihak ketiga, dan kadang tidak stabil, terasa instan dan tepercaya di kasir.",
    category: "Integrasi",
    projectType: "Integrasi Pembayaran",
    year: 2024,
    clientType: "Perusahaan F&B (Rahasia)",
    role: "Backend / Integration Engineer",
    businessProblem:
      "Sebuah pembayaran entah berhasil atau tidak dan kasir harus tahu dalam hitungan detik, tanpa pernah menagih pelanggan dua kali atau melepas order yang belum dibayar. Penyedia pembayaran mengonfirmasi secara asinkron lewat callback yang bisa terlambat, terduplikasi, atau tiba tidak berurutan. Penanganan yang naif di sini langsung berujung pada uang hilang atau pelanggan kecewa.",
    solution:
      "Sebuah central payment service berada di antara POS dan penyedia pembayaran. POS meminta charge; central service melakukan autentikasi ke penyedia (JWT), membuat transaksi, dan mengembalikan payload QRIS. Saat penyedia mengirim notifikasi pembayaran, central service memvalidasinya, menghapus duplikat, memperbarui status otoritatif, dan mendorong hasilnya ke terminal yang tepat lewat WebSocket sehingga kasir melihat 'Lunas' begitu pembayaran clear.",
    technicalChallenges:
      "Hasil exactly-once di atas pengiriman at-least-once. Callback terduplikasi dan saling berlomba, jaringan putus di tengah alur, dan terminal yang memulai pembayaran bisa sesaat terputus. Setiap kondisi itu harus berakhir pada satu status pembayaran yang benar.",
    technicalDecisions:
      "Setiap pembayaran membawa idempotency key yang stabil, sehingga callback berulang dikenali dan di-acknowledge tanpa diproses ulang. Notifikasi penyedia diverifikasi sebelum dipercaya. Transisi status bersifat eksplisit dan satu arah (pending → paid/failed/expired), tidak pernah dibuka lagi oleh duplikat yang terlambat. Pengiriman WebSocket ke POS di-acknowledge; jika terminal sempat offline, ia merekonsiliasi status terkini saat reconnect alih-alih mengandalkan push yang terlewat.",
    outcome:
      "Pembayaran digital terkonfirmasi di kasir secara real-time, callback ganda terbukti tidak berbahaya, dan status pembayaran tetap konsisten antara penyedia, central service, dan POS bahkan saat koneksi tidak stabil.",
    architectureText: [
      "POS  ──charge request──▶  CENTRAL PAYMENT GATEWAY",
      "                              │  authenticate (JWT)",
      "                              ▼",
      "                        PAYMENT PROVIDER",
      "                              │  QRIS / payment",
      "                              ▼",
      "                     PAYMENT NOTIFICATION (async)",
      "                              │  verify · de-dupe · settle",
      "                              ▼",
      "                        CENTRAL GATEWAY",
      "                              │  WebSocket + ack",
      "                              ▼",
      "POS  ◀──── real-time 'PAID' status ────┘",
    ].join("\n"),
    layout: "split",
    published: true,
    featured: true,
    sortOrder: 1,
    seoTitle: "Payment Gateway & QRIS Integration Case Study",
    seoDescription:
      "Integrasi QRIS dan payment gateway yang andal: autentikasi JWT, callback asinkron, idempotency, penanganan event ganda, dan status real-time via WebSocket.",
    technologies: ["Java", "REST API", "WebSocket", "JWT", "QRIS", "Payment Gateway", "PostgreSQL"],
    capabilities: [
      {
        title: "Konfirmasi pembayaran secara real-time",
        detail:
          "Terminal yang memulai charge diberi tahu lewat WebSocket begitu penyedia mengonfirmasi tanpa polling, tanpa tebakan.",
      },
      {
        title: "Tahan terhadap callback ganda dan tidak berurutan",
        detail:
          "Idempotency key dan transisi status satu arah membuat notifikasi berulang atau saling berlomba terbukti aman.",
      },
      {
        title: "Autentikasi setiap pertukaran dengan penyedia",
        detail:
          "Autentikasi berbasis JWT dan verifikasi notifikasi memastikan hanya event pembayaran yang sah yang mengubah status uang.",
      },
      {
        title: "Rekonsiliasi setelah terputus",
        detail:
          "Jika terminal offline di tengah pembayaran, ia merekonsiliasi status otoritatif saat reconnect alih-alih memercayai push yang terlewat.",
      },
    ],
  },

  // ------------------------------------------------------------- MODERN WEB #1
  {
    title: "B2B Company Website",
    slug: "b2b-company-website",
    shortDescription:
      "Website korporat yang cepat dan mudah diedit untuk perusahaan B2B dikelola lewat CMS, siap SEO, dan dibangun untuk mengonversi inquiry, bukan sekadar terlihat bagus.",
    fullDescription:
      "Situs marketing modern di mana tim non-teknis memegang kontennya dan engineering memegang kecepatan, struktur, dan penangkapan lead.",
    category: "Platform Web",
    projectType: "Website Perusahaan",
    year: 2025,
    clientType: "Perusahaan B2B (Placeholder)",
    role: "Full-Stack Engineer",
    businessProblem:
      "Perusahaan butuh kehadiran web yang kredibel untuk dirujuk tim sales ke calon klien, yang muncul di pencarian untuk kategorinya, dan yang bisa diperbarui tim marketing tanpa menunggu developer untuk setiap perubahan kata.",
    solution:
      "Situs Next.js dengan halaman server-rendered untuk kecepatan dan SEO, CMS ringan untuk section dan case study yang bisa diedit, serta alur inquiry yang mengalirkan lead berkualitas langsung ke inbox yang bisa direview.",
    technicalChallenges:
      "Menyeimbangkan kebutuhan marketing untuk mengedit dengan bebas dan design system yang tidak boleh rusak, sambil menjaga Core Web Vitals tetap hijau di perangkat nyata.",
    technicalDecisions:
      "Konten yang terstruktur dan bertipe alih-alih page builder bebas: editor mengisi field yang sudah ditentukan, desain tetap konsisten. Gambar dioptimalkan dan lazy-load, serta metadata dibuat per halaman.",
    outcome:
      "Situs yang bisa dijaga tetap update oleh tim sendiri, cepat dimuat, dan terstruktur untuk pencarian konten placeholder dipakai di sini untuk mendemokan build-nya.",
    layout: "horizontal",
    published: true,
    featured: false,
    sortOrder: 2,
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Nginx"],
    capabilities: [
      { title: "Bisa diedit tanpa developer", detail: "Field konten terstruktur menjaga desain tetap utuh sementara marketing memegang teksnya." },
      { title: "Dibangun untuk pencarian", detail: "Server rendering, metadata bersih, dan struktur semantik per halaman." },
      { title: "Mengubah kunjungan jadi inquiry", detail: "Form lead yang fokus mengarahkan inquiry berkualitas ke inbox yang bisa direview." },
    ],
  },

  // ------------------------------------------------------------- MODERN WEB #2
  {
    title: "Business Operations Dashboard",
    slug: "business-operations-dashboard",
    shortDescription:
      "Dashboard internal modern yang mengubah data operasional jadi keputusan berbasis peran, real-time, dan cepat di dataset nyata.",
    fullDescription:
      "Aplikasi web internal untuk tim yang perlu melihat dan menindaklanjuti data operasional tanpa mengekspor spreadsheet.",
    category: "Aplikasi Bisnis",
    projectType: "Dashboard Internal",
    year: 2025,
    clientType: "Startup (Placeholder)",
    role: "Full-Stack Engineer",
    businessProblem:
      "Data operasional terjebak di ekspor dan laporan manual, sehingga keputusan tertinggal dari kenyataan dan orang yang berbeda memercayai angka yang berbeda.",
    solution:
      "API Spring Boot di atas database operasional yang memberi makan dashboard React.js dengan tampilan berbasis peran, filter, dan angka yang mendekati real-time yang dibagikan seluruh tim.",
    technicalChallenges:
      "Menjaga query tetap cepat seiring data bertambah, dan memastikan tiap peran melihat tepat apa yang seharusnya tidak lebih, tidak kurang.",
    technicalDecisions:
      "Agregasi dihitung di sisi server dan di-cache, pagination dan indexing di jalur yang panas, dan otorisasi ditegakkan di API alih-alih disembunyikan di UI.",
    outcome:
      "Satu tampilan operasional yang sama dan terkini dengan akses dibatasi per peran didemokan di sini dengan data placeholder.",
    layout: "compact",
    published: true,
    featured: false,
    sortOrder: 3,
    technologies: ["Spring Boot", "Java", "React.Js", "TypeScript", "PostgreSQL"],
    capabilities: [
      { title: "Satu sumber kebenaran bersama", detail: "Semua orang membaca angka terkini yang sama alih-alih ekspor yang berbeda-beda." },
      { title: "Akses berbasis peran", detail: "Otorisasi ditegakkan di API sehingga tiap peran hanya melihat yang seharusnya." },
      { title: "Cepat di data nyata", detail: "Agregasi sisi server, caching, dan query terindeks menjaganya tetap responsif seiring data bertambah." },
    ],
  },

  // ------------------------------------------------------------- MODERN WEB #3
  {
    title: "Property Listing Platform",
    slug: "property-listing-platform",
    shortDescription:
      "Website properti dengan pencarian cepat, halaman listing yang kaya, dan back-office sederhana untuk mengelola inventory front-end modern, data terstruktur di baliknya.",
    fullDescription:
      "Platform web bergaya katalog di mana pengunjung mencari dan menelusuri listing dan staf mengelola inventory lewat admin.",
    category: "Platform Web",
    projectType: "Website Properti",
    year: 2025,
    clientType: "Bisnis Properti (Placeholder)",
    role: "Full-Stack Engineer",
    businessProblem:
      "Listing perlu mudah ditemukan, difilter, dan nyaman ditelusuri di HP, sementara staf perlu cara yang lugas untuk menjaga inventory tetap akurat.",
    solution:
      "Front-end Next.js dengan pencarian terfilter yang cepat dan halaman detail yang kaya gambar, didukung skema terstruktur dan admin ringan untuk mengelola listing dan media.",
    technicalChallenges:
      "Pemfilteran cepat lintas banyak atribut dan menjaga halaman yang berat gambar tetap ringan di koneksi mobile.",
    technicalDecisions:
      "Pencarian berbasis server yang terindeks, gambar responsif yang dioptimalkan, dan skema listing yang bersih agar filter tetap cepat dan data tetap konsisten.",
    outcome:
      "Katalog properti yang mobile-first dan mudah ditelusuri dengan back-office pengelolaan sederhana inventory placeholder ditampilkan untuk mendemokan build-nya.",
    layout: "standard",
    published: true,
    featured: false,
    sortOrder: 4,
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "REST API"],
    capabilities: [
      { title: "Pencarian terfilter yang cepat", detail: "Pencarian berbasis server dan terindeks lintas atribut listing." },
      { title: "Halaman mobile-first yang kaya gambar", detail: "Gambar responsif yang dioptimalkan menjaga halaman detail tetap ringan di koneksi nyata." },
      { title: "Back-office sederhana", detail: "Staf mengelola listing dan media lewat admin yang lugas." },
    ],
  },
];

const SERVICES = [
  {
    title: "Website Bisnis",
    slug: "business-websites",
    summary:
      "Situs korporat, website B2B, dan landing page yang cepat, kredibel, dan bisa diedit tim Anda dibangun untuk mengonversi, bukan sekadar hiasan.",
    deliverables: "Website korporat & B2B\nLanding page\nContent management\nStruktur & metadata SEO\nOptimasi performa",
    sortOrder: 0,
  },
  {
    title: "Aplikasi Bisnis",
    slug: "business-applications",
    summary:
      "POS, inventory, dashboard, dan internal tool software operasional yang dipakai tim Anda setiap hari, dibangun agar benar di beban nyata.",
    deliverables: "Sistem POS & operasional\nManajemen inventory\nDashboard internal\nWorkflow operasional\nAkses berbasis peran",
    sortOrder: 1,
  },
  {
    title: "Integrasi API & Sistem",
    slug: "api-system-integration",
    summary:
      "REST API, integrasi pihak ketiga, payment gateway, dan webhook yang terhubung andal termasuk bagian asinkron yang rumit.",
    deliverables: "Desain & pembangunan REST API\nIntegrasi pihak ketiga\nPayment gateway & QRIS\nWebhook & callback\nReal-time (WebSocket)",
    sortOrder: 2,
  },
  {
    title: "Modernisasi Sistem",
    slug: "system-modernization",
    summary:
      "Sistem lama diperbaiki, dimigrasikan, dan di-refactor tanpa menghentikan bisnis yang bergantung padanya.",
    deliverables: "Asesmen legacy\nMigrasi bertahap\nRefactoring\nPeningkatan arsitektur\nPekerjaan database & skema",
    sortOrder: 3,
  },
  {
    title: "Custom Software",
    slug: "custom-software",
    summary:
      "Software yang dibentuk sesuai aturan bisnis spesifik Anda saat tools jadi tidak cocok dengan cara Anda beroperasi.",
    deliverables: "Requirement & scoping\nPembangunan aplikasi bespoke\nData modelling\nIntegrasi\nDeployment & handover",
    sortOrder: 4,
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com", handle: "@developer", sortOrder: 0 },
  { label: "LinkedIn", url: "https://linkedin.com", handle: "in/developer", sortOrder: 1 },
  { label: "Email", url: "mailto:hello@studio.dev", handle: "hello@studio.dev", sortOrder: 2 },
];

async function main() {
  console.log("Seeding database...");

  // --- Admin user ---
  const email = (process.env.ADMIN_EMAIL || "admin@studio.dev").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  const name = process.env.ADMIN_NAME || "Studio Admin";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
  console.log(`  ✓ admin user: ${email}`);

  // --- Technologies ---
  for (let i = 0; i < TECHNOLOGIES.length; i++) {
    const t = TECHNOLOGIES[i];
    await prisma.technology.upsert({
      where: { name: t.name },
      update: { category: t.category, sortOrder: i },
      create: { name: t.name, category: t.category, sortOrder: i },
    });
  }
  console.log(`  ✓ ${TECHNOLOGIES.length} technologies`);

  const techByName = new Map(
    (await prisma.technology.findMany()).map((t) => [t.name, t.id])
  );

  // --- Projects ---
  for (const p of PROJECTS) {
    const { technologies, capabilities, ...data } = p;
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: { ...data },
      create: { ...data },
    });

    // reset relations for idempotent re-seed
    await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });
    await prisma.projectCapability.deleteMany({ where: { projectId: project.id } });

    await prisma.projectTechnology.createMany({
      data: technologies
        .filter((n) => techByName.has(n))
        .map((n, idx) => ({ projectId: project.id, technologyId: techByName.get(n)!, sortOrder: idx })),
      skipDuplicates: true,
    });

    await prisma.projectCapability.createMany({
      data: capabilities.map((c, idx) => ({
        projectId: project.id,
        title: c.title,
        detail: c.detail,
        sortOrder: idx,
      })),
    });
  }
  console.log(`  ✓ ${PROJECTS.length} projects`);

  // --- Services ---
  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { ...s, detail: "", published: true },
      create: { ...s, detail: "", published: true },
    });
  }
  console.log(`  ✓ ${SERVICES.length} services`);

  // --- Social links ---
  const existingSocial = await prisma.socialLink.count();
  if (existingSocial === 0) {
    await prisma.socialLink.createMany({ data: SOCIAL_LINKS });
    console.log(`  ✓ ${SOCIAL_LINKS.length} social links`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
