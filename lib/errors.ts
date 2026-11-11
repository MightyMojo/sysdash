// One error type for everything that can go wrong while loading remote data.
// `kind` is machine-readable, `message` is safe to show to the user (German UI).

export type DataErrorKind =
  | "config" // server has no API key configured
  | "auth" // API key rejected
  | "rate-limit" // HTTP 429
  | "timeout"
  | "network" // offline, DNS, CORS, …
  | "upstream" // the data provider failed (5xx, 404, …)
  | "parse"; // response was not in the expected format

const MESSAGES: Record<DataErrorKind, string> = {
  config: "Der API-Key ist nicht konfiguriert. Bitte OPENWEATHER_API_KEY in .env.local setzen.",
  auth: "Der API-Key wurde vom Anbieter abgelehnt. Bitte Key prüfen.",
  "rate-limit": "Zu viele Anfragen. Bitte einen Moment warten und erneut versuchen.",
  timeout: "Die Anfrage hat zu lange gedauert. Bitte erneut versuchen.",
  network: "Keine Verbindung. Bitte Netzwerk prüfen und erneut versuchen.",
  upstream: "Der Datenanbieter ist gerade nicht erreichbar. Bitte später erneut versuchen.",
  parse: "Die Antwort des Datenanbieters konnte nicht gelesen werden.",
};

export class DataError extends Error {
  readonly kind: DataErrorKind;

  constructor(kind: DataErrorKind, options?: ErrorOptions) {
    super(MESSAGES[kind], options);
    this.name = "DataError";
    this.kind = kind;
  }
}

/** Normalises anything that was thrown into a `DataError`. */
export function toDataError(error: unknown): DataError {
  if (error instanceof DataError) return error;
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new DataError("timeout", { cause: error });
  }
  return new DataError("network", { cause: error });
}

// --- Contract between our API routes (server) and the browser -------------

export type ApiErrorCode = "missing-key" | "invalid-key" | "rate-limit" | "timeout" | "upstream";

export const API_ERROR_STATUS: Record<ApiErrorCode, number> = {
  "missing-key": 503,
  "invalid-key": 502,
  "rate-limit": 429,
  timeout: 504,
  upstream: 502,
};

export function kindFromApiError(code: ApiErrorCode): DataErrorKind {
  switch (code) {
    case "missing-key":
      return "config";
    case "invalid-key":
      return "auth";
    case "rate-limit":
      return "rate-limit";
    case "timeout":
      return "timeout";
    case "upstream":
      return "upstream";
  }
}

export function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && value in API_ERROR_STATUS;
}
