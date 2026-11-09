import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface PageHeadingProps {
  actions?: ReactNode;
  className?: string;
  description: string;
  meta?: ReactNode;
  title: string;
}

export function PageHeading({
  actions,
  className,
  description,
  meta,
  title,
}: PageHeadingProps) {
  return (
    <header
      className={cn(
        "mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight text-text-strong">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-text-muted">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta ? <div className="text-xs text-text-muted">{meta}</div> : null}
        {actions}
      </div>
    </header>
  );
}
