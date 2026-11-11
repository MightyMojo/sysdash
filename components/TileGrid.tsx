import type { System } from "@/data/systems";
import { sortBySeverity, withStatus } from "@/lib/status";
import Tile from "./Tile";

// 375 px → 1 column, 1024 px → 2 columns (md ≥ 768, xl ≥ 1280), 1440 px → 3 columns.
export const GRID_CLASSES = "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3";

/** Derives each tile's status, then renders them most severe first. */
export default function TileGrid({ systems }: { systems: readonly System[] }) {
  const tiles = sortBySeverity(systems.map(withStatus));

  return (
    <ul role="list" className={GRID_CLASSES}>
      {tiles.map((tile) => (
        <li key={tile.id}>
          <Tile system={tile} />
        </li>
      ))}
    </ul>
  );
}
