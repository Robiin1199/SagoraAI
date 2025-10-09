import { Lightbulb, MailCheck, Scale, ScrollText } from "lucide-react";

const actions = [
  {
    title: "Activer factoring sur 3 clients clés",
    description: "Accélérez 420 k€ de cash en 10 jours en cédant les factures > 30 jours.",
    owner: "Finance Admin",
    due: "15 mai",
    impact: "Runway +18 jours",
    icon: ScrollText
  },
  {
    title: "Négocier délai fournisseur énergie",
    description: "Passer de 30 à 45 jours avec Enerplus, coût estimé 0,3%.",
    owner: "CFO",
    due: "20 mai",
    impact: "Cash +80 k€",
    icon: Scale
  },
  {
    title: "Campagne relance mail automatisée",
    description: "Relancer 17 clients > 60 jours avec séquence multi-étapes + scoring.",
    owner: "Sales Ops",
    due: "12 mai",
    impact: "Cash +110 k€",
    icon: MailCheck
  }
];

export function ActionPlan() {
  return (
    <div className="grid gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <article
            key={action.title}
            className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-300">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                </div>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                {action.impact}
              </span>
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary-500" />
                <span className="font-medium uppercase tracking-wide">Owner :</span>
                <span>{action.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-primary-500" />
                <span className="font-medium uppercase tracking-wide">Échéance :</span>
                <span>{action.due}</span>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
