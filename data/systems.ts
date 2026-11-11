import type { Limits } from "@/lib/status";

// A single dashboard metric. Note: there is deliberately NO `status` field —
// the status is derived from `value` and `limits` (see lib/status.ts).
export type System = {
  id: string;
  title: string;
  value: number;
  unit: string;
  limits?: Limits;
};

// Mock system data. Values are chosen so that all three states show up.
export const systems: System[] = [
  { id: "cpu", title: "CPU Load", value: 92, unit: "%", limits: { warnHigh: 75, critHigh: 90 } },
  { id: "ram", title: "Memory", value: 83, unit: "%", limits: { warnHigh: 80, critHigh: 95 } },
  { id: "disk", title: "Disk", value: 61, unit: "%", limits: { warnHigh: 80, critHigh: 95 } },
  {
    id: "temp",
    title: "Temperature",
    value: 56,
    unit: "°C",
    limits: { critLow: 5, warnLow: 10, warnHigh: 65, critHigh: 80 },
  },
  { id: "net", title: "Network", value: 12, unit: "MB/s", limits: { warnHigh: 90, critHigh: 100 } },
  { id: "uptime", title: "Uptime", value: 99.3, unit: "%", limits: { critLow: 99.0, warnLow: 99.5 } },
];
