// Domain logic for tile status. Everything here is pure: same input, same output,
// no I/O, no React. The status is DERIVED from a value and its limits, never stored.

export type Status = "ok" | "warn" | "crit";

export type Limits = {
  critLow?: number;
  warnLow?: number;
  warnHigh?: number;
  critHigh?: number;
};

/**
 * Derives the status of a value from its limits.
 * Sides that are not set (`undefined`) are ignored, so one function covers
 * "too high" (CPU), "too low" (uptime) and "both" (temperature).
 * The most severe rule wins, hence critical is checked before warning.
 */
export function getStatus(value: number, l: Limits = {}): Status {
  if (l.critLow !== undefined && value <= l.critLow) return "crit";
  if (l.critHigh !== undefined && value >= l.critHigh) return "crit";
  if (l.warnLow !== undefined && value <= l.warnLow) return "warn";
  if (l.warnHigh !== undefined && value >= l.warnHigh) return "warn";
  return "ok";
}

/**
 * Compile-time exhaustiveness check. If a new member is added to `Status` and a
 * `switch` forgets it, the argument is no longer `never` and TypeScript fails the build.
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled union member: ${JSON.stringify(value)}`);
}

/** Higher number = more severe. */
export function severityRank(status: Status): number {
  switch (status) {
    case "crit":
      return 2;
    case "warn":
      return 1;
    case "ok":
      return 0;
    default:
      return assertNever(status);
  }
}

/** Comparator: negative if `a` is more severe than `b` (critical first). */
export function compareBySeverity(a: Status, b: Status): number {
  return severityRank(b) - severityRank(a);
}

/** The more severe of two statuses. Usable as a `reduce` callback. */
export function worstStatus(a: Status, b: Status): Status {
  return compareBySeverity(a, b) <= 0 ? a : b;
}

type Measured = { value: number; limits?: Limits };

/** Attaches the derived status to any item that has a value and optional limits. */
export function withStatus<T extends Measured>(item: T): T & { status: Status } {
  return { ...item, status: getStatus(item.value, item.limits) };
}

/** Sorts by severity (critical first), then by title for a stable, predictable order. */
export function sortBySeverity<T extends { status: Status; title: string }>(
  items: readonly T[],
): T[] {
  return [...items].sort(
    (a, b) => compareBySeverity(a.status, b.status) || a.title.localeCompare(b.title, "de"),
  );
}

export type StatusCounts = Record<Status, number>;

export type StatusSummary = {
  /** The worst status of all items ("ok" if there are none). */
  overall: Status;
  counts: StatusCounts;
  total: number;
};

/** Folds many statuses into one overall status plus per-status counts. */
export function summarize(statuses: readonly Status[]): StatusSummary {
  const counts = statuses.reduce<StatusCounts>(
    (acc, status) => ({ ...acc, [status]: acc[status] + 1 }),
    { ok: 0, warn: 0, crit: 0 },
  );
  const overall = statuses.reduce<Status>(worstStatus, "ok");
  return { overall, counts, total: statuses.length };
}
