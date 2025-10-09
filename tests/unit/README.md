# Tests unitaires

Objectif : garantir la fiabilité des modules métier (cash engine, calculs BFR/DSO/DPO/DIO, mapping plan de comptes) en isolation.

## Framework ciblé
- **Jest** (TypeScript/Node.js) avec ts-jest, @testing-library pour hooks React.
- Utilisation de mocks manuels/automatiques, snapshots ciblés, coverage reporting.

## Données & Fixtures
- Fixtures légères depuis `testdata/bronze` ou `testdata/silver`.
- Générateurs de données pour cas limites (montants négatifs, multi-devises).

## Bonnes pratiques
- Tests rapides (< 1 s chacun), déterministes, indépendants.
- Logs en cas d’échec via `logger.debug` + référence ID UT.
- Alimentation de la pyramide QA (70 % des suites automatisées).
