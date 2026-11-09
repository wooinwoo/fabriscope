import type { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
  resultLabel: string;
  actions?: ReactNode;
}

export function FilterBar({ actions, children, resultLabel }: FilterBarProps) {
  return (
    <section
      className="flex flex-wrap items-end gap-x-3 gap-y-2 rounded-panel border border-border bg-surface px-4 py-3"
      aria-label="조회 조건"
    >
      {children}
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      <p className="ml-auto self-end pb-2 text-sm font-medium text-text" role="status">
        {resultLabel}
      </p>
    </section>
  );
}
