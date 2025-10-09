const rows = [
  {
    metric: "DSO",
    value: 54,
    target: 45,
    variance: +9,
    impact: "-210 k€ de trésorerie"
  },
  {
    metric: "DPO",
    value: 42,
    target: 45,
    variance: -3,
    impact: "+90 k€ de trésorerie"
  },
  {
    metric: "DIO",
    value: 38,
    target: 30,
    variance: +8,
    impact: "Stock dormant 410 k€"
  }
];

export function BfrTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-primary-50/80 text-left text-xs font-semibold uppercase tracking-wider text-primary-700 dark:bg-primary-900/20 dark:text-primary-200">
          <tr>
            <th className="px-6 py-4">Indicateur</th>
            <th className="px-6 py-4">Valeur</th>
            <th className="px-6 py-4">Objectif</th>
            <th className="px-6 py-4">Écart</th>
            <th className="px-6 py-4">Impact Cash</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.metric} className="border-t border-slate-200/40 bg-white/60 text-slate-700 transition hover:bg-white dark:border-slate-800/80 dark:bg-transparent dark:text-slate-200">
              <td className="px-6 py-4 font-medium">{row.metric}</td>
              <td className="px-6 py-4">{row.value} jours</td>
              <td className="px-6 py-4">{row.target} jours</td>
              <td className="px-6 py-4 font-semibold text-danger">
                {row.variance > 0 ? `+${row.variance}` : row.variance} jours
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{row.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
