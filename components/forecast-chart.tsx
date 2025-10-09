const dataPoints = [
  { day: "J0", value: 720000 },
  { day: "J7", value: 695000 },
  { day: "J14", value: 670000 },
  { day: "J30", value: 640000 },
  { day: "J45", value: 625000 },
  { day: "J60", value: 610000 },
  { day: "J75", value: 602000 },
  { day: "J90", value: 598000 }
];

export function ForecastChart() {
  const max = Math.max(...dataPoints.map((p) => p.value));
  const min = Math.min(...dataPoints.map((p) => p.value));
  const points = dataPoints
    .map((point, index) => {
      const x = (index / (dataPoints.length - 1)) * 100;
      const y = ((max - point.value) / (max - min)) * 100;
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
          points={`0,100 ${points} 100,100`}
          fill="url(#cashGradient)"
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#1C5DFF"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="grid grid-cols-8 gap-2 text-[10px] uppercase tracking-wider text-slate-400">
        {dataPoints.map((point) => (
          <span key={point.day} className="text-center">
            {point.day}
          </span>
        ))}
      </div>
    </div>
  );
}
