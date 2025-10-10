import "server-only";

import { graphQLRequest, USE_MOCKS } from "@/lib/api/graphql-client";
import {
  loadCashForecast,
  loadCashScenarios,
  loadCashSnapshot
} from "@/lib/server/cash-service";

export type CashSnapshot = {
  currency: string;
  updatedAt: string;
  cashAvailable: number;
  burnRate: number;
  runwayMonths: number;
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

export type CashAlert = {
  id: string;
  title: string;
  description: string;
  severity: "success" | "warning" | "danger" | "info";
  timestamp: string;
};

export async function getCashSnapshot(): Promise<CashSnapshot> {
  if (USE_MOCKS) {
    return loadCashSnapshot();
  }

  const data = await graphQLRequest<{ cashSnapshot: CashSnapshot }>(
    `#graphql
    query CashSnapshot {
      cashSnapshot {
        currency
        updatedAt
        cashAvailable
        burnRate
        runwayMonths
        cashDelta30d
        burnDelta30d
        runwayDelta30d
        alerts {
          id
          title
          description
          severity
          timestamp
        }
      }
    }
  `
  );

  return data.cashSnapshot;
}

export async function getCashForecast(): Promise<CashForecast> {
  if (USE_MOCKS) {
    return loadCashForecast(90);
  }

  const data = await graphQLRequest<{ cashForecast: CashForecast }>(
    `#graphql
    query CashForecast($horizonDays: Int!) {
      cashForecast(horizonDays: $horizonDays) {
        horizonDays
        currency
        points {
          label
          value
        }
      }
    }
  `,
    { horizonDays: 90 }
  );

  return data.cashForecast;
}

export async function getCashScenarios(): Promise<CashScenario[]> {
  if (USE_MOCKS) {
    return loadCashScenarios();
  }

  const data = await graphQLRequest<{ cashScenarios: CashScenario[] }>(
    `#graphql
    query CashScenarios {
      cashScenarios {
        id
        variant
        name
        narrative
        runwayLabel
        deltaLabel
        riskNarrative
      }
    }
  `
  );

  return data.cashScenarios;
}

