import { ActionPlan } from "@/components/action-plan";
import { AcademyModules } from "@/components/academy-modules";
import { AlertFeed } from "@/components/alert-feed";
import { BfrTable } from "@/components/bfr-table";
import { CashScenarios } from "@/components/cash-scenarios";
import { ForecastChart } from "@/components/forecast-chart";
import { HighlightMetric } from "@/components/highlight-metric";
import { Roadmap } from "@/components/roadmap";
import { TopNav } from "@/components/top-nav";
import {
  getCashForecast,
  getCashScenarios,
  getCashSnapshot,
  type CashForecast,
  type CashScenario,
  type CashSnapshot
} from "@/lib/api/cash";
import { formatCurrency } from "@/lib/utils";
import { Activity, ArrowUpRightSquare, Flame, Gauge, PiggyBank } from "lucide-react";

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

export default async function Page() {
  let errorMessage: string | null = null;

  let snapshot: CashSnapshot | null = null;
  let forecast: CashForecast | null = null;
  let scenarios: CashScenario[] = [];

  try {
    const [snapshotData, forecastData, scenariosData] = await Promise.all([
      getCashSnapshot(),
      getCashForecast(),
      getCashScenarios()
    ]);

    snapshot = snapshotData;
    forecast = forecastData;
    scenarios = scenariosData;
  } catch (error) {
    console.error("Erreur lors du chargement du cockpit cash", error);
    errorMessage = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
  }

  const isLoading = !snapshot && !errorMessage;

  const highlightMetrics = snapshot
    ? [
        {
          label: "Cash disponible",
          value: snapshot.cashAvailable,
          delta: snapshot.cashDelta30d,
          icon: <PiggyBank className="h-6 w-6" />,
          color: "primary" as const,
          description: "Toutes banques agrégées (BNP, Qonto, HSBC).",
          currency: snapshot.currency
        },
        {
          label: "Burn mensuel",
          value: snapshot.burnRate,
          delta: snapshot.burnDelta30d,
          icon: <Flame className="h-6 w-6" />,
          color: "danger" as const,
          description: "Charges fixes + payroll + CAPEX planifié.",
          currency: snapshot.currency
        },
        {
          label: "Runway",
          value: snapshot.runwayMonths,
          icon: <Gauge className="h-6 w-6" />,
          color: "warning" as const,
          description: "Projection avec factoring activé sur clients Top 20.",
          valueFormatter: (value: number) => `${value.toFixed(1)} mois`
        }
      ]
    : [];

  const runwayCard = snapshot
    ? {
        cash: snapshot.cashAvailable,
        burn: snapshot.burnRate,
        runway: snapshot.runwayMonths,
        currency: snapshot.currency
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">
        {errorMessage && (
          <div className="mt-6 rounded-3xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
            Impossible de récupérer les données financières : {errorMessage}
          </div>
        )}

        <section className="mt-10 grid gap-6 rounded-4xl bg-white/70 p-8 shadow-2xl shadow-primary-900/10 backdrop-blur dark:bg-slate-900/70" id="overview">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                <ArrowUpRightSquare className="h-4 w-4" />
                {snapshot ? `Mise à jour ${new Date(snapshot.updatedAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}` : "Chargement en cours"}
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
                <span>{runwayCard ? formatCurrency(runwayCard.cash, runwayCard.currency) : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-primary-500">Burn</span>
                <span>{runwayCard ? formatCurrency(runwayCard.burn, runwayCard.currency) : "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wide text-primary-500">Runway</span>
                <span>{runwayCard ? `${runwayCard.runway.toFixed(1)} mois` : "--"}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {isLoading ? (
              <div className="md:col-span-3 text-sm text-slate-400">Chargement des métriques...</div>
            ) : highlightMetrics.length ? (
              highlightMetrics.map((metric) => <HighlightMetric key={metric.label} {...metric} />)
            ) : (
              <div className="md:col-span-3 text-sm text-slate-400">Aucune métrique disponible.</div>
            )}
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
              <ForecastChart points={forecast?.points ?? []} currency={forecast?.currency ?? snapshot?.currency} />
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Hypothèses : factoring activé, budget payroll validé, CAPEX maîtrisé. Prochain recalcul dans 55 minutes.
            </p>
            <CashScenarios scenarios={scenarios} />
          </div>
          <AlertFeed alerts={snapshot?.alerts ?? []} />
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
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm shadow-inner dark:border-slate-800/70 dark:bg-slate-900/70"
                >
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
                Aligné
              </span>
            </header>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Actions synchronisées avec finance, sales, opérations. Impact cash mesuré quotidiennement.
            </p>
            <ActionPlan />
          </div>
          <Roadmap />
          <AcademyModules />
        </section>
      </main>
    </div>
  );
}
