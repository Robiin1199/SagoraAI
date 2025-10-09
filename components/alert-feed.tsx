import { AlertTriangle, BellRing, Shield } from "lucide-react";

const alerts = [
  {
    title: "Alerte cash burn",
    description: "Le burn mensuel dépasse le budget de 12%. Revoyez le plan de recrutement.",
    severity: "warning",
    icon: BellRing,
    timestamp: "Il y a 2 h"
  },
  {
    title: "Facture client > 90 jours",
    description: "Client Madera : 86 k€ en attente, dernière relance le 2 mai.",
    severity: "danger",
    icon: AlertTriangle,
    timestamp: "Il y a 5 h"
  },
  {
    title: "Revue sécurité hebdo",
    description: "Aucun incident critique. 2 tentatives de connexion bloquées.",
    severity: "success",
    icon: Shield,
    timestamp: "Hier"
  }
];

export function AlertFeed() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Alertes et signaux faibles</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Pilotage en temps réel. Connecté à vos banques, ERP et CRM.
      </p>
      <div className="mt-4 space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <article key={alert.title} className="flex items-start gap-4 rounded-3xl border border-slate-200/50 bg-white/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/70">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200"
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{alert.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
