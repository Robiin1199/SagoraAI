import "server-only";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const mockSnapshot: CashSnapshot = {
  currency: "EUR",
  updatedAt: new Date().toISOString(),
  cashAvailable: 718_450,
  burnRate: -112_300,
  runwayMonths: 6.4,
  cashDelta30d: 8.6,
  burnDelta30d: -4.1,
  runwayDelta30d: 0.3,
  alerts: [
    {
      id: "cash-burn",
      title: "Alerte cash burn",
      description: "Le burn mensuel dépasse le budget de 12%. Revoyez le plan de recrutement.",
      severity: "warning",
      timestamp: "Il y a 2 h"
    },
    {
      id: "invoice-overdue",
      title: "Facture client > 90 jours",
      description: "Client Madera : 86 k€ en attente, dernière relance le 2 mai.",
      severity: "danger",
      timestamp: "Il y a 5 h"
    },
    {
      id: "security-review",
      title: "Revue sécurité hebdo",
      description: "Aucun incident critique. 2 tentatives de connexion bloquées.",
      severity: "success",
      timestamp: "Hier"
    }
  ]
};

const mockForecast: CashForecast = {
  horizonDays: 90,
  currency: "EUR",
  points: [
    { label: "J0", value: 720_000 },
    { label: "J7", value: 695_000 },
    { label: "J14", value: 670_000 },
    { label: "J30", value: 640_000 },
    { label: "J45", value: 625_000 },
    { label: "J60", value: 610_000 },
    { label: "J75", value: 602_000 },
    { label: "J90", value: 598_000 }
  ]
};

const mockScenarios: CashScenario[] = [
  {
    id: "base",
    variant: "BASE",
    name: "Base case",
    narrative: "Plan budgété Q2 aligné, factoring activé sur top clients.",
    runwayLabel: "6,4 mois",
    deltaLabel: "+0,3 mois vs semaine dernière",
    riskNarrative: "Risque maîtrisé"
  },
  {
    id: "stress",
    variant: "STRESS",
    name: "Stress",
    narrative: "Churn +2 pts, retard fournisseurs énergie non négocié.",
    runwayLabel: "4,9 mois",
    deltaLabel: "-1,1 mois",
    riskNarrative: "Activer plan BFR & revue coûts"
  },
  {
    id: "growth",
    variant: "GROWTH",
    name: "Growth",
    narrative: "Upsell signé + renégociation DPO énergie à 45j.",
    runwayLabel: "8,2 mois",
    deltaLabel: "+1,8 mois",
    riskNarrative: "Capacité cash sécurisée"
  }
];

async function graphQLRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL non configurée");
  }

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
  if (USE_MOCKS || !API_URL) {
    return mockSnapshot;
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
  if (USE_MOCKS || !API_URL) {
    return mockForecast;
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
  if (USE_MOCKS || !API_URL) {
    return mockScenarios;
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
