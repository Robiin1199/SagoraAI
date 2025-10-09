import { AlertTriangle, LineChart, ShieldCheck } from "lucide-react";

import { CashScenario } from "@/lib/api/cash";

interface CashScenariosProps {
  scenarios: CashScenario[];
}

const scenarioIconMap: Record<CashScenario["variant"], typeof LineChart> = {
  BASE: LineChart,
  STRESS: AlertTriangle,
  GROWTH: ShieldCheck,
  CUSTOM: LineChart
};

export function CashScenarios({ scenarios }: CashScenariosProps) {
  if (!scenarios?.length) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
        Aucun scénario disponible pour l’instant.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {scenarios.map((scenario) => {
        const Icon = scenarioIconMap[scenario.variant] ?? LineChart;
        return (
          <article
            key={scenario.id}
            className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{scenario.name}</h4>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">{scenario.runwayLabel}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{scenario.narrative}</p>
            <div className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
              <span className="font-semibold text-primary-500">{scenario.deltaLabel}</span>
              <span className="font-medium text-slate-500 dark:text-slate-300">{scenario.riskNarrative}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
