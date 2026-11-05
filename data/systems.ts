// Mock system data for the dashboard.
// We replace this list with real API data later in the course.
export type System = {
  id: string;
  title: string;
  value: number;
  unit: string;
};

export const systems: System[] = [
  { id: "cpu", title: "CPU Load", value: 42, unit: "%" },
  { id: "ram", title: "Memory", value: 71, unit: "%" },
  { id: "disk", title: "Disk", value: 88, unit: "%" },
  { id: "temp", title: "Temperature", value: 56, unit: "°C" },
  { id: "net", title: "Network", value: 12, unit: "MB/s" },
  { id: "uptime", title: "Uptime", value: 99.9, unit: "%" },
];
