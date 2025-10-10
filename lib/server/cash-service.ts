import "server-only";

import type {
  CashAlert,
  CashForecast,
  CashForecastPoint,
  CashScenario,
  CashSnapshot
} from "@/lib/api/cash";

const CURRENCY = "EUR";

const BANK_ACCOUNTS = [
  { provider: "BNP Paribas", balance: 365_120 },
  { provider: "Qonto", balance: 196_780 },
  { provider: "HSBC France", balance: 156_550 }
] as const;

const CURRENT_CASH = BANK_ACCOUNTS.reduce((total, account) => total + account.balance, 0);
const CURRENT_BURN = calculateMonthlyBurn();

const SNAPSHOT_TIMELINE = [
  {
    date: "2024-05-10",
    cashAvailable: 661_400,
    burnRate: -117_100,
    runwayMonths: 6.1
  },
  {
    date: "2024-06-09",
    cashAvailable: CURRENT_CASH,
    burnRate: CURRENT_BURN,
    runwayMonths: calculateRunwayMonths(CURRENT_CASH, CURRENT_BURN)
  }
] as const;

const CASH_ALERTS: CashAlert[] = [
  {
    id: "cash-burn",
    title: "Alerte cash burn",
    description: "Le burn mensuel dépasse le budget de 12%. Revoyez le plan de recrutement.",
    severity: "warning",
    timestamp: formatRelativeHours(2)
  },
  {
    id: "invoice-overdue",
    title: "Facture client > 90 jours",
    description: "Client Madera : 86 k€ en attente, dernière relance le 2 mai.",
    severity: "danger",
    timestamp: formatRelativeHours(5)
  },
  {
    id: "security-review",
    title: "Revue sécurité hebdo",
    description: "Aucun incident critique. 2 tentatives de connexion bloquées.",
    severity: "success",
    timestamp: formatRelativeDays(1)
  }
];

const CASH_FLOW_EVENTS: Array<{
  day: number;
  amount: number;
  kind: "INFLOW" | "OUTFLOW";
  description: string;
}> = [
  { day: 4, amount: 55_000, kind: "INFLOW", description: "Encaissement maintenance grands comptes" },
  { day: 6, amount: -78_450, kind: "OUTFLOW", description: "Paie engineering + charges sociales" },
  { day: 10, amount: 68_000, kind: "INFLOW", description: "Facture SaaS trimestrielle – client santé" },
  { day: 13, amount: -93_000, kind: "OUTFLOW", description: "Fournisseurs cloud & marketing" },
  { day: 18, amount: 76_000, kind: "INFLOW", description: "Acompte projet énergie" },
  { day: 22, amount: -108_000, kind: "OUTFLOW", description: "Remboursement TVA + loyers" },
  { day: 27, amount: 40_000, kind: "INFLOW", description: "Upsell cross-sell existants" },
  { day: 29, amount: -38_000, kind: "OUTFLOW", description: "Capex équipements data" },
  { day: 33, amount: 52_000, kind: "INFLOW", description: "Relance client BFR" },
  { day: 37, amount: -67_000, kind: "OUTFLOW", description: "Prestations externes & conseils" },
  { day: 48, amount: 45_000, kind: "INFLOW", description: "Subvention innovation" },
  { day: 53, amount: -60_000, kind: "OUTFLOW", description: "Prime trimestrielle sales" },
  { day: 62, amount: 44_000, kind: "INFLOW", description: "Encaissement factoring" },
  { day: 68, amount: -52_000, kind: "OUTFLOW", description: "Investissements data pipeline" },
  { day: 78, amount: 37_000, kind: "INFLOW", description: "Ajustement churn maîtrisé" },
  { day: 84, amount: -41_000, kind: "OUTFLOW", description: "Charges structurelles" }
];

const FORECAST_CHECKPOINTS = [0, 7, 14, 30, 45, 60, 75, 90];

const SCENARIO_CONFIGS = [
  {
    id: "base",
    variant: "BASE" as const,
    name: "Base case",
    narrative: "Plan budgété Q2 aligné, factoring activé sur top clients.",
    burnMultiplier: 1,
    riskNarrative: "Risque maîtrisé"
  },
  {
    id: "stress",
    variant: "STRESS" as const,
    name: "Stress",
    narrative: "Churn +2 pts, retard fournisseurs énergie non négocié.",
    burnMultiplier: 1.2,
    riskNarrative: "Activer plan BFR & revue coûts"
  },
  {
    id: "growth",
    variant: "GROWTH" as const,
    name: "Growth",
    narrative: "Upsell signé + renégociation DPO énergie à 45j.",
    burnMultiplier: 0.78,
    riskNarrative: "Capacité cash sécurisée"
  }
];

export function loadCashSnapshot(): CashSnapshot {
  const current = SNAPSHOT_TIMELINE.at(-1)!;
  const previous = SNAPSHOT_TIMELINE.at(-2) ?? current;

  const cashDelta = percentageChange(current.cashAvailable, previous.cashAvailable);
  const burnDelta = percentageChange(Math.abs(current.burnRate), Math.abs(previous.burnRate));
  const runwayDelta = current.runwayMonths - previous.runwayMonths;

  return {
    currency: CURRENCY,
    updatedAt: new Date("2024-06-09T08:45:00Z").toISOString(),
    cashAvailable: current.cashAvailable,
    burnRate: current.burnRate,
    runwayMonths: roundToDecimal(current.runwayMonths, 1),
    cashDelta30d: roundToDecimal(cashDelta, 1),
    burnDelta30d: roundToDecimal(burnDelta, 1),
    runwayDelta30d: roundToDecimal(runwayDelta, 1),
    alerts: CASH_ALERTS
  };
}

export function loadCashForecast(horizonDays: number): CashForecast {
  const orderedEvents = [...CASH_FLOW_EVENTS].sort((a, b) => a.day - b.day);
  const checkpoints = FORECAST_CHECKPOINTS.filter((day) => day <= horizonDays);
  const points: CashForecastPoint[] = [];

  let runningCash = CURRENT_CASH;
  let cursor = 0;

  checkpoints.forEach((checkpoint) => {
    while (cursor < orderedEvents.length && orderedEvents[cursor].day <= checkpoint) {
      runningCash += orderedEvents[cursor].amount;
      cursor += 1;
    }

    points.push({
      label: checkpoint === 0 ? "J0" : `J${checkpoint}`,
      value: Math.round(runningCash)
    });
  });

  const lastCheckpoint = checkpoints.at(-1);

  if (lastCheckpoint !== horizonDays) {
    while (cursor < orderedEvents.length && orderedEvents[cursor].day <= horizonDays) {
      runningCash += orderedEvents[cursor].amount;
      cursor += 1;
    }

    points.push({
      label: `J${horizonDays}`,
      value: Math.round(runningCash)
    });
  }

  return {
    horizonDays,
    currency: CURRENCY,
    points
  };
}

export function loadCashScenarios(): CashScenario[] {
  const snapshot = loadCashSnapshot();
  const previous = SNAPSHOT_TIMELINE.at(-2) ?? SNAPSHOT_TIMELINE.at(-1)!;
  const monthlyBurnAbs = Math.abs(snapshot.burnRate);

  return SCENARIO_CONFIGS.map((config) => {
    const runway = snapshot.cashAvailable / (monthlyBurnAbs * config.burnMultiplier);
    const runwayLabel = `${formatMonths(runway)} mois`;

    const deltaReference = config.id === "base" ? previous.runwayMonths : snapshot.runwayMonths;
    const deltaSuffix = config.id === "base" ? "vs 30j" : "vs base";
    const deltaValue = runway - deltaReference;
    const deltaLabel = `${formatSignedMonths(deltaValue)} mois ${deltaSuffix}`;

    return {
      id: config.id,
      variant: config.variant,
      name: config.name,
      narrative: config.narrative,
      runwayLabel,
      deltaLabel,
      riskNarrative: config.riskNarrative
    } satisfies CashScenario;
  });
}

function calculateMonthlyBurn() {
  const recurringInflows = [
    198_000, // Abonnements récurrents
    61_700, // Upsell existants
    52_000 // Services professionnels
  ];

  const recurringOutflows = [
    -225_000, // Masse salariale
    -98_300, // Fournisseurs & SaaS
    -48_700, // Loyer, énergie, assurances
    -52_000 // Investissements & dette
  ];

  const totalInflows = recurringInflows.reduce((total, amount) => total + amount, 0);
  const totalOutflows = recurringOutflows.reduce((total, amount) => total + amount, 0);

  return totalInflows + totalOutflows;
}

function calculateRunwayMonths(cash: number, burnRate: number) {
  const monthlyBurn = Math.abs(burnRate);

  if (monthlyBurn === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return cash / monthlyBurn;
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}

function roundToDecimal(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatRelativeHours(hoursAgo: number) {
  if (hoursAgo <= 1) {
    return "Il y a 1 h";
  }

  return `Il y a ${hoursAgo} h`;
}

function formatRelativeDays(daysAgo: number) {
  if (daysAgo === 0) {
    return "Aujourd'hui";
  }

  if (daysAgo === 1) {
    return "Hier";
  }

  return `Il y a ${daysAgo} jours`;
}

const MONTH_FORMATTER = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const SIGNED_MONTH_FORMATTER = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always"
});

function formatMonths(value: number) {
  return MONTH_FORMATTER.format(value);
}

function formatSignedMonths(value: number) {
  return SIGNED_MONTH_FORMATTER.format(value);
}
