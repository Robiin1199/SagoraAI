import "server-only";

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

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const API_URL = resolveApiUrl();

async function graphQLRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau (${response.status})`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Réponse GraphQL vide");
  }

  return json.data;
}

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

function resolveApiUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;
  if (appUrl) {
    return `${appUrl.replace(/\/$/, "")}/api/graphql`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const normalized = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    return `${normalized.replace(/\/$/, "")}/api/graphql`;
  }

  return "http://localhost:3000/api/graphql";
}
