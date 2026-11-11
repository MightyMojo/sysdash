import { describeCounts } from "@/lib/format";
import type { StatusSummary } from "@/lib/status";
import StatusBadge from "./StatusBadge";
import { describeStatus } from "./statusPresentation";

type DashboardHeaderProps = {
  summary: StatusSummary;
  /** Sources that are still loading or failed — the summary must not pretend to be complete. */
  loadingSources: number;
  failedSources: number;
};

export default function DashboardHeader({
  summary,
  loadingSources,
  failedSources,
}: DashboardHeaderProps) {
  const { overall, counts, total } = summary;
  const presentation = describeStatus(overall);

  const notes = [
    loadingSources > 0 && `${loadingSources} ${loadingSources === 1 ? "Quelle lädt" : "Quellen laden"} noch`,
    failedSources > 0 &&
      `${failedSources} ${failedSources === 1 ? "Quelle nicht verfügbar" : "Quellen nicht verfügbar"}`,
  ].filter((note): note is string => typeof note === "string");

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">SysDash</h1>
        <p className="text-ink-muted">System status at a glance</p>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col gap-2 rounded-card border p-4 sm:flex-row sm:items-center sm:gap-4 ${presentation.card}`}
      >
        <StatusBadge status={overall} label={`Gesamtstatus: ${presentation.label}`} size="lg" />
        <div className="text-sm">
          <p className="font-medium text-ink">
            {total > 0 ? describeCounts(counts) : "Noch keine Messwerte"}
          </p>
          {notes.length > 0 && <p className="text-ink-muted">{notes.join(" · ")}</p>}
        </div>
      </div>
    </header>
  );
}
