import type { ReactNode } from "react";
import { assertNever, type Status } from "@/lib/status";

// Decorative icons (aria-hidden): the meaning is always carried by adjacent text.

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? "h-4 w-4"}
    >
      {children}
    </svg>
  );
}

export function StatusIcon({ status, className }: IconProps & { status: Status }) {
  switch (status) {
    case "ok": // check in a circle
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12.5 2.8 2.8L16 9.5" />
        </Svg>
      );
    case "warn": // triangle with exclamation mark
      return (
        <Svg className={className}>
          <path d="M12 3.5 2.5 20h19L12 3.5Z" />
          <path d="M12 10v4.5M12 17.5h.01" />
        </Svg>
      );
    case "crit": // octagon with cross
      return (
        <Svg className={className}>
          <path d="M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2L8.2 3Z" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </Svg>
      );
    default:
      return assertNever(status);
  }
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </Svg>
  );
}
