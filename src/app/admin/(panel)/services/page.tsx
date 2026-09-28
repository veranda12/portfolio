import { prisma } from "@/lib/db";
import { ServiceManager } from "@/components/admin/ServiceManager";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="border-b border-rule pb-6">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Content</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Services</h1>
        <p className="mt-2 font-mono text-[0.66rem] text-ink-faint">
          The &ldquo;What I build&rdquo; section on the home page.
        </p>
      </div>
      <ServiceManager services={services} />
    </div>
  );
}
