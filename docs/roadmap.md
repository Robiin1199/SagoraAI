# Roadmap produit Sagora

## Thèse produit
Sagora devient le copilote cash-flow des PME européennes en livrant une expérience "brancher, analyser, agir" qui transforme la donnée bancaire brute en décisions de trésorerie exploitables en moins d'une heure.

## KPIs Nord
- Taux de connexions bancaires actives (PSD2) > 85 % des comptes configurés.
- Time-to-first-value cockpit cash < 60 minutes entre onboarding et première vue consolidée.
- Précision prévision de trésorerie (MAPE) < 8 % sur horizon 90 jours.
- Réduction du DSO moyen client > 5 jours après 2 cycles de relance.
- Taux d'export PDF/CSV mensuel > 70 % des comptes actifs.
- Rétention hebdo W4 (utilisateurs analystes) > 60 %.

## Séquençage (ordre impératif)
### Étape A – Foundations
1. Mettre en place l'authentification OIDC (Auth0/Keycloak) avec RBAC Admin/Manager/Analyst/External-Viewer et audit log centralisé.
2. Déployer un backend Node.js (Nest/Fastify) exposant API GraphQL/REST sécurisée, orchestrée via un bus d'événements (Kafka/NATS) et persistée dans PostgreSQL chiffré at-rest.
3. Concevoir le data model pivot : plan de comptes unifié, schéma transactions normalisées, mapping multi-ERP initial (Sage/Exact) et stockage immuable (S3/Glacier) pour pièces jointes.
4. Activer observabilité de base : OpenTelemetry (traces), métriques Prometheus, logs centralisés (ELK), alerting sur SLO uptime 99.9 % et p95 < 300 ms.
5. Implémenter chiffrement in-transit (TLS) + secret management (Vault/SM) + i18n FR/EN dans le front et l'API, avec masquage IBAN pour roles externes.

### Étape B – Cockpit Cash « réel »
1. Intégrer agrégateurs PSD2 (Budget Insight/Token.io) avec consentement utilisateur, webhooks transactions, rafraîchissement automatique et gestion des erreurs bancaires.
2. Normaliser flux bancaires dans le data model pivot, rapprocher soldes en quasi temps réel et exposer API cockpit cash branchée à l'UI existante.
3. Livrer exports PDF/CSV pour les vues cockpit (soldes consolidés, cash-in/out, positions multi-banque) avec historisation et traçabilité.

### Étape C – Analytics BFR
1. Développer moteur de calcul DSO/DPO/DIO basé sur écritures comptables et facturation clients/fournisseurs.
2. Implémenter exports aging (PDF/CSV) et segmentation (client, région, bucket délai) avec filtres dynamiques.
3. Construire workflows d'escalade : règles de seuils, notifications internes, assignation à un owner via email/Slack et journalisation dans l'audit log.

### Étape D – Forecast & Scénarios
1. Créer moteur de prévision cash 90 jours (méthode direct/indirect hybride) avec gestion des hypothèses paramétrables (croissance revenus, décalage paiement, dépenses récurrentes).
2. Livrer scénarios Base/Stress/Growth avec recalculs instantanés, comparaison visuelle et sauvegarde versionnée.
3. Permettre partage collaboratif : liens sécurisés, gestion des droits par rôle, historisation des scénarios et commentaires.

### Étape E – Dunning & Academy
1. Automatiser relances clients : cadencement email/SMS, intégration CRM (HubSpot/Salesforce) et suivi des statuts de paiement.
2. Enrichir micro-academy : CMS headless (Contentful/Strapi), tracking d'engagement (Amplitude), personnalisation par segment de cash et recommandations contextuelles.
3. Boucler les exports consolidés (PDF/CSV) pour plans d'action, analytics et logs d'activité pour conformité.

## Backlog structuré

| Epic | Feature | Problème à résoudre | Portée (Done = ∑ critères) | Acceptation (Gherkin) | Dépendances | Effort (S/M/L) | RICE | Priorité (MoSCoW) | KPI cible | Risques & mitigations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Security & Compliance | Auth OIDC + RBAC + audit | Auth locale non conforme, pas de traçabilité | OIDC + RBAC 4 rôles, audit log consultable, masquage IBAN actif, rotation secrets | `Given un utilisateur External-Viewer`<br>`When il consulte un IBAN`<br>`Then les 6 derniers digits sont masqués et l'accès est loggé` | Aucun | M | 450 | Must | 100 % connexions via OIDC | Risque d'intégration IdP → sandbox dédiée et tests contractuels |
| Observability & SRE | Stack OpenTelemetry | Absence de visibilité SLO/SLA | Traces collectées, métriques exposées, alertes configurées | `Given un microservice en panne`<br>`When l'erreur survient`<br>`Then une alerte SLO est déclenchée avec trace corrélée` | Backend | M | 320 | Must | Temps MTTR < 1h | Volume logs → retention 30j + cold storage |
| Aggregation & Normalization Finance | Connecteurs PSD2 + pipeline | Données bancaires manquantes | Consentement PSD2, webhooks, normalisation transactions, réconciliation soldes | `Given un compte bancaire connecté`<br>`When une transaction PSD2 arrive`<br>`Then elle est normalisée et visible dans le cockpit < 2 min` | Sécurité, Backend | L | 640 | Must | 85 % comptes connectés | Défaillance banque → fallback polling + alerting |
| Aggregation & Normalization Finance | Mapping plan de comptes pivot | Plans comptables hétérogènes | Mapping initial Sage/Exact, tests de cohérence, API mapping exposée | `Given un import Sage`<br>`When il est traité`<br>`Then les comptes sont rattachés au pivot sans conflit` | Backend | M | 300 | Must | 95 % écritures mappées auto | Exceptions mapping → UI de correction manuelle |
| Cash Cockpit 360 (live) | Exports PDF/CSV cockpit | Besoin d'archives auditables | Génération PDF/CSV, téléchargement historisé, signature hash | `Given un manager`<br>`When il exporte le cockpit`<br>`Then un fichier signé est disponible et loggé` | PSD2 | M | 280 | Must | 70 % comptes exportent | Volume fichiers → stockage S3 versionné |
| Cash Cockpit 360 (live) | Auto-refresh temps réel | Cockpit figé | Websocket/polling 5 min, indicateurs synchro | `Given une nouvelle transaction`<br>`When elle est reçue`<br>`Then le solde se met à jour sans rechargement` | PSD2 | M | 220 | Must | Latence < 2 min | Charge API → limiter par backoff |
| BFR & Aging | Calculs DSO/DPO/DIO | Absence d'indicateurs BFR fiables | Moteur calcul journalier, stockage agrégé, API dédiée | `Given une base comptable complète`<br>`When le calcul tourne`<br>`Then les ratios DSO/DPO/DIO sont exposés` | Mapping compta | M | 260 | Must | Δ DSO -5 jours | Qualité données → règles validation |
| BFR & Aging | Workflows d'escalade | Pas de suivi relances internes | Règles seuils, assignation owner, notifications, journal | `Given une facture > 30 jours`<br>`When le seuil est dépassé`<br>`Then une tâche est créée et notifiée` | Auth, CRM | M | 200 | Should | 90 % tâches traitées < 3j | Adoption CRM → connecter webhook |
| Forecast Engine + Scénarios | Moteur prévision 90 j | Scénarios mockés | Moteur calcul, hypothèses, persistance | `Given des hypothèses`<br>`When je lance la prévision`<br>`Then un cashflow 90 jours est produit avec MAPE < 8 %` | Cockpit live | L | 300 | Must | MAPE < 8 % | Données volatiles → recalcul quotidien |
| Forecast Engine + Scénarios | Sauvegarde & partage | Collaboration limitée | Versions scénarios, liens sécurisés, commentaires | `Given un scénario sauvegardé`<br>`When je partage un lien`<br>`Then seuls les rôles autorisés y accèdent` | Auth, Forecast | M | 180 | Should | 50 % scénarios partagés | Fuites données → liens expirables |
| Collaboration & Partage | Rôles externes masqués | Besoin de partage client sécurisé | Masquage IBAN, permissions read-only, audit complet | `Given un external viewer`<br>`When il consulte une facture`<br>`Then seules données autorisées sont visibles` | Auth | S | 150 | Must | 0 incident privacy | Mauvaise config → tests RBAC automatiques |
| Dunning Automation | Orchestration email/SMS | Relances manuelles | Templates multi-canaux, suivi statuts, intégration CRM | `Given une facture impayée`<br>`When la règle s'applique`<br>`Then un email est envoyé et statut MAJ` | BFR, CRM | L | 240 | Should | Δ DSO -5 jours | Deliverability → monitoring reputation |
| Micro-academy CMS | CMS + personnalisation | Contenu statique | CMS headless, tagging segments, recommandations contextuelles | `Given un utilisateur Analyst`<br>`When il ouvre une section`<br>`Then un module contextuel taggé s'affiche` | Auth, Tracking | M | 160 | Could | 40 % taux completion module | Charge contenu → gouvernance éditoriale |
| Observability & SRE | Tests perfs + chaos | Fragilité en charge | Tests perfs p95, scripts chaos light, rapports | `Given un test charge`<br>`When 500 req/min`<br>`Then p95 reste < 300 ms` | Stack observabilité | M | 140 | Should | p95 < 300 ms | Coût infra → campagnes ponctuelles |
| i18n & Accessibilité | UI FR/EN + WCAG AA | Accessibilité partielle | Toggle langue, traduction contenus critiques, contrastes AA | `Given un utilisateur EN`<br>`When il active EN`<br>`Then tout le cockpit est traduit et conforme AA` | Foundations | M | 180 | Must | 0 bloqueur audit accessibilité | Dette UI → checklist a11y |

## Architecture cible
- **Service Auth & RBAC** : OIDC (Auth0/Keycloak) + service d'audit log append-only (PostgreSQL + S3 archive).
- **API Gateway & Backend Orchestration** : Node.js (Nest) exposant GraphQL/REST, orchestrant services via Kafka/NATS.
- **Ingestion PSD2** : connecteurs bancaires, webhooks, polling fallback, stockage brut chiffré.
- **Pipeline de normalisation** : jobs stream (Kafka Streams/Flink) mappant transactions vers le plan de comptes pivot, enrichissant métadonnées.
- **Connecteurs comptables** : import Sage/Exact, mapping pivot, API reconciliation.
- **Entrepôt & Data Store** : PostgreSQL pour transactions normalisées, ClickHouse/BigQuery pour analytics historiques, S3 pour pièces justificatives.
- **Moteur calcul BFR/forecast** : microservice Python ou TypeScript, jobs planifiés, API de restitution.
- **Service Exports** : génération PDF (Puppeteer) & CSV, signature hash, stockage versionné.
- **Service Scénarios & Collaboration** : persistance versions, commentaires, partage liens signés.
- **Notifications** : service email/SMS (Sendgrid/Twilio), intégration CRM webhooks.
- **Observabilité** : OpenTelemetry collector, Prometheus/Grafana, ELK.
- **Sécurité** : WAF, secrets Vault, chiffrement TLS/mTLS.

## Plan sécurité & conformité
- **OIDC + RBAC** : authentification centralisée, provisioning SCIM, tests automatiques des rôles.
- **Masquage IBAN & data minimization** : masking dynamique selon rôle, tokens uniques pour partage externe.
- **Audit log immuable** : capture des accès/exports, stockage append-only + rétention > 365 jours.
- **Chiffrement** : TLS 1.3 bout-en-bout, AES-256 at-rest (PostgreSQL TDE, S3 SSE-KMS).
- **Gestion secrets** : Vault/SM, rotation automatique, accès par rôle DevSecOps.
- **Rétention & purge** : politiques GDPR (purge données clients inactifs, anonymisation test).
- **DPIA & registres** : documentation traitements, revue légale, plan réponse incident.
- **Tests intrusion** : pentest externe récurrent, scans SAST/DAST CI/CD.

## Gates de livraison
- **Gate Foundations** : revue sécurité OIDC/RBAC, tests e2e login, couverture unit > 80 % auth, alertes observabilité opérationnelles.
- **Gate Cockpit réel** : démo fonctionnelle avec données bancaires mock-safe, validation exports PDF/CSV signés, tests perfs p95 < 300 ms.
- **Gate Analytics BFR** : vérification calculs sur jeux comptables réels, scénarios d'escalade testés, conformité audit log.
- **Gate Forecast & Scénarios** : MAPE validé < 8 % sur 3 jeux, tests partage RBAC, sauvegarde/restauration.
- **Gate Dunning & Academy** : campagnes email/SMS sandbox validées, intégration CRM bout-en-bout, tracking engagement actif.

## Scope-cut V1
- Multidevise avancé (couverture change en temps réel) reporté.
- Moteurs ML prédictifs (ex. modèles LSTM) non requis pour prévision initiale.
- Connecteurs ERP long tail (> 2 intégrations prioritaires) différés.
- Tutoriels vidéo premium et contenu gamifié hors périmètre.
- Marketplace partenaires externes non incluse.

## Décisions stratégiques
- **Stop** : développer de nouvelles maquettes UI sans backend associé.
- **Start** : investir dans la pipeline PSD2 + normalisation comme socle unique de vérité.
- **Continue** : capitaliser sur le design Next.js existant en le branchant au backend sécurisé.

## Plan d'action (Priorités)
### Priorité 1
- Finaliser foundations : OIDC/RBAC, backend orchestrateur, data model pivot, observabilité, chiffrement, i18n FR/EN. **Done** = pipelines CI/CD sécurisés, tests e2e login, schéma pivot validé sur jeux réels, alertes SLO actives.
- Déployer intégration PSD2 et service d'exports cockpit. **Done** = comptes connectés via PSD2 sandbox, exports PDF/CSV horodatés et auditables.

### Priorité 2
- Lancer analytics BFR + workflows d'escalade. **Done** = ratios DSO/DPO/DIO calculés sur dataset client, escalades email/Slack opérationnelles.
- Stabiliser moteur forecast + scénarios partageables. **Done** = scénarios Base/Stress/Growth sauvegardés, comparaison visuelle, tests RBAC partages réussis.

### Priorité 3
- Automatiser dunning multi-canal avec CRM et monitoring. **Done** = campagnes email/SMS testées, statut paiement synchronisé.
- Industrialiser micro-academy CMS + personnalisation. **Done** = contenu géré via CMS, tracking engagement live, recommandations par segment actives.
- Étendre collaboration avancée (liens externes, audit exports). **Done** = liens expirables, audit complet des accès externes.
