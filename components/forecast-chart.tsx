import { formatCurrency } from "@/lib/utils";

export interface ForecastChartPoint {
  label: string;
  value: number;
}

interface ForecastChartProps {
  points: ForecastChartPoint[];
  currency?: string;
}

export function ForecastChart({ points, currency = "EUR" }: ForecastChartProps) {
  if (!points?.length) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
        Données prévisionnelles indisponibles
      </div>
    );
  }

  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));

  const chartPoints = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = max === min ? 50 : ((max - point.value) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="h-48 w-full">
        <defs>
          <linearGradient id="cashGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4C8BFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4C8BFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${chartPoints} 100,100`}
          fill="url(#cashGradient)"
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={chartPoints}
          fill="none"
          stroke="#1C5DFF"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className="grid gap-2 text-[10px] uppercase tracking-wider text-slate-400"
        style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
      >
        {points.map((point) => (
          <span key={point.label} className="text-center">
            {point.label}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-end text-xs text-slate-400 dark:text-slate-500">
        <span>Valeurs en {formatCurrency(1, currency).replace(/[0-9.,\s]+$/, "").trim() || currency}</span>
      </div>
    </div>
  );
}
