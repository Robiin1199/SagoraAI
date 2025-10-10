import "server-only";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const API_URL = resolveApiUrl();

export async function graphQLRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
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

