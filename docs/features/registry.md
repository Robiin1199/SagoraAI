# Registre des fonctionnalités

_(Dernière génération : 2025-10-09T21:46:47.728Z — exécuter `npm run generate:features` pour mettre à jour.)_

## Vue d'ensemble

| Fonctionnalité | Statut | Catégorie | Owner | Mise en service | Tags |
| --- | --- | --- | --- | --- | --- |
[Analytics BFR & Aging](#bfr-analytics) | Live | Working Capital | RevOps | 2024-05-27 | `bfr` `aging` `receivables`
[Cockpit trésorerie 360°](#cash-dashboard-overview) | Live | Cash Management | Squad Frontend & Data | 2024-05-08 | `cash` `runway` `alerts`
[Plan d'actions 14 jours](#action-plan-14-days) | Live | Operations | Product Ops | 2024-05-08 | `playbook` `operations`
[Prévision cash 90 jours](#cash-forecast-90-days) | Live | Cash Management | Data Platform | 2024-05-08 | `forecast` `scenario`
[Scénarios cash Base/Stress/Growth](#cash-scenarios) | Live | Cash Management | Product Analytics | 2024-05-08 | `scenario` `stress-test`
[Micro-academy contextuelle](#academy-contextual) | Beta | Enablement | Customer Success | 2024-05-08 | `academy` `education`
[Relances clients automatisées](#automated-dunning) | En cours | Working Capital | Revenue Operations | — | `bfr` `automation`
[RBAC rôles externes](#rbac-external-roles) | Planifié | Security | Platform Engineering | — | `security` `rbac`

## Détails

## Analytics BFR & Aging (bfr-analytics)
- **Statut** : Live
- **Owner** : RevOps
- **Catégorie** : Working Capital
- **Mise en service** : 2024-05-27
- **Tags** : `bfr` `aging` `receivables`
Module interactif DSO/DPO/DIO avec segmentation aging et plan d'action par segment.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
DSO calculé | Tolérance ±1 jour | +0,6 jour
Taux de segmentation remplie | >= 90% | 92%

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Cockpit Cash & BFR](../SAGORA_APP_CODEX.md#132-cockpit-cash--bfr)


## Cockpit trésorerie 360° (cash-dashboard-overview)
- **Statut** : Live
- **Owner** : Squad Frontend & Data
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `cash` `runway` `alerts`
Vue consolidée cash/burn/runway alimentée par l'agrégation PSD2 et les prévisions 90 jours.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps de chargement cockpit | < 3 s p95 | 2,1 s p95
Adoption équipes finance | >= 5 utilisateurs actifs / entité | 7 utilisateurs actifs / entité

### Documentation & références

- [Codex – Cockpit Cash & BFR](../SAGORA_APP_CODEX.md#132-cockpit-cash--bfr)


## Plan d'actions 14 jours (action-plan-14-days)
- **Statut** : Live
- **Owner** : Product Ops
- **Catégorie** : Operations
- **Mise en service** : 2024-05-08
- **Tags** : `playbook` `operations`
Workflow priorisé Alignement finance/sales/ops pour sécuriser le cash court terme.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps moyen de clôture action | < 7 jours | 5,2 jours
Impact cash cumulé | >= 150 k€ / mois | 168 k€ / mois

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Playbooks](../SAGORA_APP_CODEX.md#12-playbooks-exemples)


## Prévision cash 90 jours (cash-forecast-90-days)
- **Statut** : Live
- **Owner** : Data Platform
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `forecast` `scenario`
Modèle de projection cash alimenté par séries historiques + hypothèses factoring/budget.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Erreur MAPE rolling 30j | < 8% | 6,4%
Latence recalcul | < 2 min | 55 s

### Dépendances

- [cash-dashboard-overview](#cash-dashboard-overview)

### Documentation & références

- [Codex – Cash Insights](../SAGORA_APP_CODEX.md#136-cash-insights-iteration-en-cours)


## Scénarios cash Base/Stress/Growth (cash-scenarios)
- **Statut** : Live
- **Owner** : Product Analytics
- **Catégorie** : Cash Management
- **Mise en service** : 2024-05-08
- **Tags** : `scenario` `stress-test`
Comparaison multi-scénarios pour piloter runway et déclencher plans d'action.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Temps pour basculer de scénario | < 5 s | 3 s
Taux d'utilisation | >= 60% des sessions cockpit | 63%

### Dépendances

- [cash-forecast-90-days](#cash-forecast-90-days)

### Documentation & références

- [Roadmap – V1 Pilotage Cash](../components/roadmap.tsx)


## Micro-academy contextuelle (academy-contextual)
- **Statut** : Beta
- **Owner** : Customer Success
- **Catégorie** : Enablement
- **Mise en service** : 2024-05-08
- **Tags** : `academy` `education`
Modules pédagogiques alignés sur les KPI affichés pour renforcer la prise de décision.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Taux de complétion | >= 70% | 58%
CSAT module | >= 4.5/5 | 4.3/5

### Dépendances

- [action-plan-14-days](#action-plan-14-days)

### Documentation & références

- [Codex – Academy](../SAGORA_APP_CODEX.md#134-academy--aide-contextuelle)

> Phase beta auprès d'un panel de 12 PME. Industrialisation prévue avec la V2 Collaboration.


## Relances clients automatisées (automated-dunning)
- **Statut** : En cours
- **Owner** : Revenue Operations
- **Catégorie** : Working Capital
- **Mise en service** : —
- **Tags** : `bfr` `automation`
Orchestration emails/SMS + tâches CRM déclenchées par aging et seuils de risque.
### KPI & métriques

| KPI | Cible | Actuel |
| --- | --- | --- |
Réduction DSO | -5 jours vs baseline | En construction

### Dépendances

- [bfr-analytics](#bfr-analytics)
- [action-plan-14-days](#action-plan-14-days)

### Documentation & références

- [Roadmap – V2 Collaboration](../components/roadmap.tsx)

> Ciblé pour T3 2024; dépend du moteur emailing transactionnel.


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

> Spécifications en revue sécurité interne, ciblé post-intégration Auth0.
