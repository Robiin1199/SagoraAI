# Registre des fonctionnalités

_(Dernière génération : 2025-10-09T22:14:31.362Z — exécuter `npm run generate:features` pour mettre à jour. Mise à jour manuelle 2025-10-09 : suivi des exports cockpit CSV/PDF.)_

## Vue d'ensemble

| Fonctionnalité | Statut | Catégorie | Owner | Mise en service | Tags |
| --- | --- | --- | --- | --- | --- |
[Analytics BFR & Aging](#bfr-analytics) | Beta | Working Capital | RevOps | 2024-05-27 | `bfr` `aging` `receivables`
[Cockpit trésorerie 360°](#cash-dashboard-overview) | Beta | Cash Management | Squad Frontend & Data | 2024-05-08 | `cash` `runway` `alerts`
[Micro-academy contextuelle](#academy-contextual) | Beta | Enablement | Customer Success | 2024-05-08 | `academy` `education`
[Plan d'actions 14 jours](#action-plan-14-days) | Beta | Operations | Product Ops | 2024-05-08 | `playbook` `operations`
[Prévision cash 90 jours](#cash-forecast-90-days) | Beta | Cash Management | Data Platform | 2024-05-08 | `forecast` `scenario`
[Scénarios cash Base/Stress/Growth](#cash-scenarios) | Beta | Cash Management | Product Analytics | 2024-05-08 | `scenario` `stress-test`
[Exports cockpit CSV/PDF](#cash-exports) | En cours | Cash Management | Squad Frontend & Data | 2025-10-09 | `export` `pdf` `csv`
[RBAC rôles externes](#rbac-external-roles) | Planifié | Security | Platform Engineering | — | `security` `rbac`
[Relances clients automatisées](#automated-dunning) | Planifié | Working Capital | Revenue Operations | — | `bfr` `automation`

## Détails

## Analytics BFR & Aging (bfr-analytics)
- **Statut** : Beta
- **Owner** : RevOps
- **Catégorie** : Working Capital
- **Mise en service** : 2024-05-27
- **Tags** : `bfr` `aging` `receivables`
Module interactif DSO/DPO/DIO reposant sur un dataset figé pour la démonstration (pas de calcul back-office).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
DSO calculé | Tolérance ±1 jour | N/A (calculs statiques)
Taux de segmentation remplie | >= 90% | N/A (aucune donnée temps réel)

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Cockpit Cash & BFR](../SAGORA_APP_CODEX.md#132-cockpit-cash--bfr)

> Sous-fonctionnalités cibles : calculs DSO/DPO/DIO sur données réelles ; exports aging; workflows d’escalade connectés.


## Cockpit trésorerie 360° (cash-dashboard-overview)
- **Statut** : Beta
- **Owner** : Squad Frontend & Data
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `cash` `runway` `alerts`
Vue consolidée cash/burn/runway alimentée par un jeu de données de démonstration (mocks front-end).
### Mises à jour récentes
- 2025-10-09 : API GraphQL `/api/graphql` (Next.js) fournit les résumés cash/forecast/scénarios depuis le backend (données simulées).
- 2025-10-09 : Ajout d'un module d'export CSV/PDF directement depuis le cockpit (données mockées, sans signature encore).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps de chargement cockpit | < 3 s p95 | N/A (données démo statiques)
Adoption équipes finance | >= 5 utilisateurs actifs / entité | N/A (compteur non instrumenté dans la démo)

### Documentation & références

- [Codex – Cockpit Cash & BFR](../SAGORA_APP_CODEX.md#132-cockpit-cash--bfr)

> Sous-fonctionnalités cibles : connexion PSD2 temps réel ; actualisation automatique ; export PDF/CSV.


## Micro-academy contextuelle (academy-contextual)
- **Statut** : Beta
- **Owner** : Customer Success
- **Catégorie** : Enablement
- **Mise en service** : 2024-05-08
- **Tags** : `academy` `education`
Modules pédagogiques statiques alignés sur les KPI affichés pour la démo (pas de plateforme d'apprentissage).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Taux de complétion | >= 70% | N/A (tracking non branché)
CSAT module | >= 4.5/5 | N/A (retours clients non collectés)

### Dépendances

- [action-plan-14-days](#action-plan-14-days)

### Documentation & références

- [Codex – Academy](../SAGORA_APP_CODEX.md#134-academy--aide-contextuelle)

> Phase démo : contenu figé. Sous-fonctionnalités cibles : CMS éditorial, tracking engagement, personnalisation par segment.


## Plan d'actions 14 jours (action-plan-14-days)
- **Statut** : Beta
- **Owner** : Product Ops
- **Catégorie** : Operations
- **Mise en service** : 2024-05-08
- **Tags** : `playbook` `operations`
Workflow priorisé affiché dans le front pour la démo (pas d'automatisation ni de synchronisation CRM).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps moyen de clôture action | < 7 jours | N/A (aucun suivi d'exécution)
Impact cash cumulé | >= 150 k€ / mois | N/A (indicateur non mesuré)

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Playbooks](../SAGORA_APP_CODEX.md#12-playbooks-exemples)

> Sous-fonctionnalités cibles : synchronisation CRM/ERP; suivi d'exécution; notifications multi-canaux.


## Prévision cash 90 jours (cash-forecast-90-days)
- **Statut** : Beta
- **Owner** : Data Platform
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `forecast` `scenario`
Projection cash simulée servie via la route GraphQL `/api/graphql` (données backend déterministes, toujours sans moteur temps réel).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Erreur MAPE rolling 30j | < 8% | N/A (pas de modèle en production)
Latence recalcul | < 2 min | N/A (rafraîchissement non implémenté)

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Cash Insights](../SAGORA_APP_CODEX.md#136-cash-insights-iteration-en-cours)

> Sous-fonctionnalités cibles : moteur de prévision relié à la data warehouse ; gestion des hypothèses; export des scénarios.


## Scénarios cash Base/Stress/Growth (cash-scenarios)
- **Statut** : Beta
- **Owner** : Product Analytics
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `scenario` `stress-test`
Comparaison multi-scénarios désormais restituée par la route GraphQL `/api/graphql` (données simulées, aucun moteur de stress-test).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps pour basculer de scénario | < 5 s | N/A (interactions locales uniquement)
Taux d'utilisation | >= 60% des sessions cockpit | N/A (tracking usage absent)

### Dépendances

- [cash-forecast-90-days](#cash-forecast-90-days)

### Documentation & références

- [Roadmap – V1 Pilotage Cash](../components/roadmap.tsx)

> Sous-fonctionnalités cibles : moteur de simulation branché aux hypothèses; sauvegarde de scénarios; partage collaboratif.


## Exports cockpit CSV/PDF (cash-exports)
- **Statut** : En cours
- **Owner** : Squad Frontend & Data
- **Catégorie** : Cash Management
- **Mise en service** : 2025-10-09
- **Tags** : `export` `pdf` `csv`
Génération locale des exports CSV et PDF sur la base des données mockées du cockpit, disponible depuis le module Prévision cash.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
| Taux d'export mensuel | >= 70% des comptes actifs | N/A (tracking non branché dans la démo) |
| Temps de génération | < 5 s | ~1 s (front, dataset mock) |

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)
- [cash-forecast-90-days](#cash-forecast-90-days)

### Documentation & références

- [Roadmap – Étape B](../roadmap.md#étape-b--cockpit-cash--réel)
- [Codex – Cockpit Cash & BFR](../SAGORA_APP_CODEX.md#132-cockpit-cash--bfr)

> Prochaines étapes : brancher l'export sur le service de signature + stockage versionné.


## RBAC rôles externes (rbac-external-roles)
- **Statut** : Planifié
- **Owner** : Platform Engineering
- **Catégorie** : Security
- **Mise en service** : —
- **Tags** : `security` `rbac`
Gestion fine des rôles External/Viewer avec masquage IBAN et restrictions de périmètre.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Incidents d'accès non autorisé | 0 incident | 0 incident

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Sécurité & Accès](../SAGORA_APP_CODEX.md#133-securite--acces)

> Spécifications en revue sécurité interne, ciblé post-intégration Auth0. Dépend du remplacement de l'authentification locale de démo.


## Relances clients automatisées (automated-dunning)
- **Statut** : Planifié
- **Owner** : Revenue Operations
- **Catégorie** : Working Capital
- **Mise en service** : —
- **Tags** : `bfr` `automation`
Orchestration emails/SMS + tâches CRM déclenchées par aging et seuils de risque (non démarré dans ce dépôt).
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Réduction DSO | -5 jours vs baseline | Non démarré (bloqué par l'absence d'intégration emailing/CRM)

### Dépendances

- [bfr-analytics](#bfr-analytics)
- [action-plan-14-days](#action-plan-14-days)

### Documentation & références

- [Roadmap – V2 Collaboration](../components/roadmap.tsx)

> Ciblé pour T3 2024; dépend du moteur emailing transactionnel. Sous-fonctionnalités cibles : triggers aging, templates multicanaux, synchronisation CRM.
