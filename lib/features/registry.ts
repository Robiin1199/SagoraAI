import featuresData from "@/lib/features/registry.json";

export type FeatureStatus = "idea" | "planned" | "in-progress" | "beta" | "live" | "deprecated";

export type FeatureMetric = {
  name: string;
  target: string;
  current?: string;
};

export type FeatureLink = {
  label: string;
  url: string;
};

export type Feature = {
  id: string;
  name: string;
  status: FeatureStatus;
  category: string;
  owner: string;
  description: string;
  tags: string[];
  release?: string;
  metrics?: FeatureMetric[];
  dependencies?: string[];
  links?: FeatureLink[];
  notes?: string;
};

export const featureRegistry: Feature[] = featuresData as Feature[];

export function getFeatureById(id: string): Feature | undefined {
  return featureRegistry.find((feature) => feature.id === id);
}

export function listFeatures(filters?: {
  status?: FeatureStatus | FeatureStatus[];
  category?: string;
}): Feature[] {
  if (!filters) {
    return [...featureRegistry];
  }

  const statuses = Array.isArray(filters.status) ? filters.status : filters.status ? [filters.status] : undefined;

  return featureRegistry.filter((feature) => {
    if (statuses && !statuses.includes(feature.status)) {
      return false;
    }

    if (filters.category && feature.category !== filters.category) {
      return false;
    }

    return true;
  });
}

export function groupFeaturesByStatus(): Record<FeatureStatus, Feature[]> {
  return featureRegistry.reduce<Record<FeatureStatus, Feature[]>>(
    (acc, feature) => {
      acc[feature.status] = acc[feature.status] ?? [];
      acc[feature.status].push(feature);
      return acc;
    },
    {
      idea: [],
      planned: [],
      "in-progress": [],
      beta: [],
      live: [],
      deprecated: []
    }
  );
}

export function getFeatureStats(): {
  total: number;
  byStatus: Record<FeatureStatus, number>;
  categories: Record<string, number>;
} {
  const byStatus = featureRegistry.reduce<Record<FeatureStatus, number>>(
    (acc, feature) => {
      acc[feature.status] += 1;
      return acc;
    },
    {
      idea: 0,
      planned: 0,
      "in-progress": 0,
      beta: 0,
      live: 0,
      deprecated: 0
    }
  );

  const categories = featureRegistry.reduce<Record<string, number>>((acc, feature) => {
    acc[feature.category] = (acc[feature.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: featureRegistry.length,
    byStatus,
    categories
  };
}
