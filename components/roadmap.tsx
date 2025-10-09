import { cn } from "@/lib/utils";

type RoadmapStatus = "done" | "progress" | "planned";

const roadmap: Array<{
  title: string;
  description: string;
  status: RoadmapStatus;
  target: string;
  progress: number;
  items: string[];
}> = [
  {
    title: "V1 – Pilotage Cash",
    description: "Stabiliser le cockpit, aligner cash + alertes, livrer scénarios.",
    status: "progress",
    target: "T2 2024",
    progress: 70,
    items: ["Connexion PSD2", "Prévision 90 jours", "Alertes seuils", "Scénarios cash"]
  },
  {
    title: "V2 – Collaboration",
    description: "Fluidifier la coordination finance/sales : workflows et relances.",
    status: "planned",
    target: "T3 2024",
    progress: 20,
    items: ["Workflows validation", "Relances automatisées", "Export reporting"]
  },
  {
    title: "V3 – Intelligence",
    description: "Activer la donnée enrichie et l'IA décisionnelle pour anticiper.",
    status: "planned",
    target: "T4 2024",
    progress: 10,
    items: ["Scoring client", "Simulation dettes", "Assistants IA contextuels"]
  }
];

const statusConfig: Record<RoadmapStatus, { label: string; className: string }> = {
  done: {
    label: "Livré",
    className: "bg-success/15 text-success"
  },
  progress: {
    label: "En cours",
    className: "bg-warning/15 text-warning"
  },
  planned: {
    label: "Planifié",
    className: "bg-primary-500/10 text-primary-600"
  }
};

export function Roadmap() {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-primary-500">Roadmap produit</p>
          <h2 className="text-xl font-semibold leading-snug text-slate-900 dark:text-white">Cap sur 12 mois de pilotage financier</h2>
        </div>
        <span className="inline-flex w-fit items-center justify-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
          Rolling 90 jours
        </span>
      </header>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {roadmap.map((step) => {
          const status = statusConfig[step.status];
          return (
            <article
              key={step.title}
              className="flex min-h-[280px] flex-col justify-between gap-6 rounded-3xl border border-white/60 bg-white/75 p-6 dark:border-slate-800/60 dark:bg-slate-900/70"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white md:text-lg">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:leading-6 md:tracking-[0.01em]">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-row flex-wrap items-start gap-2 text-right md:flex-col md:items-end md:gap-2">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{step.target}</span>
                  </div>
                </div>
                <div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all dark:bg-primary-400"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{step.progress}% complété</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 md:space-y-2.5">
                {step.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
