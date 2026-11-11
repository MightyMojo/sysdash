import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  /** Controls on the right of the heading, e.g. the refresh button. */
  actions?: ReactNode;
  busy?: boolean;
  children: ReactNode;
};

export default function Section({ id, title, description, actions, busy, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} aria-busy={busy} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 id={headingId} className="text-xl font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="text-sm text-ink-muted">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
