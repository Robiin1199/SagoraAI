# Sagora Cockpit – MVP prêt pour Vercel

Ce dépôt contient la première itération du **cockpit financier Sagora**, un MVP Next.js déployable sur Vercel. L'objectif : offrir à une PME une vision consolidée de sa trésorerie, du BFR et des actions prioritaires, tout en posant une base propre pour les itérations suivantes.

## Aperçu du produit

- Dashboard mono-page réalisé avec **Next.js 14** (App Router) et **Tailwind CSS**.
- Sections principales : synthèse trésorerie, prévisions cash 90 jours, suivi BFR, plan d'actions, alertes et micro-academy.
- Design responsive, mode sombre/clair via `next-themes`, composants isolés pour faciliter l'évolution.

## Structure

```
app/
  layout.tsx        # Configuration globale, thème et metadata
  page.tsx          # Page MVP (sections + agencement)
components/         # Cartes, tableaux et modules réutilisables
lib/                # Fonctions utilitaires (formatage, helpers)
public/             # Médias statiques (vide pour l'instant)
styles/globals.css  # Styles Tailwind + fond de page
```

## Démarrage local

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
3. Ouvrir [http://localhost:3000](http://localhost:3000) pour visualiser le cockpit.

> ℹ️ Aucune configuration supplémentaire n'est requise pour Vercel : le framework et les scripts sont détectés automatiquement.

## Déploiement sur Vercel

1. Pousser la branche sur GitHub/GitLab.
2. Sur Vercel, **Importer** le repo, sélectionner le framework détecté `Next.js`.
3. Laisser les valeurs par défaut :
   - Build command : `npm run build`
   - Output directory : `.next`
4. Définir si besoin les variables d'environnement (ex : clés PSD2) dans `Settings > Environment Variables`.

Le MVP est statique, aucune base de données n'est requise pour cette première itération.

## Prochaines étapes suggérées

- Connecter les données réelles (banques, ERP) via API et injecter les datasets dans les composants.
- Ajouter une authentification (Auth0/Keycloak) et une gestion de rôles.
- Mettre en place les tests unitaires (`@testing-library/react`) et end-to-end (Playwright) avant de brancher sur CI.
- Structurer l'état applicatif (React Query/TanStack Query) pour accueillir des appels API.

Pour plus de contexte stratégique, consultez le fichier [`SAGORA_APP_CODEX.md`](./SAGORA_APP_CODEX.md).
