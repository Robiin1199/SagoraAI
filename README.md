# Sagora Cockpit Financier

MVP Next.js (App Router) connecté à Postgres (Neon) avec authentification Google, import CSV des factures et calcul automatisé des KPIs via Inngest.

## Stack principale

- **Next.js 14** (App Router, React Server Components, TypeScript)
- **Tailwind CSS** + composants personnalisés (shadcn-inspired)
- **NextAuth.js** (Google OAuth, Prisma adapter)
- **Prisma** + **Neon Postgres**
- **UploadThing** pour l’upload CSV sécurisé
- **Inngest** pour le job `computeMetrics`
- **Vitest** + **Playwright** pour les tests

## Pré-requis

1. Créer une base Postgres Neon et récupérer l’URL de connexion (mode `sslmode=require`).
2. Créer un projet OAuth Google (type « Application Web ») et autoriser les URLs Vercel (`https://<project>.vercel.app/api/auth/callback/google`).
3. Créer un compte UploadThing et générer `UPLOADTHING_SECRET` + `UPLOADTHING_APP_ID`.
4. Créer un compte Inngest et récupérer `INNGEST_EVENT_KEY` et `INNGEST_SIGNING_KEY`.
5. Dupliquer `.env.example` vers `.env.local` et remplir toutes les variables :

```bash
cp .env.example .env.local
```

## Installation & développement

```bash
npm install
npm run dev
```

La première connexion Google crée automatiquement :
- une `Organization` avec slug unique,
- un `Membership` OWNER pour l’utilisateur,
- un recalcul des métriques initiales via Inngest.

## Base de données

Les modèles Prisma couvrent : `Organization`, `User`, `Membership`, `Invoice`, `MetricSnapshot` ainsi que les tables NextAuth (accounts, sessions, tokens).

- Migrations : `npm run migrate`
- Génération Prisma (post-install) : `npx prisma generate`
- Console Prisma Studio : `npx prisma studio`

## Import CSV des factures

- L’upload se fait via UploadThing (`/api/uploadthing`).
- Un mapping Zod valide les colonnes (`invoice_number`, `customer_name`, `amount`, dates, statut).
- Les factures sont normalisées et upsertées par organisation.
- Un évènement Inngest `metrics/compute` est envoyé après chaque import.

## Job Inngest `computeMetrics`

Calcule et stocke un `MetricSnapshot` :
- Cash disponible = seed (`METRIC_SEED_CASH`) + factures payées
- Burn mensuel = seed (`METRIC_SEED_BURN`, en négatif)
- Runway = Cash / |Burn|
- DSO = créances / ventes moyennes (90 jours)

L’API `/api/metrics/*` expose ces valeurs et le dashboard (RSC) les consomme directement.

## Tests & qualité

- `npm run lint` – ESLint Next.js
- `npm run test` – Vitest (unitaires, parsing CSV)
- `npm run test:e2e` – Playwright (scénario documenté, `skip` par défaut faute de Google OAuth en CI)

## CI GitHub Actions

Un workflow `ci.yml` exécute :
1. Installation des dépendances
2. `npm run lint`
3. `npm run test`
4. `npm run test:e2e`
5. `npm run migrate` (Prisma migrate deploy)

Configurer les secrets (`DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_*`, `GOOGLE_*`, `UPLOADTHING_*`, `INNGEST_*`) dans GitHub > Settings > Secrets and variables.

## Déploiement Vercel

- Ajouter les variables d’environnement pour **Production** et **Preview**.
- Activer `NEXTAUTH_URL` selon l’environnement (`https://<preview>.vercel.app`, `https://<prod>.vercel.app`).
- Ajouter les domaines OAuth Google dans la console Google Cloud (origin + redirect).
- Vercel détecte automatiquement `npm run build` et `.next`.

## Flux utilisateur

1. L’utilisateur se connecte via Google → création de l’organisation et du membership OWNER.
2. Il importe un CSV de factures → UploadThing + parsing Zod + Prisma upsert.
3. Inngest calcule les métriques → `MetricSnapshot` stocké.
4. Le dashboard lit `MetricSnapshot` / `Invoice` via RSC et affiche Cash, Burn, Runway, DSO, alertes et BFR.

Pour plus de contexte fonctionnel, consulter [`SAGORA_APP_CODEX.md`](./SAGORA_APP_CODEX.md).
