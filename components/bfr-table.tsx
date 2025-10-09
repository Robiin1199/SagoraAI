"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Mail, PhoneCall, Sparkles } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";

type BfrMetric = {
  metric: string;
  value: number;
  target: number;
  variance: number;
  impact: string;
};

type AgingBucketKey = "0-30" | "31-45" | "46-60" | "61-90" | "90+";

type AgingActionType = "email" | "call" | "workshop" | "automation";

type AgingAction = {
  type: AgingActionType;
  label: string;
  owner: string;
  due: string;
};

type FocusAccount = {
  invoice: string;
  customer: string;
  amount: number;
  bucket: AgingBucketKey;
  dueStatus: string;
  owner: string;
  lastAction: string;
  nextStep: string;
};

type AgingSegment = {
  id: string;
  label: string;
  description: string;
  dso: number;
  target: number;
  revenue: number;
  receivables: number;
  currency: string;
  bucketBreakdown: Record<AgingBucketKey, number>;
  focusAccounts: FocusAccount[];
  actions: AgingAction[];
  highlight: string;
};

const rows: BfrMetric[] = [
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

const bucketOrder: Array<{ key: AgingBucketKey; label: string; tone: string }> = [
  { key: "0-30", label: "0-30 j", tone: "from-primary-400/40 to-primary-500/60" },
  { key: "31-45", label: "31-45 j", tone: "from-primary-400/30 to-primary-500/50" },
  { key: "46-60", label: "46-60 j", tone: "from-warning/30 to-warning/50" },
  { key: "61-90", label: "61-90 j", tone: "from-danger/30 to-danger/50" },
  { key: "90+", label: "> 90 j", tone: "from-danger/40 to-danger/70" }
];

const actionIcons: Record<AgingActionType, typeof Mail> = {
  email: Mail,
  call: PhoneCall,
  workshop: Sparkles,
  automation: CalendarClock
};

const agingSegments: AgingSegment[] = [
  {
    id: "global",
    label: "Consolidé",
    description: "Vue agrégée toutes entités (EUR).",
    dso: 54,
    target: 45,
    revenue: 410_000,
    receivables: 607_000,
    currency: "EUR",
    bucketBreakdown: {
      "0-30": 278_000,
      "31-45": 126_000,
      "46-60": 92_000,
      "61-90": 62_000,
      "90+": 49_000
    },
    focusAccounts: [
      {
        invoice: "INV-2031",
        customer: "Madera SAS",
        amount: 86_000,
        bucket: "90+",
        dueStatus: "Échu depuis 32 j",
        owner: "Finance Ops",
        lastAction: "Relance mail 02/05",
        nextStep: "Programmer appel CFO client"
      },
      {
        invoice: "INV-2024",
        customer: "Kheops Consulting",
        amount: 42_500,
        bucket: "61-90",
        dueStatus: "Échu depuis 18 j",
        owner: "Account Manager",
        lastAction: "Plan d’apurement proposé",
        nextStep: "Valider échéancier avant 22/05"
      },
      {
        invoice: "INV-2050",
        customer: "Atlas Retail EU",
        amount: 35_400,
        bucket: "46-60",
        dueStatus: "Échu depuis 9 j",
        owner: "RevOps",
        lastAction: "Ticket support résolu",
        nextStep: "Automatiser relance + lien paiement"
      }
    ],
    actions: [
      {
        type: "email",
        label: "Campagne de relance prioritaire clients > 60 j",
        owner: "Finance Ops",
        due: "Exécution 21/05"
      },
      {
        type: "call",
        label: "Escalade CFO – Madera & Kheops",
        owner: "CFO Sagora",
        due: "Bouclage 24/05"
      },
      {
        type: "automation",
        label: "Activer relances automatiques + paiement SEPA",
        owner: "RevOps",
        due: "Sprint S24"
      }
    ],
    highlight: "DSO en hausse de 9 jours vs objectif : priorité aux créances > 60 j."
  },
  {
    id: "top20",
    label: "Top 20 clients",
    description: "Portefeuille concentré (72% du revenu).",
    dso: 38,
    target: 35,
    revenue: 320_000,
    receivables: 401_500,
    currency: "EUR",
    bucketBreakdown: {
      "0-30": 210_000,
      "31-45": 62_000,
      "46-60": 38_500,
      "61-90": 27_000,
      "90+": 64_000
    },
    focusAccounts: [
      {
        invoice: "INV-2042",
        customer: "Helios Infra",
        amount: 58_900,
        bucket: "90+",
        dueStatus: "Échu depuis 28 j",
        owner: "Key Account",
        lastAction: "Réunion conjointe 16/05",
        nextStep: "Finaliser bon de commande complémentaire"
      },
      {
        invoice: "INV-2038",
        customer: "Atlas Retail EU",
        amount: 31_200,
        bucket: "61-90",
        dueStatus: "Échu depuis 15 j",
        owner: "Account Manager",
        lastAction: "Support technique clôturé",
        nextStep: "Obtenir validation CFO client"
      }
    ],
    actions: [
      {
        type: "call",
        label: "Points hebdo Top 10 clients",
        owner: "Sales Leadership",
        due: "Démarrage 22/05"
      },
      {
        type: "email",
        label: "Relance automatisée via template CFO",
        owner: "Finance Ops",
        due: "Go-live 27/05"
      },
      {
        type: "workshop",
        label: "Atelier alignement Sales x Finance",
        owner: "RevOps",
        due: "29/05"
      }
    ],
    highlight: "90% de l’encours > 60 j concentré sur 5 comptes : garder cadence weekly."
  },
  {
    id: "public",
    label: "Secteur public",
    description: "Collectivités & établissements publics.",
    dso: 72,
    target: 60,
    revenue: 52_000,
    receivables: 104_700,
    currency: "EUR",
    bucketBreakdown: {
      "0-30": 18_400,
      "31-45": 22_600,
      "46-60": 19_700,
      "61-90": 21_300,
      "90+": 22_700
    },
    focusAccounts: [
      {
        invoice: "INV-1984",
        customer: "Ville de Nanterre",
        amount: 24_300,
        bucket: "90+",
        dueStatus: "Échu depuis 41 j",
        owner: "Public Sector Lead",
        lastAction: "Accusé de réception reçu",
        nextStep: "Fournir certificat service fait"
      },
      {
        invoice: "INV-1990",
        customer: "CHU Atlantique",
        amount: 19_800,
        bucket: "61-90",
        dueStatus: "Échu depuis 23 j",
        owner: "Finance Ops",
        lastAction: "Dossier mandat transmis",
        nextStep: "Relancer Trésorerie Générale"
      }
    ],
    actions: [
      {
        type: "workshop",
        label: "Task force facturation publique",
        owner: "COO",
        due: "Kick-off 23/05"
      },
      {
        type: "automation",
        label: "Mise à jour portail Chorus Pro",
        owner: "Finance Ops",
        due: "Avant 28/05"
      }
    ],
    highlight: "Cycle long structurel : sécuriser pièces justificatives dès J+0."
  },
  {
    id: "international",
    label: "International",
    description: "Royaume-Uni, Benelux, Espagne.",
    dso: 48,
    target: 45,
    revenue: 86_000,
    receivables: 98_600,
    currency: "EUR",
    bucketBreakdown: {
      "0-30": 39_600,
      "31-45": 21_400,
      "46-60": 15_800,
      "61-90": 12_400,
      "90+": 9_400
    },
    focusAccounts: [
      {
        invoice: "INV-2056",
        customer: "GreenFarm UK",
        amount: 12_700,
        bucket: "61-90",
        dueStatus: "Échu depuis 19 j",
        owner: "International AM",
        lastAction: "Traduction contrat envoyée",
        nextStep: "Programmer call de clôture"
      }
    ],
    actions: [
      {
        type: "email",
        label: "Relance multilingue automatisée",
        owner: "RevOps",
        due: "Go-live 30/05"
      },
      {
        type: "call",
        label: "Support onboarding factoring UK",
        owner: "Finance Ops",
        due: "Pilotage 03/06"
      }
    ],
    highlight: "Maintenir DSO < 50 j pour financer la croissance export."
  }
];

export function BfrTable() {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(agingSegments[0]?.id ?? "global");

  const selectedSegment = useMemo(
    () => agingSegments.find((segment) => segment.id === selectedSegmentId) ?? agingSegments[0],
    [selectedSegmentId]
  );

  const bucketTotals = useMemo(() => {
    return bucketOrder.map((bucket) => ({
      ...bucket,
      amount: selectedSegment?.bucketBreakdown[bucket.key] ?? 0
    }));
  }, [selectedSegment]);

  const totalReceivables = selectedSegment?.receivables ?? 0;
  const dsoVariance = selectedSegment ? selectedSegment.dso - selectedSegment.target : 0;

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
            <tr
              key={row.metric}
              className="border-t border-slate-200/40 bg-white/60 text-slate-700 transition hover:bg-white dark:border-slate-800/80 dark:bg-transparent dark:text-slate-200"
            >
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

      <div className="border-t border-dashed border-primary-100/60 bg-primary-50/40 p-6 dark:border-primary-500/20 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-500">Aging créances</p>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">DSO interactif par segment</h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedSegment?.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {agingSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                onClick={() => setSelectedSegmentId(segment.id)}
                className={cn(
                  "rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide transition",
                  selectedSegmentId === segment.id
                    ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                    : "border-primary-200/70 bg-white text-primary-600 hover:border-primary-400 hover:text-primary-700 dark:border-primary-500/30 dark:bg-slate-900/70 dark:text-primary-200"
                )}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm shadow-inner dark:border-slate-800/60 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-widest text-slate-400">DSO actuel</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedSegment?.dso ?? "--"} j</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Objectif {selectedSegment?.target} j | Écart
              <span
                className={cn(
                  "ml-1 font-semibold",
                  dsoVariance > 0 ? "text-danger" : "text-success"
                )}
              >
                {dsoVariance > 0 ? `+${dsoVariance.toFixed(1)}` : dsoVariance.toFixed(1)} j
              </span>
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{selectedSegment?.highlight}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm shadow-inner dark:border-slate-800/60 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-widest text-slate-400">Encours total</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(totalReceivables, selectedSegment?.currency)}
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Revenu mensuel : {formatCurrency(selectedSegment?.revenue ?? 0, selectedSegment?.currency)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-sm shadow-inner dark:border-slate-800/60 dark:bg-slate-900/70">
            <p className="text-xs uppercase tracking-widest text-slate-400">Plan d’action</p>
            <ul className="mt-2 space-y-2">
              {selectedSegment?.actions.map((action) => {
                const Icon = actionIcons[action.type];
                return (
                  <li key={`${action.label}-${action.due}`} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 rounded-full bg-primary-500/10 p-1 text-primary-500 dark:bg-primary-500/20 dark:text-primary-200">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{action.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {action.owner} • {action.due}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-inner dark:border-slate-800/50 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Répartition des créances</p>
            <ul className="mt-3 space-y-3">
              {bucketTotals.map((bucket) => {
                const ratio = totalReceivables ? Math.round((bucket.amount / totalReceivables) * 100) : 0;
                return (
                  <li key={bucket.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-300">
                      <span>{bucket.label}</span>
                      <span>
                        {formatCurrency(bucket.amount, selectedSegment?.currency)} • {ratio}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200/70 dark:bg-slate-800">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r", bucket.tone)}
                        style={{ width: `${Math.max(ratio, 4)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-inner dark:border-slate-800/50 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Comptes à risque</p>
            <table className="mt-3 w-full border-separate border-spacing-y-2 text-xs">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-2 text-left font-semibold">Client</th>
                  <th className="px-2 text-right font-semibold">Montant</th>
                  <th className="px-2 text-left font-semibold">Statut</th>
                  <th className="px-2 text-left font-semibold">Owner</th>
                </tr>
              </thead>
              <tbody>
                {selectedSegment?.focusAccounts.map((account) => (
                  <tr
                    key={`${account.invoice}-${account.customer}`}
                    className="rounded-xl bg-white/80 text-slate-600 shadow-sm dark:bg-slate-900/60 dark:text-slate-300"
                  >
                    <td className="rounded-l-xl px-2 py-2">
                      <div className="font-semibold text-slate-700 dark:text-slate-100">{account.customer}</div>
                      <div className="text-[11px] text-slate-400">{account.invoice}</div>
                    </td>
                    <td className="px-2 py-2 text-right font-semibold text-slate-700 dark:text-slate-100">
                      {formatCurrency(account.amount, selectedSegment?.currency)}
                    </td>
                    <td className="px-2 py-2">
                      <p className="font-medium text-danger">{account.bucket}</p>
                      <p className="text-[11px] text-slate-400">{account.dueStatus}</p>
                    </td>
                    <td className="rounded-r-xl px-2 py-2">
                      <p className="font-medium text-slate-600 dark:text-slate-200">{account.owner}</p>
                      <p className="text-[11px] text-slate-400">{account.lastAction}</p>
                      <p className="text-[11px] text-primary-600 dark:text-primary-300">{account.nextStep}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
