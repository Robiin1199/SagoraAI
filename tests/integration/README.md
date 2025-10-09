# Tests d’intégration

Objectif : valider les interactions entre services (API ↔ DB, synchronisation bancaire, ERP comptable) et les contrats d’interface.

## Frameworks ciblés
- **Jest** pour orchestrer les scénarios end-to-end techniques (setup/teardown, assertions).
- **Pact** pour les contrats consumer/provider avec systèmes externes.
- Docker Compose / Testcontainers pour provisionner dépendances (DB, brokers).

## Données & Environnements
- Utiliser `testdata/silver` pour données cohérentes multi-systèmes.
- Seeds appliqués via scripts `npm run test:setup:integration` (à définir).

## Observabilité & Logs
- Capturer `trace_id`/`correlation_id` pour chaque scénario.
- Conserver rapports Pact et journaux dans `testdata/logs/<date>/integration/`.
