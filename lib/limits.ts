import type { Limits } from "@/lib/status";

// Limits for the real-data tiles. Only metrics where "too much / too little" is
// meaningful get limits; plain readings (humidity, pressure, …) stay informational.

/** Wind in km/h: ~50 km/h = strong wind, ~75 km/h = storm. */
export const WIND_LIMITS_KMH: Limits = { warnHigh: 50, critHigh: 75 };

/** Visibility in km: ≤ 4.8 km (3 mi) = IFR conditions, ≤ 1.6 km (1 mi) = LIFR. Low is bad. */
export const VISIBILITY_LIMITS_KM: Limits = { critLow: 1.6, warnLow: 4.8 };
