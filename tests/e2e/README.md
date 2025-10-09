# Tests end-to-end

Objectif : reproduire les parcours utilisateur critiques (onboarding, alertes, prévisions, RBAC) sur l’interface Sagora.

## Frameworks ciblés
- **Playwright** pour automatiser les interactions UI multi-navigateurs et capturer artefacts (vidéo, traces).
- **k6** pour les scénarios de charge complémentaires (API critiques, parcours cash) afin de valider les SLO.

## Données & Préparation
- Seeds issus de `testdata/gold` (données riches, cohérentes, multi-entités).
- Initialiser l’application via scripts `npm run test:e2e:setup` (à définir) puis lancer `npx playwright test`.

## Artefacts & Journalisation
- Sauvegarder vidéos, traces et exports HAR dans `tests/e2e/artifacts/<run-id>/`.
- Renseigner les résultats dans le journal QA (`docs/qa/journal.md`) avec liens vers la CI.
- Signaler toute régression critique via ticket dédié.
