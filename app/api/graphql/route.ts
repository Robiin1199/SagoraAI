import { NextRequest, NextResponse } from "next/server";
import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql
} from "graphql";

import { loadCashForecast, loadCashScenarios, loadCashSnapshot } from "@/lib/server/cash-service";

const CashAlertType = new GraphQLObjectType({
  name: "CashAlert",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    severity: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const CashSnapshotType = new GraphQLObjectType({
  name: "CashSnapshot",
  fields: {
    currency: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    cashAvailable: { type: new GraphQLNonNull(GraphQLFloat) },
    burnRate: { type: new GraphQLNonNull(GraphQLFloat) },
    runwayMonths: { type: new GraphQLNonNull(GraphQLFloat) },
    cashDelta30d: { type: GraphQLFloat },
    burnDelta30d: { type: GraphQLFloat },
    runwayDelta30d: { type: GraphQLFloat },
    alerts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CashAlertType))) }
  }
});

const CashForecastPointType = new GraphQLObjectType({
  name: "CashForecastPoint",
  fields: {
    label: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLFloat) }
  }
});

const CashForecastType = new GraphQLObjectType({
  name: "CashForecast",
  fields: {
    horizonDays: { type: new GraphQLNonNull(GraphQLInt) },
    currency: { type: new GraphQLNonNull(GraphQLString) },
    points: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CashForecastPointType))) }
  }
});

const CashScenarioType = new GraphQLObjectType({
  name: "CashScenario",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    variant: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    narrative: { type: new GraphQLNonNull(GraphQLString) },
    runwayLabel: { type: new GraphQLNonNull(GraphQLString) },
    deltaLabel: { type: new GraphQLNonNull(GraphQLString) },
    riskNarrative: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    cashSnapshot: {
      type: new GraphQLNonNull(CashSnapshotType),
      resolve: () => loadCashSnapshot()
    },
    cashForecast: {
      type: new GraphQLNonNull(CashForecastType),
      args: {
        horizonDays: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (_source, args: { horizonDays: number }) => {
        const safeHorizon = Number.isFinite(args.horizonDays)
          ? Math.max(0, Math.min(365, args.horizonDays))
          : 90;

        return loadCashForecast(safeHorizon);
      }
    },
    cashScenarios: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CashScenarioType))),
      resolve: () => loadCashScenarios()
    }
  }
});

const schema = new GraphQLSchema({ query: QueryType });

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Corps JSON invalide" }] },
      { status: 400 }
    );
  }

  const { query, variables, operationName } = body as {
    query?: unknown;
    variables?: unknown;
    operationName?: string | null;
  };

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { errors: [{ message: "Requête GraphQL manquante" }] },
      { status: 400 }
    );
  }

  const result = await graphql({
    schema,
    source: query,
    variableValues: (variables as Record<string, unknown> | undefined) ?? undefined,
    operationName
  });

  return NextResponse.json(result, { status: 200 });
}

export function GET() {
  return NextResponse.json(
    { errors: [{ message: "Utilisez POST pour interroger l'API GraphQL." }] },
    { status: 405 }
  );
}
