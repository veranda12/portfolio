import { notFound } from "next/navigation";

// Any unknown public URL (in either language) renders [lang]/not-found.tsx
// inside the site layout, with nav and footer.
export default function CatchAll() {
  notFound();
}
