import "server-only";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export type CashAlert = {
  id: string;
  title: string;
  description: string;
  severity: "success" | "warning" | "danger" | "info";
  timestamp: string;
};

export type CashSnapshot = {
  currency: string;
  updatedAt: string;
  cashAvailable: number;
  burnRate: number;
  runwayMonths: number;
  dso: number;
  cashDelta30d?: number;
  burnDelta30d?: number;
  runwayDelta30d?: number;
  alerts: CashAlert[];
};

export type CashForecastPoint = {
  label: string;
  value: number;
};

export type CashForecast = {
  horizonDays: number;
  currency: string;
  points: CashForecastPoint[];
};

export type CashScenario = {
  id: string;
  variant: "BASE" | "STRESS" | "GROWTH" | "CUSTOM";
  name: string;
  narrative: string;
  runwayLabel: string;
  deltaLabel: string;
  riskNarrative: string;
};

async function requireSession() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Utilisateur non authentifié");
  }
  return session;
}

function formatDelta(newValue?: number, oldValue?: number) {
  if (newValue === undefined || oldValue === undefined) {
    return undefined;
  }
  return Number(newValue - oldValue);
}

export async function getCashSnapshot(): Promise<CashSnapshot> {
  noStore();
  const session = await requireSession();
  const organizationId = session.user!.organizationId!;

  const [latest, previous, overdueInvoices] = await Promise.all([
    prisma.metricSnapshot.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    }),
    prisma.metricSnapshot.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      skip: 1
    }),
    prisma.invoice.findMany({
      where: {
        organizationId,
        status: InvoiceStatus.OVERDUE
      },
      orderBy: { dueAt: "asc" },
      take: 5
    })
  ]);

  if (!latest) {
    throw new Error("Aucune donnée de métriques n'est disponible. Importez vos factures pour démarrer.");
  }

  const toNumber = (value: unknown) => Number(value ?? 0);

  const alerts: CashAlert[] = overdueInvoices.map((invoice) => ({
    id: invoice.id,
    title: `Facture en retard – ${invoice.customerName}`,
    description: `${invoice.customerName} doit ${Number(invoice.amount).toFixed(2)} ${invoice.currency} depuis ${invoice.dueAt?.toLocaleDateString("fr-FR") ?? "date inconnue"}.`,
    severity: "danger",
    timestamp: invoice.dueAt ? `Échéance ${invoice.dueAt.toLocaleDateString("fr-FR")}` : "Échéance inconnue"
  }));

  if (!alerts.length) {
    alerts.push({
      id: "metrics-fresh",
      title: "KPIs à jour",
      description: "Les indicateurs financiers ont été recalculés récemment via Inngest.",
      severity: "success",
      timestamp: new Date(latest.createdAt).toLocaleString("fr-FR")
    });
  }

  return {
    currency: "EUR",
    updatedAt: latest.createdAt.toISOString(),
    cashAvailable: toNumber(latest.cash),
    burnRate: toNumber(latest.burn),
    runwayMonths: toNumber(latest.runwayMonths),
    dso: toNumber(latest.dso),
    cashDelta30d: formatDelta(toNumber(latest.cash), previous ? toNumber(previous.cash) : undefined),
    burnDelta30d: formatDelta(toNumber(latest.burn), previous ? toNumber(previous.burn) : undefined),
    runwayDelta30d: formatDelta(toNumber(latest.runwayMonths), previous ? toNumber(previous.runwayMonths) : undefined),
    alerts
  };
}

export async function getCashForecast(): Promise<CashForecast> {
  const snapshot = await getCashSnapshot();
  const horizonDays = 90;
  const monthlyBurn = snapshot.burnRate;
  const dailyBurn = monthlyBurn / 30;

  const points = Array.from({ length: 7 }).map((_, index) => {
    const day = index * 15;
    const forecast = snapshot.cashAvailable + dailyBurn * day;
    return {
      label: day === 0 ? "J0" : `J${day}`,
      value: Math.max(forecast, 0)
    } satisfies CashForecastPoint;
  });

  return {
    horizonDays,
    currency: snapshot.currency,
    points
  };
}

export async function getCashScenarios(): Promise<CashScenario[]> {
  const snapshot = await getCashSnapshot();
  const runway = snapshot.runwayMonths;
  const formatRunway = (value: number) => `${value.toFixed(1)} mois`;

  return [
    {
      id: "base",
      variant: "BASE",
      name: "Base case",
      narrative: "Projection basée sur le burn actuel recalculé.",
      runwayLabel: formatRunway(runway),
      deltaLabel: "Situation de référence",
      riskNarrative: "Risque maîtrisé si le burn reste stable"
    },
    {
      id: "stress",
      variant: "STRESS",
      name: "Stress",
      narrative: "Hypothèse +20% de burn (coûts supplémentaires).",
      runwayLabel: formatRunway(Math.max(runway - runway * 0.2, 0)),
      deltaLabel: "-20% runway",
      riskNarrative: "Activer un plan de réduction des coûts"
    },
    {
      id: "growth",
      variant: "GROWTH",
      name: "Growth",
      narrative: "Upsell clients + réduction DSO de 15%.",
      runwayLabel: formatRunway(runway + runway * 0.25),
      deltaLabel: "+25% runway",
      riskNarrative: "Capacité cash sécurisée"
    }
  ];
}

export async function triggerMetricsRefresh() {
  const session = await requireSession();
  await inngest.send({
    name: "metrics/compute",
    data: { organizationId: session.user!.organizationId }
  });
}
