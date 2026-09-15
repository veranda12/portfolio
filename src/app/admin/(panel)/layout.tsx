import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = await prisma.contactMessage.count({ where: { status: "unread" } });

  return (
    <div className="min-h-screen bg-console-2 text-paper md:flex">
      <AdminNav userName={session.name} unread={unread} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">{children}</div>
      </div>
    </div>
  );
}
