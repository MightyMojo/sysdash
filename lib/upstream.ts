// Server-side helpers for the API routes that proxy third-party data.
// Why proxy at all? aviationweather.gov sends no CORS headers (a browser fetch would be blocked)
// and the OpenWeatherMap key must not end up in the client bundle.

import { API_ERROR_STATUS, type ApiErrorCode } from "@/lib/errors";

const UPSTREAM_TIMEOUT_MS = 8_000;

export function apiErrorResponse(code: ApiErrorCode): Response {
  return Response.json({ error: code }, { status: API_ERROR_STATUS[code], headers: noStore });
}

export const noStore = { "Cache-Control": "no-store" } as const;

type UpstreamResult = { ok: true; body: string } | { ok: false; code: ApiErrorCode };

/**
 * Fetches `url` with a timeout and maps every failure to an `ApiErrorCode`.
 * The upstream URL (which may contain a key) is never logged or returned.
 */
export async function fetchUpstream(
  url: URL,
  options: { accept: string; keyed?: boolean },
): Promise<UpstreamResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: options.accept, "User-Agent": "sysdash/0.1 (course project)" },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    return { ok: false, code: isTimeout ? "timeout" : "upstream" };
  }

  if (response.status === 429) return { ok: false, code: "rate-limit" };
  if (options.keyed && response.status === 401) return { ok: false, code: "invalid-key" };
  if (!response.ok) return { ok: false, code: "upstream" };

  try {
    return { ok: true, body: await response.text() };
  } catch {
    return { ok: false, code: "upstream" };
  }
}
