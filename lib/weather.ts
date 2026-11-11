import type { System } from "@/data/systems";
import { DataError } from "@/lib/errors";
import { isRecord, readNumber, readString, round } from "@/lib/guards";
import { WIND_LIMITS_KMH } from "@/lib/limits";
import type { Report } from "@/lib/report";

const MS_TO_KMH = 3.6;

/**
 * Turns an OpenWeatherMap "current weather" payload (JSON, units=metric) into tiles.
 * Nothing is assumed: every field is optional, a tile is only created if its value exists.
 * Temperature, humidity and wind are the core values; gusts, rain and pressure are bonus.
 */
export function parseWeather(raw: unknown): Report {
  if (!isRecord(raw)) throw new DataError("parse");

  const tiles: System[] = [];

  const temp = readNumber(raw, "main", "temp");
  if (temp !== undefined) {
    tiles.push({ id: "wx-temp", title: "Temperatur", value: round(temp), unit: "°C" });
  }

  const humidity = readNumber(raw, "main", "humidity");
  if (humidity !== undefined) {
    tiles.push({ id: "wx-humidity", title: "Luftfeuchte", value: round(humidity, 0), unit: "%" });
  }

  const wind = readNumber(raw, "wind", "speed");
  if (wind !== undefined) {
    tiles.push({
      id: "wx-wind",
      title: "Wind",
      value: round(wind * MS_TO_KMH),
      unit: "km/h",
      limits: WIND_LIMITS_KMH,
    });
  }

  // `wind.gust` is only sent when there are gusts → no value, no tile.
  const gust = readNumber(raw, "wind", "gust");
  if (gust !== undefined) {
    tiles.push({
      id: "wx-gust",
      title: "Böen",
      value: round(gust * MS_TO_KMH),
      unit: "km/h",
      limits: WIND_LIMITS_KMH,
    });
  }

  // `rain` is omitted by the API when it does not rain. Only worth showing for a valid payload,
  // so "no rain" counts as 0 mm — but only if we have any other data at all.
  if (tiles.length > 0) {
    tiles.push({
      id: "wx-rain",
      title: "Niederschlag",
      value: round(readNumber(raw, "rain", "1h") ?? 0),
      unit: "mm/h",
    });
  }

  const pressure = readNumber(raw, "main", "pressure");
  if (pressure !== undefined) {
    tiles.push({ id: "wx-pressure", title: "Luftdruck", value: round(pressure, 0), unit: "hPa" });
  }

  const place = readString(raw, "name");
  return { tiles, caption: place ? `${place} · OpenWeatherMap (JSON)` : "OpenWeatherMap (JSON)" };
}
