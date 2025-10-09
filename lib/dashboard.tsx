import { Flame, Gauge, PiggyBank } from "lucide-react";

import type { CashSnapshot } from "@/lib/api/cash";
import type { HighlightMetricProps } from "@/components/highlight-metric";

export type RunwayCard = {
  cash: number;
  burn: number;
  runway: number;
  currency: string;
};

export type DashboardViewModel = {
  highlightMetrics: HighlightMetricProps[];
  runwayCard: RunwayCard | null;
  lastUpdateLabel: string;
  isLoading: boolean;
};

const UPDATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit"
};

export function getDashboardViewModel(
  snapshot: CashSnapshot | null,
  errorMessage: string | null
): DashboardViewModel {
  return {
    highlightMetrics: createHighlightMetrics(snapshot),
    runwayCard: createRunwayCard(snapshot),
    lastUpdateLabel: getSnapshotUpdateLabel(snapshot),
    isLoading: !snapshot && !errorMessage
  };
}

function createHighlightMetrics(snapshot: CashSnapshot | null): HighlightMetricProps[] {
  if (!snapshot) {
    return [];
  }

  return [
    {
      label: "Cash disponible",
      value: snapshot.cashAvailable,
      delta: snapshot.cashDelta30d,
      icon: <PiggyBank className="h-6 w-6" />,
      color: "primary",
      description: "Données de démonstration agrégées localement (aucune banque connectée).",
      currency: snapshot.currency
    },
    {
      label: "Burn mensuel",
      value: snapshot.burnRate,
      delta: snapshot.burnDelta30d,
      icon: <Flame className="h-6 w-6" />,
      color: "danger",
      description: "Calcul simulé à partir d'un jeu de données fictif.",
      currency: snapshot.currency
    },
    {
      label: "Runway",
      value: snapshot.runwayMonths,
      icon: <Gauge className="h-6 w-6" />,
      color: "warning",
      description: "Projection simulée pour la démonstration (pas de moteur de scénario).",
      valueFormatter: (value: number) => `${value.toFixed(1)} mois`
    }
  ];
}

function createRunwayCard(snapshot: CashSnapshot | null): RunwayCard | null {
  if (!snapshot) {
    return null;
  }

  return {
    cash: snapshot.cashAvailable,
    burn: snapshot.burnRate,
    runway: snapshot.runwayMonths,
    currency: snapshot.currency
  };
}

function getSnapshotUpdateLabel(snapshot: CashSnapshot | null): string {
  if (!snapshot) {
    return "Chargement en cours";
  }

  return `Mise à jour ${new Date(snapshot.updatedAt).toLocaleTimeString("fr-FR", UPDATE_TIME_OPTIONS)}`;
}
