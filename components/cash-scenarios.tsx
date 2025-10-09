import { AlertTriangle, LineChart, ShieldCheck } from "lucide-react";

const scenarios = [
  {
    name: "Base case",
    icon: LineChart,
    narrative: "Plan budgété Q2 aligné, factoring activé sur top clients.",
    runway: "6,4 mois",
    delta: "+0,3 mois vs semaine dernière",
    risk: "Risque maîtrisé"
  },
  {
    name: "Stress",
    icon: AlertTriangle,
    narrative: "Churn +2 pts, retard fournisseurs énergie non négocié.",
    runway: "4,9 mois",
    delta: "-1,1 mois",
    risk: "Activer plan BFR & revue coûts"
  },
  {
    name: "Growth",
    icon: ShieldCheck,
    narrative: "Upsell signé + renégociation DPO énergie à 45j.",
    runway: "8,2 mois",
    delta: "+1,8 mois",
    risk: "Capacité cash sécurisée"
  }
];

export function CashScenarios() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        return (
          <article
            key={scenario.name}
            className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-inner backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{scenario.name}</h4>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">{scenario.runway}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{scenario.narrative}</p>
            <div className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-400">
              <span className="font-semibold text-primary-500">{scenario.delta}</span>
              <span className="font-medium text-slate-500 dark:text-slate-300">{scenario.risk}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
