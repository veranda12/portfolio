// Build a wa.me link from a raw number setting. Returns null if not configured,
// so callers can gracefully hide WhatsApp UI until the number is set in admin.
export function waLink(rawNumber: string | undefined, text?: string): string | null {
  if (!rawNumber) return null;
  const digits = rawNumber.replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
