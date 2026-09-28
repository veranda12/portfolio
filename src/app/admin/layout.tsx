import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";
import { siteUrl } from "@/lib/site-url";

// Root layout for the admin panel (Indonesian only, never indexed).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Admin · RenCodes", template: "%s · RenCodes" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="id">{children}</RootDocument>;
}
