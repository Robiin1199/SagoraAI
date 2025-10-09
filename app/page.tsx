import { ActionPlan } from "@/components/action-plan";
import { AcademyModules } from "@/components/academy-modules";
import { AlertFeed } from "@/components/alert-feed";
import { BfrTable } from "@/components/bfr-table";
import { ForecastChart } from "@/components/forecast-chart";
import { CashScenarios } from "@/components/cash-scenarios";
import { HighlightMetric } from "@/components/highlight-metric";
import { Roadmap } from "@/components/roadmap";
import { TopNav } from "@/components/top-nav";
import { formatCurrency } from "@/lib/utils";
import { Activity, ArrowUpRightSquare, Flame, Gauge, PiggyBank } from "lucide-react";

const runway = {
  cash: 718_450,
  burn: -112_300,
  runway: 6.4
};

const keyHighlights = [
  {
    label: "Cash disponible",
    value: 718_450,
    delta: 8.6,
    icon: <PiggyBank className="h-6 w-6" />,
    color: "primary" as const,
    description: "Toutes banques agrégées (BNP, Qonto, HSBC)."
  },
  {
    label: "Burn mensuel",
    value: -112_300,
    delta: -4.1,
    icon: <Flame className="h-6 w-6" />,
    color: "danger" as const,
    description: "Charges fixes + payroll + CAPEX planifié."
  },
  {
    label: "Runway",
    value: 6.4,
    icon: <Gauge className="h-6 w-6" />,
    color: "warning" as const,
    description: "Projection avec factoring activé sur clients Top 20.",
    valueFormatter: (value: number) => `${value.toFixed(1)} mois`
  }
];

const revenuePerformance = [
  {
    title: "MRR",
    value: formatCurrency(184_000),
    trend: "+6,2%",
    badge: "Saine"
  },
  {
    title: "ARPA",
    value: formatCurrency(2_850),
    trend: "+3,1%",
    badge: "Upsell"
  },
  {
    title: "Churn",
    value: "2,4%",
    trend: "-0,6 pts",
    badge: "Maîtrisé"
  }
];

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
        <section className="mt-10 grid gap-6 rounded-4xl bg-white/70 p-8 shadow-2xl shadow-primary-900/10 backdrop-blur dark:bg-slate-900/70" id="overview">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                <ArrowUpRightSquare className="h-4 w-4" />
                Mise à jour 09:30
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                Votre cockpit de décision en temps réel
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-500 dark:text-slate-300">
                Visualisez la trésorerie consolidée, priorisez les actions à impact et synchronisez finance, sales et opérations.
              </p>
            </div>
            <div className="grid gap-3 rounded-3xl border border-white/50 bg-white/70 p-5 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-primary-500">Cash</span>
                <span>{formatCurrency(runway.cash)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-primary-500">Burn</span>
                <span>{formatCurrency(runway.burn)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-primary-500">Runway</span>
                <span>{runway.runway} mois</span>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {keyHighlights.map((metric) => (
              <HighlightMetric key={metric.label} {...metric} />
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-[1.1fr_0.9fr]" id="cash">
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-500">Prévision 90 jours</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Cashflow prévisionnel</h3>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                Risque faible
              </span>
            </header>
            <div className="mt-6">
              <ForecastChart />
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Hypothèses : factoring activé, budget payroll validé, CAPEX maîtrisé. Prochain recalcul dans 55 minutes.
            </p>
            <CashScenarios />
          </div>
          <AlertFeed />
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" id="bfr">
          <BfrTable />
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance revenus</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Alignement finance x sales pour renforcer la marge de manœuvre.
            </p>
            <div className="mt-4 grid gap-4">
              {revenuePerformance.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{item.title}</p>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase tracking-wide text-success">{item.trend}</span>
                    <p className="text-[11px] text-slate-400">{item.badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6" id="actions">
          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-500">Playbook cash</p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Priorités des 14 prochains jours</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
                <Activity className="h-4 w-4" />
                Impact +28 jours
              </span>
            </header>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Aligné avec la stratégie Q2, synchronisé sur Slack #finance-war-room.
            </p>
            <div className="mt-6">
              <ActionPlan />
            </div>
          </div>
          <Roadmap />
        </section>

        <section className="mt-12" id="academy">
          <AcademyModules />
        </section>
      </main>
      <footer className="border-t border-white/60 bg-white/70 py-6 text-sm text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-2 px-6 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Sagora. Cockpit financier pour PME européennes.</p>
          <div className="flex gap-4">
            <a href="#">Sécurité</a>
            <a href="#">Roadmap</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
