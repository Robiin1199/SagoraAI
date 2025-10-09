import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STATUS_ORDER = ["live", "beta", "in-progress", "planned", "idea", "deprecated"];
const STATUS_LABELS = {
  live: "Live",
  beta: "Beta",
  "in-progress": "En cours",
  planned: "Planifié",
  idea: "Idée",
  deprecated: "Retiré"
};

function sortFeatures(items) {
  return [...items].sort((a, b) => {
    const statusDiff = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    return a.name.localeCompare(b.name, "fr-FR");
  });
}

function escapePipes(text = "") {
  return text.replace(/\|/g, "\\|");
}

function formatTags(tags = []) {
  return tags.length ? tags.map((tag) => `\`${tag}\``).join(" ") : "—";
}

function formatRelease(release) {
  if (!release) {
    return "—";
  }

  return release;
}

function buildSummaryTable(sortedFeatures) {
  const header = "| Fonctionnalité | Statut | Catégorie | Owner | Mise en service | Tags |";
  const separator = "| --- | --- | --- | --- | --- | --- |";
  const rows = sortedFeatures.map((feature) =>
    [
      `[${escapePipes(feature.name)}](#${feature.id})`,
      STATUS_LABELS[feature.status] ?? feature.status,
      escapePipes(feature.category),
      escapePipes(feature.owner),
      formatRelease(feature.release),
      escapePipes(formatTags(feature.tags))
    ].join(" | ")
  );

  return [header, separator, ...rows].join("\n");
}

function buildMetricsSection(metrics = []) {
  if (!metrics.length) {
    return "";
  }

  const header = "| KPI | Cible | Actuel |";
  const separator = "| --- | --- | --- |";
  const rows = metrics.map((metric) =>
    [escapePipes(metric.name), escapePipes(metric.target), escapePipes(metric.current ?? "—")].join(" | ")
  );

  return [`### KPI & métriques`, "", header, separator, ...rows, ""].join("\n");
}

function buildDependenciesSection(dependencies = []) {
  if (!dependencies.length) {
    return "";
  }

  const items = dependencies.map((dependency) => `- [${dependency}](#${dependency})`).join("\n");

  return [`### Dépendances`, "", items, ""].join("\n");
}

function buildLinksSection(links = []) {
  if (!links.length) {
    return "";
  }

  const items = links
    .map((link) => `- [${escapePipes(link.label)}](${link.url})`)
    .join("\n");

  return [`### Documentation & références`, "", items, ""].join("\n");
}

function buildNotesSection(notes) {
  if (!notes) {
    return "";
  }

  return [`> ${notes}`, ""].join("\n");
}

function buildFeatureSection(feature) {
  const lines = [
    `## ${feature.name} (${feature.id})`,
    "",
    `- **Statut** : ${STATUS_LABELS[feature.status] ?? feature.status}`,
    `- **Owner** : ${feature.owner}`,
    `- **Catégorie** : ${feature.category}`,
    `- **Mise en service** : ${formatRelease(feature.release)}`,
    `- **Tags** : ${formatTags(feature.tags)}`,
    "",
    feature.description,
    ""
  ];

  lines.push(buildMetricsSection(feature.metrics));
  lines.push(buildDependenciesSection(feature.dependencies));
  lines.push(buildLinksSection(feature.links));
  lines.push(buildNotesSection(feature.notes));

  return lines.filter(Boolean).join("\n");
}

async function loadRegistry() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const registryPath = path.join(currentDir, "../lib/features/registry.json");
  const raw = await fs.readFile(registryPath, "utf8");
  return JSON.parse(raw);
}

async function generate() {
  const registry = await loadRegistry();
  const sortedFeatures = sortFeatures(registry);
  const now = new Date();
  const intro = [
    "# Registre des fonctionnalités",
    "",
    `_(Dernière génération : ${now.toISOString()} — exécuter \`npm run generate:features\` pour mettre à jour.)_`,
    "",
    "## Vue d'ensemble",
    "",
    buildSummaryTable(sortedFeatures),
    "",
    "## Détails",
    "",
    sortedFeatures.map((feature) => buildFeatureSection(feature)).join("\n\n")
  ].join("\n");

  const docsDir = path.join(process.cwd(), "docs", "features");
  await fs.mkdir(docsDir, { recursive: true });
  const outputPath = path.join(docsDir, "registry.md");

  await fs.writeFile(outputPath, intro, "utf8");
}

generate().catch((error) => {
  console.error("Erreur lors de la génération de la documentation des fonctionnalités", error);
  process.exitCode = 1;
});

