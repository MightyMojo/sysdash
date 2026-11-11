import { apiErrorResponse, fetchUpstream, noStore } from "@/lib/upstream";

const DEFAULT_STATION = "LSZH"; // Zürich; LSGG = Genf

// Proxy for aviationweather.gov (XML, no key). The XML is returned untouched —
// parsing happens in the browser with DOMParser.
export async function GET(request: Request): Promise<Response> {
  const requested = new URL(request.url).searchParams.get("ids") ?? DEFAULT_STATION;
  // Only a plain ICAO code is allowed, so this route cannot be abused as an open proxy.
  const station = /^[A-Z]{4}$/.test(requested) ? requested : DEFAULT_STATION;

  const url = new URL("https://aviationweather.gov/api/data/metar");
  url.search = new URLSearchParams({ ids: station, format: "xml" }).toString();

  const result = await fetchUpstream(url, { accept: "application/xml" });
  if (!result.ok) return apiErrorResponse(result.code);

  return new Response(result.body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", ...noStore },
  });
}
