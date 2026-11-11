import type { Status } from "@/lib/status";
import { StatusIcon } from "./icons";
import { describeStatus } from "./statusPresentation";

type StatusBadgeProps = {
  status: Status;
  /** Overrides the default word, e.g. "Gesamtstatus: Kritisch". */
  label?: string;
  size?: "md" | "lg";
};

export default function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const presentation = describeStatus(status);
  const sizing = size === "lg" ? "gap-2 px-4 py-1.5 text-base" : "gap-1.5 px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border font-semibold ${sizing} ${presentation.badge}`}
    >
      <StatusIcon status={status} className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {label ?? presentation.label}
    </span>
  );
}
