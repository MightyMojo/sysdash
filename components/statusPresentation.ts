import { assertNever, type Status } from "@/lib/status";

// Single source of truth for how a status LOOKS. Every case of the `Status` union is handled;
// if a member is added, `assertNever` turns the missing case into a compile error.
// Tailwind classes are written out in full so the compiler can see them.

export type StatusPresentation = {
  /** Word shown next to the icon — status is never conveyed by colour alone. */
  label: string;
  /** Pill/badge classes. */
  badge: string;
  /** Card classes (border, background, emphasis). */
  card: string;
  /** Colour of the big number. */
  value: string;
};

export function describeStatus(status: Status): StatusPresentation {
  switch (status) {
    case "ok":
      return {
        label: "OK",
        badge: "border-ok/40 bg-ok-surface text-ok",
        card: "border-line bg-surface",
        value: "text-ink",
      };
    case "warn":
      return {
        label: "Warnung",
        badge: "border-warn/50 bg-warn-surface text-warn",
        card: "border-warn/60 bg-surface",
        value: "text-warn",
      };
    case "crit":
      return {
        label: "Kritisch",
        // Solid badge + thick border + ring: critical must stand out at a glance.
        badge: "border-crit bg-crit text-on-crit",
        card: "border-crit bg-crit-surface ring-2 ring-crit/60",
        value: "text-crit-ink",
      };
    default:
      return assertNever(status);
  }
}
