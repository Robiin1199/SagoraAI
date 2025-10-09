# Stratégie QA Sagora

## 0. Métadonnées
- **Propriétaire QA** : _à définir_
- **Dernière mise à jour** : _YYYY-MM-DD_
- **Version** : 0.1

## 1. Pyramide & Portée de tests
- **Répartition cible** : Unit (70%) > Intégration (20%) > E2E (10%).
- **Couverture** : modules cœur (cash, BFR, prévision) ≥ 80% en unitaires.
- **Priorités** : fiabilité des calculs financiers, conformité (GDPR, audit), observabilité.

## 2. Types de vérifications
- **Unitaires** : logique métier (calculs DSO/DPO/BFR/Runway, mapping plan de comptes, parser PSD2).
- **Intégration** : flux DB ↔ API, synchronisation bancaire, contrats ERP (Pact).
- **E2E** : parcours onboarding, alertes, prévisions, RBAC via Playwright.
- **Performance / Résilience** : seuils latence, débit sync bancaire, tests k6/chaos (à planifier).
- **Sécurité & Conformité** : RBAC, audit log, GDPR, scans SAST/DAST.
- **Accessibilité & i18n** : axe-core, FR/EN, formats EU.
- **Data Quality & Observabilité** : complétude, unicité, traces OpenTelemetry.
- **ML / Drift** : backtesting rolling window, PSI.

## 3. Jeux de données canoniques
- Localisation : `testdata/{bronze|silver|gold}/...` dans le dépôt.
- Contenu : comptes multi-devises (EUR/GBP), factures HT/TVA, transactions bancaires (SEPA/carte), séries saisonnières (paie, loyer, TVA), devises ECB.
- Gouvernance : nomenclature stable, versionnement via Git, validation automatique avant merge.
- Consommation : référencés dans tests unitaires/intégration via fixtures immuables ; jeux gold réservés aux scénarios E2E/ML.

## 4. Environnements & Frameworks cibles
- **Unitaires** : Jest (Node/TypeScript) + utilitaires de mock.
- **Intégration** : Jest + Pact pour contrats externes, runners ciblés (Docker compose).
- **E2E** : Playwright (Chrome/Firefox/WebKit) avec seed `testdata/gold`.
- **Performance** : k6 orchestré via pipelines CI/CD.

## 5. Templates & Documentation
- Modèles de cas UT/IT/E2E disponibles dans `docs/qa/templates/`.
- Chaque test référencé dans une suite doit pointer vers son ID (`UT-###`, `IT-###`, `E2E-###`).
- Critères d’acceptation standard (RFC7807, SLO, accessibilité) repris depuis `SAGORA_VERIFICATION_TESTS.md`.

## 6. Organisation des répertoires de tests
- `tests/unit/` : suites Jest, doubles testables, fixtures `testdata/silver`.
- `tests/integration/` : orchestrations multi-services, contrats Pact, scripts de setup data.
- `tests/e2e/` : scénarios Playwright, seeds & mocks réseau.
- Scripts communs (build, lint, start mocks) placés sous `tests/scripts/` (à créer selon besoins).

## 7. Journal
- Support : `docs/qa/journal.md` (à initialiser) ou outil partagé équivalent.
- Format recommandé : `Date | Portée | Résultats clés | Régressions | Actions correctives | Owner`.
- Exigences :
  - Joindre liens vers exécutions CI (build, lint, tests) et captures Playwright.
  - Archiver logs structurés (JSON) dans `testdata/logs/<YYYYMMDD>/` pour audit.
  - Toute non-conformité critique doit être créée en ticket avec référence PR/commit.

## 8. Rituels & Définition de Done
- Revues QA hebdomadaires : suivi couverture, santé pipelines.
- Chaque feature flag est validé sur dev/staging avant production.
- “Done” = critères acceptation verts, jeux canoniques validés, journal mis à jour, documentation API publiée.

## 9. Roadmap QA
- Automatiser import jeux bronze→silver via pipeline.
- Intégrer k6 et chaos testing dans CI (jobs dédiés).
- Outiller alerting drift ML + rapport accessibilité continu.
