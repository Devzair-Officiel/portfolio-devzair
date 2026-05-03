# Structure du projet — Portfolio devZair

## Arborescence complète

```
front/
├── public/                        ← Fichiers servis tels quels (favicon, icônes SVG)
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.tsx                   ← Point d'entrée : monte React dans le DOM
│   ├── App.tsx                    ← Composant racine : assemble les sections
│   ├── index.css                  ← Styles globaux + import Tailwind
│   ├── App.css                    ← Styles propres à App (temporaire, sera supprimé)
│   │
│   ├── assets/                    ← Images, fonts, icônes importées dans les composants
│   │   └── hero.png
│   │
│   ├── components/                ← Composants réutilisables (Button, Card, Badge…)
│   │   └── index.ts               ← Barrel export → import { Button } from '@/components'
│   │
│   ├── sections/                  ← Sections de la page (une par bloc visuel)
│   │   ├── index.ts               ← Barrel export → import { Hero } from '@/sections'
│   │   ├── Hero/
│   │   │   └── Hero.tsx
│   │   ├── Skills/
│   │   │   └── Skills.tsx
│   │   ├── Projects/
│   │   │   └── Projects.tsx
│   │   ├── Experience/
│   │   │   └── Experience.tsx
│   │   └── Contact/
│   │       └── Contact.tsx
│   │
│   ├── data/                      ← Données statiques du portfolio (jamais dans les composants)
│   │   ├── index.ts               ← Barrel export → import { projects } from '@/data'
│   │   ├── projects.ts            ← Liste des projets (ProjectType[])
│   │   └── skills.ts              ← Liste des compétences (SkillType[])
│   │
│   ├── types/                     ← Interfaces et types TypeScript partagés
│   │   └── index.ts               ← ProjectType, SkillType, ExperienceType…
│   │
│   ├── hooks/                     ← Custom React hooks (useScrollPosition, useMediaQuery…)
│   │
│   ├── utils/                     ← Fonctions utilitaires pures (formatDate, groupBy…)
│   │
│   └── styles/                    ← Styles globaux supplémentaires (variables CSS, reset…)
│
├── index.html                     ← Template HTML, contient <div id="root">
├── vite.config.ts                 ← Config Vite : plugins React + Tailwind, alias @/
├── tsconfig.json                  ← Config TS racine (références vers app + node)
├── tsconfig.app.json              ← Config TS pour le code source (src/)
├── tsconfig.node.json             ← Config TS pour les fichiers de config (vite.config.ts)
├── eslint.config.js               ← ESLint flat config (TS + React hooks + Prettier)
├── .prettierrc                    ← Règles de formatage Prettier
├── package.json                   ← Dépendances et scripts
├── pnpm-lock.yaml                 ← Lockfile pnpm (ne pas modifier à la main)
├── CLAUDE.md                      ← Référence centrale du projet (conventions, roadmap…)
└── structure.md                   ← Ce fichier
```

---

## Rôle de chaque dossier

### `components/`
Composants **génériques et réutilisables** dans toute l'application.
Un composant ici n'a aucune connaissance du domaine (portfolio, projets…) — il reçoit tout via ses props.

Exemples à venir : `Button`, `Badge`, `SectionTitle`, `Card`

### `sections/`
Chaque section correspond à **un bloc visuel de la page**.
Une section peut contenir ses propres sous-composants locaux (ex: `Projects/ProjectCard.tsx`).
Elle importe ses données depuis `src/data/` et ses types depuis `src/types/`.

### `data/`
**Source de vérité temporaire** pour les données statiques (compétences).

> ⚠️ `projects.ts` et `experiences.ts` sont **provisoires**.
> En Phase 2, les projets et expériences seront gérés via une interface admin et exposés par une API Python FastAPI.
> Ils seront remplacés par des custom hooks (`useProjects`, `useExperiences`) qui feront des appels HTTP.
> Les types TypeScript resteront identiques — seule la source des données change.

### `types/`
Toutes les **interfaces TypeScript partagées** entre plusieurs fichiers.
Les types propres à un seul composant restent dans ce composant.

### `hooks/`
**Custom hooks** React : logique réutilisable extraite des composants.
Exemples à venir : `useScrollPosition`, `useMediaQuery`, `useIntersectionObserver`

### `utils/`
**Fonctions pures** sans état React.
Exemples à venir : `formatDate`, `groupByCategory`, `truncateText`

### `styles/`
Styles globaux complémentaires à Tailwind : variables CSS custom, animations globales, reset éventuel.

---

## Le barrel export

Chaque dossier expose un fichier `index.ts` qui regroupe tous ses exports.
Cela permet des imports propres et découplés du chemin interne :

```ts
// Sans barrel export
import { Hero } from '@/sections/Hero/Hero'
import { Button } from '@/components/Button/Button'

// Avec barrel export
import { Hero } from '@/sections'
import { Button } from '@/components'
```

Si le fichier interne est renommé ou déplacé, seul le `index.ts` change — pas tous les imports.

---

## L'alias `@/`

Configuré dans `vite.config.ts` et `tsconfig.app.json`, l'alias `@/` pointe vers `src/`.
Il évite les imports relatifs fragiles (`../../components`) et rend le code lisible quel que soit l'endroit du fichier.

```ts
// Fragile
import { Button } from '../../components'

// Stable
import { Button } from '@/components'
```
