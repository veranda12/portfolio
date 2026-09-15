import { prisma } from "@/lib/db";
import { MessageCard } from "@/components/admin/MessageCard";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "inbox" } = await searchParams;

  const where =
    filter === "unread"
      ? { status: "unread" }
      : filter === "archived"
        ? { status: "archived" }
        : { status: { in: ["unread", "read"] } };

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.contactMessage.groupBy({ by: ["status"], _count: true }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const filters = [
    { key: "inbox", label: "Inbox" },
    { key: "unread", label: `Unread (${countMap.unread ?? 0})` },
    { key: "archived", label: `Archived (${countMap.archived ?? 0})` },
  ];

  return (
    <div>
      <div className="border-b border-console-line pb-6">
        <p className="font-mono text-[0.66rem] uppercase tracking-label text-signal">Enquiries</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Messages</h1>
      </div>

      <div className="mt-5 flex gap-2">
        {filters.map((f) => (
          <a
            key={f.key}
            href={`/admin/messages?filter=${f.key}`}
            className={`px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-label transition-colors ${
              filter === f.key ? "bg-console-2 text-paper" : "text-paper/40 hover:text-paper"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((m) => (
          <MessageCard key={m.id} m={m} />
        ))}
        {messages.length === 0 ? (
          <p className="border border-console-line bg-console px-4 py-12 text-center font-mono text-xs text-paper/40">
            No messages here.
          </p>
        ) : null}
      </div>
    </div>
  );
}
