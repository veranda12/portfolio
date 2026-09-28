// English version of src/data/capabilities.ts. Same structure and order; the
// experience highlights follow the wording of the (English) CV.
import type { CapabilityGroup, ExperienceEntry, Technique, TechIndexGroup } from "./capabilities";

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    number: "01",
    title: "Backend",
    description: "Where most of my work lives: the services and APIs that run the business logic.",
    skills: ["Java (Spring Boot)", "Java (ZK Framework)", "Go", "Node.js", "Express.js", "CodeIgniter", "Laravel"],
    relatedSlugs: [],
  },
  {
    number: "02",
    title: "Frontend",
    description: "Interfaces that operations staff and internal teams use every day.",
    skills: ["React.js", "Next.js"],
    relatedSlugs: [],
  },
  {
    number: "03",
    title: "Database",
    description: "Schema design and query tuning, especially when the data is large and must stay accurate.",
    skills: ["PostgreSQL", "OracleDB (PL/SQL)"],
    relatedSlugs: [],
  },
  {
    number: "04",
    title: "Data & Integration",
    description: "Connecting internal systems with data pipelines and third-party services.",
    skills: ["SSIS", "GraphQL", "Apache Kafka", "Redis"],
    relatedSlugs: [],
  },
  {
    number: "05",
    title: "Tools & Platform",
    description: "The day-to-day workflow for collaboration, tracking and API testing.",
    skills: ["Jenkins", "OpenShift", "Git", "Bitbucket", "Jira", "Postman"],
  },
  {
    number: "06",
    title: "Infrastructure & Deployment",
    description: "Running and releasing software safely in production.",
    skills: ["Nginx", "CI/CD Pipeline"],
  },
];

export const TECHNIQUES: Technique[] = [
  {
    number: "01",
    title: "From business requirements to technical contracts",
    body: "Understanding the business need first, then translating it into a BRD, ERD, API contracts and an architecture analysis before writing code. That way the system's structure and boundaries are clear from the start, and every team works from the same picture of what's being built.",
  },
  {
    number: "02",
    title: "Migrating legacy systems without stopping the business",
    body: "Moving legacy applications to a modern architecture step by step — for example migrating a POS from Java 8/ZK Framework 7 to a Wails desktop app (Go + React) — while keeping the workflows users already know.",
  },
  {
    number: "03",
    title: "Database tuning down to the query level",
    body: "Optimising queries and PL/SQL packages to cut batch execution time and remove recurring bottlenecks, rather than just adding server resources.",
  },
  {
    number: "04",
    title: "Integrations that survive the real world",
    body: "Designing REST API contracts and data pipelines (SSIS) that stay correct under asynchronous conditions, duplicate events and imperfect connections.",
  },
  {
    number: "05",
    title: "Controlled releases",
    body: "Running builds and deployments through CI/CD (Jenkins, OpenShift) and a centralised version-distribution mechanism, so new releases roll out in a controlled way instead of by hand, one machine at a time.",
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "PT Sebastian Citra Indonesia",
    role: "Fullstack Developer",
    period: "August 2025 — Present",
    setting: "Onsite",
    summary:
      "Modernising the POS for Roti'O & Beard Papa's, building a centralised system for resort operations, and delivering backend integrations for multi-outlet needs.",
    highlights: [
      "Led the migration of the legacy Java 8 / ZK Framework 7 POS to a Wails desktop application (Go backend, React.js frontend) in a monolithic architecture, keeping the workflows already used in the outlets.",
      "Modernised the POS UI without changing the navigation patterns and operational flows users already knew, so the technology change didn't force anyone to relearn their daily work.",
      "Replaced the Git-based POS update mechanism with a centralised version-distribution system using MinIO, giving controlled, scalable delivery of desktop releases.",
      "Led the pilot in one outlet to validate application stability, operational workflows, user experience and the update mechanism ahead of a planned rollout to 900+ outlets.",
      "Designed and implemented the backend architecture in Java 21 and Spring Boot for a multi-outlet POS, including the REST API contracts for real-time order processing integrated with GoBiz/GoFood.",
      "Led end-to-end development of the Lagundi resort management system covering POS, a centralised internal platform, parking, and area reservations such as gazebos, private huts and bean bags.",
      "Designed the internal platform as the central source of master data and configuration — items, pricing, promotions and parking rules — with a multi-area architecture that supports several resorts.",
      "Built the POS and internal platform with Java 21 / ZK Framework 9, and the parking app as a Wails desktop application (Go + React.js).",
      "Implemented area-code-based management of transactions, staff shifts, End-of-Day, revenue recognition and bank reconciliation, so POS, reservations and parking run as one operational flow.",
      "Optimised queries and refactored the backend to remove bottlenecks and improve response times.",
      "Supported builds and deployments with Jenkins CI/CD and configured Nginx for HTTPS access in production.",
    ],
    areas: ["Multi-Outlet POS", "System Migration", "Backend Architecture", "GoBiz/GoFood Integration", "Resort Management"],
    relatedSlugs: ["multi-outlet-pos", "payment-gateway-qris-integration"],
  },
  {
    company: "PT Mandiri Utama Finance",
    role: "Fullstack Developer",
    period: "October 2021 — August 2025",
    setting: "Onsite",
    summary:
      "Built enterprise multi-finance systems, optimised batch processing and databases, and modernised web applications for nationwide finance operations.",
    highlights: [
      "Developed and tuned daily closing batch jobs in PL/SQL running across 98 branches nationwide, processing millions of instalment-payment transactions.",
      "Cut UAT closing runtime from about 20 minutes to 1–5 minutes, and production runtime per batch of 10 branches from about 15 minutes to 7 minutes.",
      "Tuned queries and database packages to lower execution cost and remove recurring bottlenecks in batch processing.",
      "Reduced daily production incidents from 1–2 critical and around 3 medium-severity issues to only a few minor issues per month.",
      "Translated business requirements into backend services and web application features for enterprise finance systems.",
      "Migrated the application frontend from CodeIgniter to Next.js, improving maintainability and user experience.",
      "Optimised complex SQL and API response times to reduce database load and recurring performance issues.",
      "Developed and managed SSIS data pipelines for enterprise data integration.",
      "Managed builds and deployments across development and UAT environments using Jenkins, with OpenShift as the deployment platform.",
      "Used Jira for task management and Bitbucket for source control and collaborative development.",
      "Supported investigation and resolution of production issues, especially during deployments and critical finance processes.",
    ],
    areas: ["Enterprise Finance", "Database & Query Tuning", "Batch Processing", "SSIS", "Frontend Migration", "Production Support"],
  },
];

export const EDUCATION = {
  institution: "Universitas Teknokrat Indonesia, Bandar Lampung",
  degree: "Informatics",
  gpa: "GPA 3.53",
  period: "2017 — 2021",
};

export const TECH_INDEX: TechIndexGroup[] = [
  { label: "Backend Languages & Frameworks", items: ["Java", "Spring Boot", "ZK Framework", "Go", "Node.js", "Express.js", "CodeIgniter", "Laravel"] },
  { label: "Frontend", items: ["React.js", "Next.js"] },
  { label: "Database", items: ["PostgreSQL", "OracleDB (PL/SQL)", "MySQL", "Firebase", "Supabase", "MongoDB"] },
  { label: "Data & Integration", items: ["REST API", "SSIS", "GraphQL", "Apache Kafka", "Redis"] },
  { label: "Tools & Platform", items: ["Jenkins", "OpenShift", "Git", "Bitbucket", "Jira", "Postman"] },
  { label: "Infrastructure", items: ["Nginx", "CI/CD Pipeline"] },
];
