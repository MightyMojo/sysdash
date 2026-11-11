import { RefreshIcon } from "./icons";

type RefreshButtonProps = {
  /** What gets refreshed — read by screen readers after the visible word. */
  target: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

// A real <button>: focusable with Tab, triggered by Enter and Space — no extra key handling needed.
// While loading it uses aria-disabled instead of `disabled`, so keyboard focus is not lost mid-request.
export default function RefreshButton({ target, isRefreshing, onRefresh }: RefreshButtonProps) {
  return (
    <button
      type="button"
      aria-disabled={isRefreshing}
      onClick={() => {
        if (!isRefreshing) onRefresh();
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:bg-surface-raised aria-disabled:cursor-progress"
    >
      <RefreshIcon className={`h-4 w-4 ${isRefreshing ? "motion-safe:animate-spin" : ""}`} />
      {isRefreshing ? "Lädt …" : "Aktualisieren"}
      <span className="sr-only"> ({target})</span>
    </button>
  );
}
