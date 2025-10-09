# SAGORA_APP_CODEX.md
# Objectif : référentiel unique “guidelines + backlog” pour l’app FINARY-like de Sagora (PME).
# Ton : clair, actionnable, axé performance. Mots-clés : finance, growth, optimisation, clarté, stratégie, automation, analytics, éducation, décision.

## 0) Métadonnées
- Produit : Sagora – Cockpit financier PME
- Propriétaire : Équipe Produit Sagora
- Dernière MAJ : 2024-06-07
- Statut : En cours
- Version : 0.3
- Roadmap associée : [`docs/roadmap.md`](./docs/roadmap.md)

## 1) Contexte & Vision (Contexte)
- Problème : vision financière morcelée (banques, compta, ERP), lenteur de décision, manque d’actions concrètes.
- Vision : “Le cockpit financier de la PME” — agrégation, prévision cash, BFR, dettes, rentabilité, recommandations actionnables.
- Principes : Clarté, Transparence, Rigueur, Innovation, Proximité (UE).

> **État actuel (MVP démo 2024-05-29)** :
> - Cockpit front-end Next.js alimenté par jeux de données statiques/mocks (aucune connexion PSD2, ERP ou CRM).
> - Authentification locale via `localStorage` sans serveur ni RBAC.
> - Modules alertes, plan d’actions, scénarios et academy exposent un contenu figé destiné à la démonstration.

## 2) Portée & Non-objectifs (Analyse)
**Portée MVP cible (90 jours)**
- Agrégation banques (PSD2) + 1 intégration comptable prioritaire.
- Cockpit Cash (J+0 à J+90), BFR (DSO/DPO/DIO), alertes basiques, Academy contextuelle.
- Sécurité de base (RBAC, audit log), i18n FR/EN.

**État actuel livré (démo front-end)**
- Cockpit Cash & BFR rendus dans Next.js avec données statiques.
- Scénarios cash et plan d’actions affichés sans moteur de calcul.
- Auth local-only (stockage navigateur), aucune intégration externe ni i18n.

**Non-objectifs MVP**
- Consolidation multi-groupes complexe, marketplace complète, mobile natif, ISO 27001 certifiée.

## 3) Architecture Logique (grand angle)
Sources → Ingestion (ETL temps réel / batch) → Normalisation (plan de comptes pivot) → Data Lake/Warehouse (bronze/silver/gold) → Feature Store (ML) → Core Services (AuthZ, Rules, Cash Engine, Billing) → Analytics API (KPIs, Forecast) → Front-end (Web).

## 4) Architecture Technique (guidelines)
- Front : Next.js/React, TypeScript, ECharts/Recharts, Tailwind, i18n, tests (Jest + Playwright).
- Back : Node.js/TypeScript (NestJS) ou Kotlin/Spring ; GraphQL + REST ; gRPC interne.
- Data : Kafka/Redpanda, DBT, BigQuery/Snowflake, Airflow/Prefect, MLflow, Feast, Redis.
- Infra : Kubernetes, Terraform, Postgres OLTP, object storage (Parquet), OpenTelemetry, Prometheus/Grafana, Vault.
- Sécurité : OIDC (Keycloak/Auth0), TLS 1.2+, KMS, WAF, SIEM; GDPR (DPA, DSR), hébergement UE.

> Implémentation actuelle : seule la couche front Next.js statique est disponible dans ce dépôt; les services backend/data décrits ci-dessus ne sont pas livrés.

## 5) Modèle de Données (extrait)
- Account(id, entity_id, provider, type, currency, iban_mask)
- Transaction(id, account_id, posted_at, amount, currency, category, counterparty, invoice_id?)
- Invoice(id, entity_id, customer_id, status, due_date, amount_net, tax, terms, currency)
- Forecast(id, entity_id, horizon_days, method, assumptions_json, series_json, version, created_at)
- Covenant(id, lender, ratio, threshold, frequency, status, measured_at)
- Alert(id, entity_id, severity, rule_key, trigger_payload, created_by, recipients)
- AuditLog(id, actor, action, resource, before, after, ip, ts)

**Règles** : immutabilité des sources, horodatage UTC, SCD2 sur dimensions, clés naturelles masquées (IBAN tokenized).

## 6) APIs (contrats & conventions)
- REST/GraphQL, pagination cursor-based, idempotence sur POST idempotent-key, standard erreurs RFC7807.
- Versionning : /v1 ; breaking changes via nouvelle version.
- Sécurité : OAuth2/OIDC, scopes minimaux, rate-limit par token & IP.

> Pas d’API ni de backend dans la version démo : toutes les données proviennent de mocks front-end.

## 7) Sécurité & Confidentialité (bons réflexes)
- RBAC/ABAC : scopes par entité, devise, BU ; séparation des rôles (Owner, FinanceAdmin, Analyst, Viewer, External).
- Données : chiffrage at-rest (KMS), in-transit (TLS), rotation de clés, journaux immuables, BCP/DR (RPO/RTO définis).
- GDPR : base légale, consentements, DSR (export/suppression), minimisation, rétention configurée.

> Actuellement remplacé par un stockage local navigateur sans chiffrement ni audit.

## 8) Observabilité & Performance
- Traces distribuées (OpenTelemetry), corrélation request-id.
- SLO : p95 latence API < 300 ms (lecture), dispos 99.9% ; temps de sync bancaire < 5 min ; temps “première prévision cash” < 60 min.
- Alerting : erreurs 5xx, dérive modèles ML, retards pipelines, échec webhooks.

## 9) Accessibilité, i18n, UX
- WCAG AA, focus states, contraste, clavier.
- i18n : FR uniquement dans le MVP démo (switch EN planifié); formats EU (dd/mm/yyyy, €, TVA).
- UX : 3–5 KPI par vue, cartes à bords arrondis, hiérarchie claire, tooltips pédagogiques, Academy contextuelle.

## 10) Qualité & Code (guidelines)
- Git : trunk-based + feature flags ; PR petites, revues systématiques, Conventional Commits.
- Style : ESLint/Prettier; clean architecture, dépendances directionnelles claires; Domain DTO vs API DTO.
- Tests : pyramide (unit > integration > e2e), contract testing pour intégrations, fixtures réalistes.

## 11) Déploiement & Config
- Envs : dev/stg/prod ; secrets via Vault ; infra-as-code (Terraform).
- Migrations DB : versionnées (Liquibase/Flyway).
- Feature flags : pour dark-launch & AB tests.
- Blue/Green ou canary pour back/front.

## 12) Playbooks (exemples)
- “DSO > 50 j” → déclencher séquence relance + proposition escompte 1% top clients.
- “Runway < 45 j” → suggérer affacturage/RCF, geler CAPEX non critiques.

## 13) Backlog Traçable – Objectifs & Fonctionnalités (Action)
> Marquer **REMPLIE / NON REMPLIE / EN COURS**, + date, owner, lien PR. Synchroniser chaque mise à jour avec la roadmap (`docs/roadmap.md`).

### 13.1 MVP – Agrégation & Normalisation
- [ ] Connexion PSD2 via agrégateur TPP — **NON REMPLIE** | Owner: <…> | Due: <…> | PR: <…>
- [ ] Webhooks transactions + refresh tokens — **NON REMPLIE**
- [ ] Intégration comptable #1 (Sage/Cegid/…) — **NON REMPLIE**
- [ ] Mapper plan de comptes pivot (PCG-like) — **NON REMPLIE**

### 13.2 Cockpit Cash & BFR
- [x] Dashboard Cash J+0/J+7/J+30/J+90 — **REMPLIE** | Owner: Frontend | Date: 2024-05-08 | PR: <à compléter> | Notes: rendu Next.js alimenté par mocks (pas de PSD2).
- [x] DSO/DPO/DIO + aging — **REMPLIE** | Owner: Frontend | Date: 2024-05-27 | PR: <à compléter> (module interactif avec segmentation + plan d’action) | Notes: données fictives.
- [x] Alertes basiques (seuils) — **REMPLIE** | Owner: Frontend | Date: 2024-05-08 | PR: <à compléter> | Notes: flux statique, aucun webhook.
- [ ] Export PDF/CSV — **NON REMPLIE**

### 13.3 Sécurité & Accès
- [ ] OIDC + RBAC (Owner/FinanceAdmin/Analyst/Viewer/External) — **NON REMPLIE**
- [ ] Audit log (lecture/écriture, export) — **NON REMPLIE**

### 13.4 Academy & Aide Contextuelle
- [x] Modules “Cash 101” & “Comprendre BFR” — **REMPLIE** | Owner: Frontend | Date: 2024-05-08 | PR: <à compléter> | Notes: contenu figé dans le front.

### 13.6 Cash Insights (itération en cours)
- [x] Scénarios cash Base/Stress/Growth affichés dans le cockpit — **REMPLIE** | Owner: Frontend | Date: 2024-05-08 | PR: <à compléter>

### 13.5 Observabilité
- [ ] Traces OTel + dashboards Grafana — **NON REMPLIE**

## 14) Critères d’acceptation (template)
- Contexte : <problème business>
- Règle : <comportement attendu>
- Données : <jeu d’essai, devises, TVA>
- Mesure : <KPI/SLO>
- Tests : <unit/integration/e2e/contrat>
- Sécurité : <authz, logs>
- Accessibilité : <raccourcis, readers>
- Done quand : <liste vérifiable>

## 15) Workflow d’itération (Action)
1) Découper → 2) Implémenter feature-flag → 3) Tests auto → 4) Revue PR → 5) Déploiement canary → 6) Mesure KPI → 7) Décision maintenir/itérer.

## 16) Prompts d’alignement (LLM)
- “Valide la cohérence entre schéma Invoice et calcul du DSO, propose corrections si nécessaire.”
- “Génère 5 cas limites de prévision cash incluant saisonnalité, TVA, multi-devises.”
- “Passe en revue les erreurs API et suggère une taxonomie RFC7807 uniforme.”

