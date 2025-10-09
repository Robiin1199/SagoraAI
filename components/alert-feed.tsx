import { AlertTriangle, BellRing, Shield, ShieldCheck } from "lucide-react";

import { CashAlert } from "@/lib/api/cash";

interface AlertFeedProps {
  alerts: CashAlert[];
}

const severityIconMap: Record<CashAlert["severity"], typeof BellRing> = {
  warning: BellRing,
  danger: AlertTriangle,
  success: ShieldCheck,
  info: Shield
};

export function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card dark:border-slate-800 dark:bg-slate-900/80">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Alertes et signaux faibles</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Pilotage en temps réel. Connecté à vos banques, ERP et CRM.
      </p>
      <div className="mt-4 space-y-4">
        {!alerts?.length && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-4 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
            Aucun signal critique détecté.
          </div>
        )}
        {alerts?.map((alert) => {
          const Icon = severityIconMap[alert.severity] ?? BellRing;
          return (
            <article
              key={alert.id}
              className="flex items-start gap-4 rounded-3xl border border-slate-200/50 bg-white/70 p-4 dark:border-slate-800/70 dark:bg-slate-900/70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200">
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
