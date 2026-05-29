# Candidatures Alternance — Quentin

Application PWA pour suivre tes candidatures d'alternance en architecture (agences autour de Bordeaux).

## Fonctionnalités

- **Kanban** — glisser-déposer entre les statuts (À contacter → Mail envoyé → Relance → Entretien → Refusé / Accepté)
- **Liste** — vue tableau avec recherche et filtre par zone
- **Carte** — toutes les agences sur OpenStreetMap
- **Calendrier** — entretiens, relances, deadlines
- **Modèles de mails** — avec variables `{{entreprise}}`, `{{specialite}}`, etc.
- **Checklist** par agence — CV, portfolio, relances J+7 / J+14
- **Stats** — progression globale et par zone
- **Mode sombre**
- **PWA** — installable depuis Chrome/Safari (Ajouter à l'écran d'accueil)
- Données stockées **localement** dans le navigateur (aucun compte)

## Démarrage

Prérequis : [Node.js](https://nodejs.org/) 20+ (avec npm).

```bash
cd ~/quentin-candidatures
npm install
npm run dev
```

Ouvre l’URL affichée (souvent http://localhost:5173). Au premier lancement, tes **77 agences** sont chargées depuis le fichier importé de ton Excel.

### Installer en PWA

1. Lance l’app en production : `npm run build && npm run preview`
2. Dans Chrome : menu → **Installer l’application**
3. Sur iPhone (Safari) : Partager → **Sur l’écran d’accueil**

## Réimporter un Excel

Bouton **↑** en haut à droite, ou au premier écran d’accueil. Format attendu : même structure que `Candidature Quentin.xlsx` (colonnes entreprise, adresse, téléphone, email, site, spécialité, zones avec 📍).

## Stack

React 19, TypeScript, Vite, Zustand, Leaflet, SheetJS (xlsx), vite-plugin-pwa.
