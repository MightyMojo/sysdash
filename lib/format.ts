import type { Limits, StatusCounts } from "@/lib/status";

const numberFormat = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 2 });

export function formatValue(value: number): string {
  return numberFormat.format(value);
}

/** "Warnung ≥ 75 % · Kritisch ≥ 90 %" — states the rules a tile's status comes from. */
export function describeLimits(limits: Limits | undefined, unit: string): string | undefined {
  if (!limits) return undefined;
  const rule = (label: string, op: "≤" | "≥", value: number | undefined): string[] =>
    value === undefined ? [] : [`${label} ${op} ${formatValue(value)} ${unit}`];

  const parts = [
    ...rule("Kritisch", "≤", limits.critLow),
    ...rule("Warnung", "≤", limits.warnLow),
    ...rule("Warnung", "≥", limits.warnHigh),
    ...rule("Kritisch", "≥", limits.critHigh),
  ];
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

/** "1 kritisch, 2 Warnungen, 3 in Ordnung" — empty counts are left out. */
export function describeCounts(counts: StatusCounts): string {
  const parts: string[] = [];
  if (counts.crit > 0) parts.push(`${counts.crit} kritisch`);
  if (counts.warn > 0) parts.push(`${counts.warn} ${counts.warn === 1 ? "Warnung" : "Warnungen"}`);
  if (counts.ok > 0) parts.push(`${counts.ok} in Ordnung`);
  return parts.join(", ");
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
