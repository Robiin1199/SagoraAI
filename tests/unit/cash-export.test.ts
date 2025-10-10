import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CashForecast, CashScenario, CashSnapshot } from "@/lib/api/cash";
import {
  buildCashExportSummary,
  generateCashCsvContent,
  isCashExportEmpty
} from "@/lib/export/cash";

describe("cash export helpers", () => {
  const snapshot: CashSnapshot = {
    currency: "EUR",
    updatedAt: "2025-10-10T00:00:00.000Z",
    cashAvailable: 125_000,
    burnRate: -38_500,
    runwayMonths: 6.5,
    cashDelta30d: 4.2,
    burnDelta30d: -1.3,
    runwayDelta30d: 0.4,
    alerts: [
      {
        id: "overdue-invoice",
        title: "Facture > 60 jours",
        description: "Client Atlas : 24 k€ en attente",
        severity: "warning",
        timestamp: "Il y a 1 h"
      }
    ]
  };

  const forecast: CashForecast = {
    horizonDays: 90,
    currency: "EUR",
    points: [
      { label: "J0", value: 125_000 },
      { label: "J30", value: 102_500 }
    ]
  };

  const scenarios: CashScenario[] = [
    {
      id: "base",
      variant: "BASE",
      name: "Base case",
      narrative: "",
      runwayLabel: "6,5 mois",
      deltaLabel: "+0,4 mois vs 30j",
      riskNarrative: "Risque \"maîtrisé\"; prévoir plan B"
    }
  ];

  const lastUpdateLabel = "Mise à jour il y a 2 h";

  it("builds a structured summary per section", () => {
    const sections = buildCashExportSummary({
      snapshot,
      forecast,
      scenarios,
      currency: "EUR",
      lastUpdateLabel
    });

    assert.equal(sections.length, 4);
    assert.deepEqual(
      sections.map((section) => section.key),
      ["snapshot", "alerts", "forecast", "scenarios"]
    );
    assert.equal(sections[0].items[0].value.includes("€"), true);
    assert.equal(sections[0].items[0].details, lastUpdateLabel);
    assert.ok(sections[1].items[0].value.includes("Atlas"));
    assert.equal(sections[2].items[0].label, "Horizon (jours)");
    assert.ok(sections[3].items[0].details?.includes("Risque"));
  });

  it("converts the summary to a CSV payload with escaping", () => {
    const sections = buildCashExportSummary({
      snapshot,
      forecast,
      scenarios,
      currency: "EUR",
      lastUpdateLabel
    });

    const csv = generateCashCsvContent(sections);
    const lines = csv.split("\n");

    assert.equal(lines[0], "Section;Label;Valeur;Détails");
    assert.ok(lines[1].startsWith("Synthèse cash;Cash disponible;"));
    assert.ok(
      lines.some((line) =>
        line.includes("\"+0,4 mois vs 30j · Risque \"\"maîtrisé\"\"; prévoir plan B\"")
      )
    );
  });

  it("detects when no export data is available", () => {
    const emptySections = buildCashExportSummary({
      snapshot: null,
      forecast: null,
      scenarios: [],
      currency: "EUR",
      lastUpdateLabel
    });

    assert.equal(emptySections.length, 0);
    assert.equal(isCashExportEmpty(emptySections), true);
  });
});
