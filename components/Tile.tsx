import type { System } from "@/data/systems";
import { describeLimits, formatValue } from "@/lib/format";
import type { Status } from "@/lib/status";
import StatusBadge from "./StatusBadge";
import { describeStatus } from "./statusPresentation";

// A system plus its derived status. The status is computed (lib/status.ts), never stored.
export type EvaluatedSystem = System & { status: Status };

type TileProps = {
  system: EvaluatedSystem;
};

export default function Tile({ system }: TileProps) {
  const { id, title, value, unit, limits, status } = system;
  const presentation = describeStatus(status);
  const limitsText = describeLimits(limits, unit);
  const headingId = `tile-${id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={`flex h-full flex-col gap-4 rounded-card border p-6 ${presentation.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 id={headingId} className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
          {title}
        </h3>
        <StatusBadge status={status} />
      </div>

      <p className={`text-4xl font-bold tabular-nums ${presentation.value}`}>
        {formatValue(value)}{" "}
        <span className="text-base font-medium text-ink-muted">{unit}</span>
      </p>

      {limitsText && <p className="mt-auto text-sm text-ink-muted">{limitsText}</p>}
    </article>
  );
}
