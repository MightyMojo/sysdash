import type { System } from "@/data/systems";

/** What a data source delivers: tiles plus an optional one-line description. */
export type Report = {
  tiles: System[];
  caption?: string;
};
