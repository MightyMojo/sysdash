import type { RemoteState } from "@/hooks/useRemoteData";
import { formatTime } from "@/lib/format";
import type { Report } from "@/lib/report";
import { assertNever } from "@/lib/status";
import RefreshButton from "./RefreshButton";
import Section from "./Section";
import TileGrid, { GRID_CLASSES } from "./TileGrid";

type DataSectionProps = {
  id: string;
  title: string;
  /** Shown while there is no caption from the data itself (loading / error). */
  fallbackDescription: string;
  state: RemoteState<Report>;
  isFetching: boolean;
  onRefresh: () => void;
};

/** A group of tiles backed by a remote source, with loading, empty and error states. */
export default function DataSection({
  id,
  title,
  fallbackDescription,
  state,
  isFetching,
  onRefresh,
}: DataSectionProps) {
  return (
    <Section
      id={id}
      title={title}
      description={describe(state, fallbackDescription)}
      busy={isFetching}
      actions={<RefreshButton target={title} isRefreshing={isFetching} onRefresh={onRefresh} />}
    >
      <Content state={state} />
    </Section>
  );
}

function describe(state: RemoteState<Report>, fallback: string): string {
  switch (state.phase) {
    case "loading":
    case "error":
      return fallback;
    case "success": {
      const caption = state.data.caption ?? fallback;
      return `${caption} · Stand ${formatTime(state.updatedAt)}`;
    }
    default:
      return assertNever(state);
  }
}

function Content({ state }: { state: RemoteState<Report> }) {
  switch (state.phase) {
    case "loading":
      return <LoadingState />;
    case "error":
      return <ErrorState message={state.error.message} />;
    case "success":
      return state.data.tiles.length === 0 ? <EmptyState /> : <TileGrid systems={state.data.tiles} />;
    default:
      return assertNever(state);
  }
}

function LoadingState() {
  return (
    <div role="status">
      <span className="sr-only">Daten werden geladen …</span>
      <div aria-hidden="true" className={GRID_CLASSES}>
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className="h-40 rounded-card border border-line bg-surface motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
      <p className="font-semibold text-ink">Keine Messwerte verfügbar</p>
      <p className="mt-1 text-sm text-ink-muted">
        Die Quelle hat aktuell keine Daten geliefert. Mit „Aktualisieren“ erneut laden.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-card border-2 border-crit bg-crit-surface p-6">
      <p className="font-semibold text-crit-ink">Daten konnten nicht geladen werden</p>
      <p className="mt-1 text-sm text-ink">{message}</p>
    </div>
  );
}
