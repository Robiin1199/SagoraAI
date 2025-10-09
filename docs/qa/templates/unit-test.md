# Template Test Unitaire

- **ID** : UT-<num>
- **Module** : <module/service ciblé>
- **But** : <comportement précis à valider>
- **Pré-requis** : <mocks, fixtures, feature flag>
- **Données** : <testdata/bronze|silver>
- **Étapes** :
  1. <setup>
  2. <action>
  3. <assertion>
- **Assertions clés** : <valeurs attendues, tolérances>
- **Logs** : ajouter sortie structurée (`logger.debug`) en cas d’échec.
- **Statut** : ✅ / ⚠️ / ❌
- **Preuves** : <lien CI, capture>
