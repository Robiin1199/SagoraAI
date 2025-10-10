import { formatCurrency } from "@/lib/utils";
import type { CashForecast, CashScenario, CashSnapshot } from "@/lib/api/cash";

export type CashExportSection = {
  key: string;
  title: string;
  items: Array<{
    label: string;
    value: string;
    details?: string;
  }>;
};

export type BuildCashExportSummaryInput = {
  snapshot: CashSnapshot | null;
  forecast: CashForecast | null;
  scenarios: CashScenario[];
  currency: string;
  lastUpdateLabel: string;
};

function escapeCsvValue(value: string) {
  if (value.includes(";") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function buildCashExportSummary({
  snapshot,
  forecast,
  scenarios,
  currency,
  lastUpdateLabel
}: BuildCashExportSummaryInput): CashExportSection[] {
  const sections: CashExportSection[] = [];

  if (snapshot) {
    sections.push({
      key: "snapshot",
      title: "Synthèse cash",
      items: [
        {
          label: "Cash disponible",
          value: formatCurrency(snapshot.cashAvailable, currency),
          details: lastUpdateLabel
        },
        {
          label: "Burn mensuel",
          value: formatCurrency(snapshot.burnRate, currency),
          details: snapshot.burnDelta30d ? `${snapshot.burnDelta30d.toFixed(1)} pts vs 30j` : undefined
        },
        {
          label: "Runway",
          value: `${snapshot.runwayMonths.toFixed(1)} mois`,
          details: snapshot.runwayDelta30d ? `${snapshot.runwayDelta30d.toFixed(1)} mois vs 30j` : undefined
        }
      ]
    });

    if (snapshot.alerts.length) {
      sections.push({
        key: "alerts",
        title: "Alertes actives",
        items: snapshot.alerts.map((alert) => ({
          label: alert.title,
          value: alert.description,
          details: alert.timestamp
        }))
      });
    }
  }

  if (forecast) {
    sections.push({
      key: "forecast",
      title: "Prévision 90 jours",
      items: [
        {
          label: "Horizon (jours)",
          value: `${forecast.horizonDays}`
        },
        ...forecast.points.map((point) => ({
          label: point.label,
          value: formatCurrency(point.value, currency)
        }))
      ]
    });
  }

  if (scenarios.length) {
    sections.push({
      key: "scenarios",
      title: "Scénarios",
      items: scenarios.map((scenario) => ({
        label: scenario.name,
        value: scenario.runwayLabel,
        details: `${scenario.deltaLabel} · ${scenario.riskNarrative}`
      }))
    });
  }

  return sections;
}

export function generateCashCsvContent(sections: CashExportSection[]) {
  const rows: string[][] = [["Section", "Label", "Valeur", "Détails"]];

  sections.forEach((section) => {
    section.items.forEach((item) => {
      rows.push([
        section.title,
        item.label,
        item.value,
        item.details ?? ""
      ]);
    });
  });

  return rows.map((row) => row.map(escapeCsvValue).join(";")).join("\n");
}

export function isCashExportEmpty(sections: CashExportSection[]) {
  return sections.every((section) => section.items.length === 0);
}

export function getCsvBlob(payload: string) {
  return new Blob(["\uFEFF" + payload], {
    type: "text/csv;charset=utf-8;"
  });
}
