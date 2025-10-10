import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  loadCashForecast,
  loadCashScenarios,
  loadCashSnapshot
} from "@/lib/server/cash-service";

describe("cash service domain", () => {
  it("returns a snapshot with computed deltas and alerts", () => {
    const snapshot = loadCashSnapshot();

    assert.equal(snapshot.currency, "EUR");
    assert.equal(snapshot.cashAvailable, 718_450);
    assert.equal(snapshot.burnRate, -112_300);
    assert.equal(snapshot.runwayMonths, 6.4);
    assert.equal(snapshot.cashDelta30d, 8.6);
    assert.equal(snapshot.burnDelta30d, -4.1);
    assert.equal(snapshot.runwayDelta30d, 0.3);
    assert.equal(snapshot.alerts.length, 3);
  });

  it("builds a deterministic forecast timeline", () => {
    const forecast = loadCashForecast(90);

    assert.equal(forecast.horizonDays, 90);
    assert.deepEqual(
      forecast.points.map((point) => point.label),
      ["J0", "J7", "J14", "J30", "J45", "J60", "J75", "J90"]
    );
    assert.equal(forecast.points[0]?.value, 718_450);
    assert.equal(forecast.points.at(-1)?.value, 598_000);
  });

  it("derives scenario deltas from the snapshot baseline", () => {
    const scenarios = loadCashScenarios();
    const base = scenarios.find((scenario) => scenario.variant === "BASE");
    const stress = scenarios.find((scenario) => scenario.variant === "STRESS");
    const growth = scenarios.find((scenario) => scenario.variant === "GROWTH");

    assert.ok(base);
    assert.ok(stress);
    assert.ok(growth);

    assert.equal(base?.deltaLabel, "+0,3 mois vs 30j");
    assert.ok(stress?.deltaLabel.startsWith("-1,"));
    assert.ok(stress?.deltaLabel.endsWith("vs base"));
    assert.ok(growth?.runwayLabel.startsWith("8,"));
  });
});
