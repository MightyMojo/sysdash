import type { System } from "@/data/systems";
import { DataError } from "@/lib/errors";
import { round } from "@/lib/guards";
import { VISIBILITY_LIMITS_KM, WIND_LIMITS_KMH } from "@/lib/limits";
import type { Report } from "@/lib/report";

const KT_TO_KMH = 1.852;
const MILES_TO_KM = 1.609344;
const INHG_TO_HPA = 33.8639;

/**
 * Parses an aviationweather.gov METAR response (XML) in the browser with `DOMParser`.
 * METAR fields are optional and vary per station (no gusts, "VRB" wind direction,
 * visibility like "6+", …), so every value is read defensively.
 * Returns zero tiles when the station has no report (→ empty state in the UI).
 */
export function parseMetar(xml: string): Report {
  if (xml.trim() === "") return { tiles: [] };

  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new DataError("parse");

  const metar = doc.querySelector("METAR");
  if (!metar) return { tiles: [] };

  const text = (tag: string): string | undefined => {
    const content = metar.querySelector(tag)?.textContent?.trim();
    return content ? content : undefined;
  };
  // parseFloat (not Number) so "6+" → 6; non-numeric values like "VRB" → undefined.
  const num = (tag: string): number | undefined => {
    const content = text(tag);
    if (content === undefined) return undefined;
    const value = Number.parseFloat(content);
    return Number.isFinite(value) ? value : undefined;
  };

  const tiles: System[] = [];

  const temp = num("temp_c");
  if (temp !== undefined) {
    tiles.push({ id: "metar-temp", title: "Temperatur", value: round(temp), unit: "°C" });
  }

  const wind = num("wind_speed_kt");
  if (wind !== undefined) {
    tiles.push({
      id: "metar-wind",
      title: "Wind",
      value: round(wind * KT_TO_KMH),
      unit: "km/h",
      limits: WIND_LIMITS_KMH,
    });
  }

  const gust = num("wind_gust_kt");
  if (gust !== undefined) {
    tiles.push({
      id: "metar-gust",
      title: "Böen",
      value: round(gust * KT_TO_KMH),
      unit: "km/h",
      limits: WIND_LIMITS_KMH,
    });
  }

  const visibilityMiles = num("visibility_statute_mi");
  if (visibilityMiles !== undefined) {
    tiles.push({
      id: "metar-visibility",
      title: "Sicht",
      value: round(visibilityMiles * MILES_TO_KM),
      unit: "km",
      limits: VISIBILITY_LIMITS_KM,
    });
  }

  // Prefer the reported QNH/sea-level pressure in hPa, fall back to the altimeter setting (inHg).
  const seaLevel = num("sea_level_pressure_mb");
  const altimeter = num("altim_in_hg");
  const pressure = seaLevel ?? (altimeter !== undefined ? altimeter * INHG_TO_HPA : undefined);
  if (pressure !== undefined) {
    tiles.push({ id: "metar-pressure", title: "Luftdruck", value: round(pressure, 0), unit: "hPa" });
  }

  return { tiles, caption: describeReport(text("station_id"), text("flight_category"), text("observation_time")) };
}

function describeReport(station?: string, category?: string, observedAt?: string): string {
  const parts = [station, category && `Kategorie ${category}`];
  if (observedAt) {
    const date = new Date(observedAt);
    if (!Number.isNaN(date.getTime())) {
      const time = date.toLocaleTimeString("de-CH", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Zurich",
      });
      parts.push(`Messung ${time} Uhr`);
    }
  }
  parts.push("aviationweather.gov (XML)");
  return parts.filter(Boolean).join(" · ");
}
