import { ReactNode } from "react";
import { cn, formatCurrency, formatDelta } from "@/lib/utils";

interface HighlightMetricProps {
  label: string;
  value: number;
  currency?: string;
  delta?: number;
  icon: ReactNode;
  color?: "primary" | "success" | "warning" | "danger";
  description?: string;
  valueFormatter?: (value: number) => string;
}

export function HighlightMetric({
  label,
  value,
  currency = "EUR",
  delta,
  icon,
  color = "primary",
  description,
  valueFormatter
}: HighlightMetricProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
      <div
        className={cn(
          "absolute inset-x-4 top-4 h-12 rounded-3xl opacity-20 blur-2xl",
          color === "primary" && "bg-primary-500",
          color === "success" && "bg-success",
          color === "warning" && "bg-warning",
          color === "danger" && "bg-danger"
        )}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
            {valueFormatter ? valueFormatter(value) : formatCurrency(value, currency)}
          </p>
          {delta !== undefined && (
            <p className="mt-1 text-sm font-medium text-success">
              {formatDelta(delta)} sur 30 jours
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
            color === "primary" && "from-primary-400 to-primary-600",
            color === "success" && "from-success to-green-700",
            color === "warning" && "from-warning to-amber-500",
            color === "danger" && "from-danger to-rose-600"
          )}
        >
          {icon}
        </div>
      </div>
      {description && <p className="relative mt-4 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}
