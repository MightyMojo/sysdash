// Small type guards so untrusted API data can be read without `any`.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Walks `path` through nested objects; returns `undefined` as soon as anything is missing. */
function readPath(root: unknown, path: readonly string[]): unknown {
  let current: unknown = root;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
}

/** A finite number at `path`, or `undefined` (missing, null, NaN, wrong type). */
export function readNumber(root: unknown, ...path: string[]): number | undefined {
  const value = readPath(root, path);
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** A non-empty string at `path`, or `undefined`. */
export function readString(root: unknown, ...path: string[]): string | undefined {
  const value = readPath(root, path);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

export function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
