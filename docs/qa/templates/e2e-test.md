# Template Test E2E

- **ID** : E2E-<num>
- **Parcours** : <onboarding | forecast | alertes | RBAC>
- **Navigateurs** : <Chrome | Firefox | WebKit>
- **Préconditions** : <état base, feature flags, comptes test>
- **Données** : <testdata/gold>
- **Étapes** :
  1. <setup environnement>
  2. <scénario utilisateur>
  3. <vérifications UI/API>
- **KPI suivis** : <p95 latence, taux réussite>
- **Accessibilité** : vérifier axe-core, contrastes, navigation clavier.
- **Journalisation** : joindre capture Playwright, export HAR.
- **Statut** : ✅ / ⚠️ / ❌
- **Preuves** : <lien run CI, artefacts>
