// Browser-side loaders. They call our own API routes and turn the responses into `Report`s.
// All failure modes (offline, timeout, 429, bad payload) end up as a `DataError`.

import { DataError, isApiErrorCode, kindFromApiError, toDataError } from "@/lib/errors";
import { isRecord } from "@/lib/guards";
import { parseMetar } from "@/lib/metar";
import type { Report } from "@/lib/report";
import { parseWeather } from "@/lib/weather";

const REQUEST_TIMEOUT_MS = 10_000;

async function request(url: string, signal: AbortSignal): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.any([signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
    });
  } catch (error) {
    if (signal.aborted) throw error; // cancelled by us (unmount / new request) — not an error to show
    throw toDataError(error);
  }

  if (!response.ok) throw await errorFromResponse(response);
  return response;
}

async function errorFromResponse(response: Response): Promise<DataError> {
  try {
    const body: unknown = await response.json();
    if (isRecord(body) && isApiErrorCode(body.error)) {
      return new DataError(kindFromApiError(body.error));
    }
  } catch {
    // body was not JSON — fall through to the status-based mapping
  }
  return new DataError(response.status === 429 ? "rate-limit" : "upstream");
}

export async function loadWeather(signal: AbortSignal): Promise<Report> {
  const response = await request("/api/weather", signal);
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    if (signal.aborted) throw error;
    throw new DataError("parse", { cause: error });
  }
  return parseWeather(payload);
}

export const METAR_STATION = "LSZH";

export async function loadMetar(signal: AbortSignal): Promise<Report> {
  const response = await request(`/api/metar?ids=${METAR_STATION}`, signal);
  let xml: string;
  try {
    xml = await response.text();
  } catch (error) {
    if (signal.aborted) throw error;
    throw toDataError(error);
  }
  return parseMetar(xml);
}
