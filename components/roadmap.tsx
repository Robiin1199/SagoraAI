import { AlertTriangle, CalendarCheck, CheckCircle2, Circle, CircleDashed, Target, Users } from "lucide-react";

import { cn } from "@/lib/utils";

type RoadmapStatus = "done" | "progress" | "planned";

type RoadmapItemStatus = "done" | "progress" | "planned";

type RoadmapItem = {
  label: string;
  status: RoadmapItemStatus;
  note?: string;
};

type RoadmapStep = {
  title: string;
  description: string;
  status: RoadmapStatus;
  target: string;
  owner: string;
  confidence: string;
  focus: string;
  risk: string;
  checkpoint: string;
  items: RoadmapItem[];
};

type RoadmapTotals = Record<RoadmapItemStatus | "total", number>;

const roadmap: RoadmapStep[] = [
  {
    title: "V1 – Pilotage Cash",
    description: "Stabiliser le cockpit, aligner cash + alertes, livrer scénarios.",
    status: "done",
    target: "Mai 2024 – Go-live pilote",
    owner: "Squad Frontend & Data",
    confidence: "80%",
    focus: "Hypercare post go-live et transfert aux équipes support pour capitaliser sur les premiers retours clients.",
    risk: "Risque de dérive fonctionnelle pendant l’hypercare si la priorisation des retours n’est pas cadencée.",
    checkpoint: "Retro & handover du 20 mai pour clore l’itération et documenter les apprentissages.",
    items: [
      {
        label: "Connexion PSD2",
        status: "done",
        note: "Homologation TPP validée et flux production stabilisés."
      },
      {
        label: "Prévision 90 jours",
        status: "done",
        note: "Dashboard Cash J+0/J+90 livré (SAGORA_APP_CODEX v0.2)."
      },
      {
        label: "Alertes seuils",
        status: "done",
        note: "MVP alertes cash & runway activé sur prod interne."
      },
      {
        label: "Scénarios cash",
        status: "done",
        note: "Scénarios Base/Stress/Growth affichés dans le cockpit."
      }
    ]
  },
  {
    title: "V2 – Collaboration",
    description: "Fluidifier la coordination finance/sales : workflows et relances.",
    status: "progress",
    target: "T3 – T4 2024",
    owner: "Product & RevOps",
    confidence: "60%",
    focus: "Rendre le BFR actionnable avec relances intégrées et reporting partageable, sans pression calendrier court terme.",
    risk: "Capacité engineering partagée avec la finalisation PSD2 + dépendance moteur emailing et intégrations CRM.",
    checkpoint: "Design review du 30 juin puis jalons mensuels jusqu’à fin octobre.",
    items: [
      {
        label: "DSO/DPO/DIO interactif",
        status: "progress",
        note: "Aging interactif en développement avec itérations UX hebdomadaires."
      },
      {
        label: "Workflows validation",
        status: "planned",
        note: "Spécifications en cours de cadrage avec finance + sales (cible fin juillet)."
      },
      {
        label: "Relances automatisées",
        status: "planned",
        note: "Dépend des triggers d’emails transactionnels et de l’orchestration CRM."
      },
      {
        label: "Export reporting",
        status: "planned",
        note: "Alignement CFO/CRO en préparation (formats PDF & CSV) avec buffer H2 2024."
      }
    ]
  },
  {
    title: "V3 – Intelligence",
    description: "Activer la donnée enrichie et l’IA décisionnelle pour anticiper.",
    status: "planned",
    target: "T4 2024",
    owner: "Product & Data Science",
    confidence: "45%",
    focus: "Industrialiser la donnée enrichie pour déployer scoring et assistants contextuels.",
    risk: "Qualité data CRM/ERP à sécuriser pour éviter un scoring biaisé.",
    checkpoint: "Kick-off data/IA prévu le 15 septembre.",
    items: [
      {
        label: "Scoring client",
        status: "planned",
        note: "Nécessite enrichissement CRM + data lab."
      },
      {
        label: "Simulation dettes",
        status: "planned",
        note: "Modélisation à cadrer avec finance & partenaires bancaires."
      },
      {
        label: "Assistants IA contextuels",
        status: "planned",
        note: "Attente retours Academy & charte LLM interne."
      }
    ]
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

const itemStatusConfig: Record<
  RoadmapItemStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  done: {
    label: "Livré",
    className: "text-success",
    icon: CheckCircle2
  },
  progress: {
    label: "En cours",
    className: "text-warning",
    icon: CircleDashed
  },
  planned: {
    label: "Planifié",
    className: "text-slate-400",
    icon: Circle
  }
};

const computeProgress = (items: RoadmapItem[]): number => {
  if (!items.length) {
    return 0;
  }

  const score = items.reduce((acc, item) => {
    if (item.status === "done") {
      return acc + 1;
    }

    if (item.status === "progress") {
      return acc + 0.5;
    }

    return acc;
  }, 0);

  return Math.round((score / items.length) * 100);
};

export function Roadmap() {
  const totals = roadmap.reduce<RoadmapTotals>(
    (acc, step) => {
      step.items.forEach((item) => {
        acc.total += 1;
        acc[item.status] += 1;
      });

      return acc;
    },
    { done: 0, progress: 0, planned: 0, total: 0 } satisfies RoadmapTotals
  );

  const overallProgress = totals.total
    ? Math.round(((totals.done + totals.progress * 0.5) / totals.total) * 100)
    : 0;

  return (
    <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-500">Roadmap produit</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cap sur 12 mois de pilotage financier</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Vue annotée des jalons clés, avec focus, risques et checkpoints pour aligner les équipes finance, data et produit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary-500/10 px-3 py-1 font-semibold uppercase tracking-wide text-primary-600">
            Rolling 90 jours
          </span>
          <span className="rounded-full border border-primary-100 px-3 py-1 font-semibold uppercase tracking-wide text-primary-500 dark:border-primary-500/40 dark:text-primary-300">
            Dernière revue : 20 mai 2024
          </span>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        {Object.entries(itemStatusConfig).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <Icon className={cn("h-3.5 w-3.5", value.className)} />
              {value.label}
            </span>
          );
        })}
      </div>

      <div className="relative mt-8 grid gap-6 lg:grid-cols-3">
        {roadmap.map((step, index) => {
          const status = statusConfig[step.status];
          const progress = computeProgress(step.items);

          return (
            <article
              key={step.title}
              className="relative flex h-full flex-col gap-5 rounded-3xl border border-white/60 bg-white/80 p-5 dark:border-slate-800/60 dark:bg-slate-900/70"
            >
              <span className="absolute -left-4 top-6 hidden h-3 w-3 rounded-full border-4 border-white bg-primary-500 dark:border-slate-900 dark:bg-primary-400 lg:block" />
              {index < roadmap.length - 1 ? (
                <span className="absolute -left-[14px] top-12 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary-500/60 via-primary-400/30 to-transparent dark:from-primary-400/70 dark:via-primary-400/20 lg:block" />
              ) : null}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
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
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800/60">
                      <Users className="h-3.5 w-3.5 text-primary-500" /> {step.owner}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800/60">
                      <Target className="h-3.5 w-3.5 text-primary-500" /> Confiance {step.confidence}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all dark:bg-primary-400"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{progress}% complété</p>
                </div>
              </div>

              <ul className="space-y-3">
                {step.items.map((item) => {
                  const itemStatus = itemStatusConfig[item.status];
                  const Icon = itemStatus.icon;

                  return (
                    <li key={item.label} className="flex gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 dark:border-slate-700 dark:bg-slate-900/70",
                          itemStatus.className
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                        {item.note ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto grid gap-2 rounded-2xl border border-dashed border-primary-100/80 bg-primary-50/60 p-4 text-xs text-slate-600 dark:border-primary-500/30 dark:bg-slate-900/50 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 text-primary-500" />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-white">Focus :</span> {step.focus}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-white">Risque clé :</span> {step.risk}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <CalendarCheck className="mt-0.5 h-4 w-4 text-primary-500" />
                  <span>
                    <span className="font-semibold text-slate-900 dark:text-white">Checkpoint :</span> {step.checkpoint}
                  </span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="mt-8 rounded-2xl border border-primary-100/70 bg-primary-50/50 p-4 text-sm text-slate-600 dark:border-primary-500/30 dark:bg-slate-900/60 dark:text-slate-300">
        <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300">Point d’avancement global</h3>
        <p className="mt-2">
          {overallProgress}% du backlog roadmap est livré ({totals.done} livrés, {totals.progress} en cours, {totals.planned} planifiés).
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Source : SAGORA_APP_CODEX v0.2 – mise à jour 20/05/2024.</p>
      </footer>
    </section>
  );
}
