# SAGORA_VERIFICATION_TESTS.md
# Objectif : plan de vérification end-to-end (tech + métier), scripts de tests, checklists GDPR/sécurité, prompts d’audit.

## 0) Métadonnées
- Propriétaire QA : <Nom>
- Dernière MAJ : <YYYY-MM-DD>
- Version : 0.1

## 1) Stratégie de test
- Pyramide : Unit (70%) > Intégration (20%) > E2E (10%).
- Types : unitaires, intégration (DB, files, APIs tierces), contrat (Pact), e2e (Playwright), perfs (k6), sécurité (OWASP ZAP), accessibilité (axe-core), i18n, data-quality, ML (backtesting).

## 2) Jeux de données canoniques
- Comptes (EUR/GBP), factures (HT/TVA/échéances), transactions bancaires (SEPA, cartes), devises (ECB), saisonnalité (paie, loyer, TVA).
- Fichiers : /testdata/{bronze|silver|gold}/…  | Contrats de nommage stables.

## 3) Assertions métier (finance)
- **DSO** = (Créances clients / CA TTC) * 365 — tolérance ±1 j.
- **DPO** = (Dettes fournisseurs / Achats TTC) * 365.
- **Runway** = Trésorerie / Burn mensuel — unité jours ; arrondis cohérents.
- **BFR** = Stocks + Créances – Dettes — cohérent par entité/devise.
- **Covenants** : seuils par prêteur, statut “OK/Warning/Breach”.

## 4) Tests unitaires (exemples)
- Parser PSD2 : gère montants signés, fuseaux, doublons webhooks.
- Mapping plan de comptes : vérifie compte pivot, SCD2.
- Cash Engine : agrégation séries + événements (TVA, salaires) ; jours fériés EU.
- Calcul BFR/DSO/DPO/DIO : jeux limites (0, négatifs, très grands).

## 5) Tests d’intégration
- DB → API : cohérence pagination/tri, filtrage par entité/devise.
- Sync bancaire : idempotence, reprise sur erreur, DLQ.
- ERP comptable : contrat champs obligatoires (numéro, TVA, devise, échéance).

## 6) Tests E2E (scénarios)
1) **Onboarding** : connexion banque + import Sage → cockpit cash rendu < 60 min.
2) **Alertes** : DSO > seuil → alerte + playbook visible, journalisée, exportable.
3) **Prévision** : création scénario J+90, modification hypothèses → recalcul < 2 s.
4) **RBAC** : External ne voit que l’entité autorisée, pas les IBAN.

## 7) Performance & Résilience
- Latence p95 GET /cash/overview < 300 ms (10 req/s).
- Débit sync bancaire : 10k transactions/5 min sans perte.
- Chaos : kill pod services ingestion → reprise sans data loss, DLQ < 100 messages.

## 8) Sécurité & Confidentialité (checklist)
- [ ] TLS activé partout, HSTS.
- [ ] OIDC + MFA disponible ; mots de passe non stockés en clair (hash).
- [ ] Rôles RBAC respectés dans endpoints sensibles.
- [ ] Logs : pas de PII sensible en clair (IBAN masqué).
- [ ] Export DSR (GDPR) fonctionnel, horodaté.
- [ ] Politique de rétention configurable par entité.
- [ ] Scans SAST/DAST sans vulnérabilité critique.

## 9) Accessibilité & i18n
- [ ] Contrastes AA, navigation clavier, labels/ARIA.
- [ ] FR/EN complets ; formats date/monnaie EU ; coupures longues chaînes OK.

## 10) Data Quality & Observabilité
- [ ] Complétude ≥ 99% sur champs critiques (amount, currency, posted_at).
- [ ] Unicité transaction par (provider_id, ext_id).
- [ ] Traces OTel présentes sur 95% des requêtes ; erreurs 5xx alertées.

## 11) ML – Backtesting & drift
- Backtest rolling-window 12 mois ; métriques MAPE/RMSE par entité.
- Shadow mode lors de changements de modèle ; alerte drift (PSI) > seuil.

## 12) Templates de cas de test (copiable)
### 12.1 Test unitaire
- ID : UT-<num>
- Module : <nom>
- Données : <fixtures>
- Étapes : <1..n>
- Attendu : <valeurs, tolérances>
- Statut : **REMPLIE / NON REMPLIE / EN COURS**
- Preuve : <capture/log>

### 12.2 Test intégration
- ID : IT-<num>
- Contrat : <API/Schéma>
- Stub/Mock : <oui/non>
- Seuils : <latence, erreurs>
- Statut : **REMPLIE / NON REMPLIE / EN COURS**

### 12.3 Test E2E
- ID : E2E-<num>
- Parcours : <onboarding / forecast / alertes / RBAC>
- Navigateurs : <Chrome/Firefox>
- Données : <jeu>
- KPI : <p95 latence, réussite>
- Statut : **REMPLIE / NON REMPLIE / EN COURS**

## 13) Définition de “Done”
- Couverture unit tests ≥ 80% sur modules cœur.
- Tous critères d’acceptation “verts”.
- A11y AA, i18n OK, SLO respectés en staging.
- Pre-mortem risques mis à jour, runbook d’incident publié.
- Documentation (OpenAPI/GraphQL SDL) publiée.

## 14) Prompts de vérification (LLM) — à exécuter à chaque itération
- “Audit API : génère un rapport des endpoints sans pagination ou sans RFC7807.”
- “Valide les formules DSO/DPO/DIO/Runway sur 10 datasets synthétiques et signale les écarts > 1%.”
- “Inspecte les journaux d’ingestion pour déduire les sources d’échec récurrentes et proposer 3 remédiations.”
- “Évalue l’accessibilité du cockpit (titres, tab order, ARIA) et liste 10 correctifs à impact élevé.”
- “Passe en revue les messages d’erreur et propose une taxonomie unifiée (code, titre, détail, lien).”

## 15) Journal de vérification (à tenir)
- Date | Portée | Résultats clés | Régressions | Actions correctives | Owner
- <YYYY-MM-DD> | <MVP> | <…> | <…> | <…> | <…>

