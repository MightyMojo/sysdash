import { apiErrorResponse, fetchUpstream, noStore } from "@/lib/upstream";

const CITY = "Luzern";

// Proxy for OpenWeatherMap (JSON). The key stays on the server (OPENWEATHER_API_KEY).
export async function GET(): Promise<Response> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return apiErrorResponse("missing-key");

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({ q: CITY, units: "metric", lang: "de", appid: key }).toString();

  const result = await fetchUpstream(url, { accept: "application/json", keyed: true });
  if (!result.ok) return apiErrorResponse(result.code);

  return new Response(result.body, {
    headers: { "Content-Type": "application/json; charset=utf-8", ...noStore },
  });
}
