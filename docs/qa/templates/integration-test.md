# Template Test d’Intégration

- **ID** : IT-<num>
- **Contrat / Flux** : <API, file, batch>
- **But** : <interaction à sécuriser>
- **Environnement** : <docker-compose, sandbox tierce>
- **Mocks/Stubs** : <oui/non + détail>
- **Données** : <testdata/silver>
- **Étapes** :
  1. <provisionner dépendances>
  2. <exécuter flux>
  3. <valider résultats>
- **Assertions clés** : <latence, statut HTTP, structure payload>
- **Observabilité** : vérifier traces/logs (`trace_id`, `correlation_id`).
- **Statut** : ✅ / ⚠️ / ❌
- **Preuves** : <rapport Pact, capture requête>
