# 📋 Instructions Projet — Portfolio devZair

> Ce document est la **référence centrale** du projet.
> Il cadre les conventions, l'architecture, les règles de code et la pédagogie attendue à chaque étape.
> Il doit être relu à chaque nouvelle session de travail.

---

## 👤 Contexte du projet

| Champ         | Valeur                                             |
|---------------|----------------------------------------------------|
| Développeur   | Aurélien Boudon (devZair)                          |
| GitHub        | `devzair-officiel`                                 |
| Domaine       | `devzair.fr`                                       |
| Niveau React  | Débutant — en apprentissage actif                  |
| Objectif      | Portfolio en production + monter en compétence React/TS |

---

## 🎯 Objectifs du projet

1. **Créer un portfolio professionnel** déployé sur `devzair.fr`
2. **Maîtriser React + TypeScript** à travers un projet concret
3. **Préparer une architecture extensible** pour brancher une API Python (Phase 2)
4. **Appliquer les bonnes pratiques** : clean code, DRY, sécurité, conventions modernes

---

## 🏗️ Architecture globale

```
devzair-portfolio/
├── frontend/          ← Phase 1 : React + TypeScript (ce dépôt)
│   ├── src/
│   │   ├── assets/        ← images, fonts, icônes statiques
│   │   ├── components/    ← composants réutilisables (Button, Card...)
│   │   ├── sections/      ← sections de la page (Hero, Skills, Projects...)
│   │   ├── data/          ← données statiques (projets, compétences...)
│   │   ├── hooks/         ← custom React hooks
│   │   ├── types/         ← interfaces et types TypeScript
│   │   ├── utils/         ← fonctions utilitaires pures
│   │   ├── styles/        ← styles globaux
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── ...config files
└── api/               ← Phase 2 : Python FastAPI (à venir)
```

---

## 📄 Sections du portfolio

| Ordre | Section         | Description                                         |
|-------|-----------------|-----------------------------------------------------|
| 1     | **Hero**        | Accroche, nom, titre, liens GitHub/contact          |
| 2     | **Compétences** | Stack organisée par catégorie (Frontend, Backend…)  |
| 3     | **Projets**     | Projets réels avec description, stack, liens        |
| 4     | **Expériences** | Parcours professionnel et formations                |
| 5     | **Contact**     | Formulaire + liens sociaux                          |

---

## 🛠️ Stack technique

| Rôle                  | Techno / Outil              | Version cible |
|-----------------------|-----------------------------|---------------|
| Framework UI          | React                       | 18+           |
| Langage               | TypeScript                  | 5+            |
| Styling               | Tailwind CSS                | 3+            |
| Animations            | Framer Motion               | 11+           |
| Build tool            | Vite                        | 5+            |
| Gestionnaire paquets  | pnpm                        | 9+            |
| Linter                | ESLint (flat config)        | 9+            |
| Formateur             | Prettier                    | 3+            |
| Conteneurisation dev  | Docker + Docker Compose     | latest        |
| Serveur prod          | Caddy (dans Docker)         | latest        |
| Tests (à venir)       | Vitest + Testing Library    | —             |
| API future            | Python FastAPI              | Phase 2       |

---

## 🗺️ Roadmap — Étapes de développement

```
✅ Étape 0  — Cadrage du projet (ce document)
✅ Étape 1  — Initialisation : Docker dev + Vite + React + TypeScript
✅ Étape 2  — Configuration : Tailwind + ESLint + Prettier
✅ Étape 3  — Architecture des composants (arborescence + conventions)
✅ Étape 4  — Routing (React Router v6)
✅ Étape 5  — Section Hero
✅ Étape 6  — Section Compétences
✅ Étape 7  — Section Projets
✅ Étape 8  — Section Expériences
✅ Étape 9  — Section Contact
✅ Étape 10 — Animations Framer Motion (scroll, transitions, micro-interactions)
⬜ Étape 11 — Dockerisation production (build statique + Caddy)
⬜ Étape 12 — Déploiement sur devzair.fr
⬜ Phase 2  — API Python FastAPI + interface admin
```

---

## 📐 Conventions de code

### Nommage

| Élément              | Convention           | Exemple                    |
|----------------------|----------------------|----------------------------|
| Composant React      | PascalCase           | `ProjectCard.tsx`          |
| Hook custom          | camelCase + `use`    | `useScrollPosition.ts`     |
| Fichier utilitaire   | camelCase            | `formatDate.ts`            |
| Type / Interface     | PascalCase + suffixe | `ProjectType`, `SkillProps`|
| Variable / fonction  | camelCase            | `isVisible`, `handleClick` |
| Constante globale    | UPPER_SNAKE_CASE     | `MAX_PROJECTS`             |
| Dossiers             | kebab-case           | `project-card/`            |

### Structure d'un composant React

Toujours dans cet ordre :

```tsx
// 1. Imports (React en premier, puis libs, puis locaux)
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ProjectType } from '@/types'
import { Button } from '@/components'

// 2. Types / Interfaces propres au composant
interface Props {
  project: ProjectType
  isHighlighted?: boolean
}

// 3. Le composant (fonction fléchée + export nommé)
export const ProjectCard = ({ project, isHighlighted = false }: Props) => {
  // 3a. Hooks d'abord
  const [isOpen, setIsOpen] = useState(false)

  // 3b. Handlers / fonctions dérivées
  const handleToggle = () => setIsOpen(prev => !prev)

  // 3c. JSX
  return (
    <div>...</div>
  )
}

// 4. Export par défaut si nécessaire (évité en général)
```

---

## 🧼 Principes de clean code appliqués

### DRY (Don't Repeat Yourself)
> Ne jamais écrire deux fois la même logique.

- Les données (textes, projets, compétences) vivent dans `src/data/` — jamais en dur dans les composants
- Les classes Tailwind répétées → extraites dans un composant ou une variable
- La logique réutilisable → extraite dans un custom hook ou un utilitaire

### Single Responsibility
> Chaque fichier fait **une seule chose**.

- Un composant = un rôle visuel précis
- Un hook = une logique précise
- Un utilitaire = une transformation précise

### Lisibilité avant optimisation
> Un code qu'on comprend en 10 secondes vaut mieux qu'un code "malin".

- Noms explicites : `isMenuOpen` > `open`, `handleSubmitForm` > `submit`
- Pas de commentaires inutiles — le code doit se lire seul
- Commentaires réservés au **pourquoi**, pas au **quoi**

---

## 🔐 Sécurité

- **Aucune clé, token ou secret** dans le code source — utiliser `.env` + `.gitignore`
- **Variables d'environnement** préfixées `VITE_` pour l'exposition côté client
- **Sanitisation** des inputs utilisateur (formulaire de contact)
- **Headers HTTP sécurisés** configurés côté Caddy en production
- **Dépendances** : ne pas installer de package sans vérifier sa popularité et son activité
- **HTTPS obligatoire** en production — géré automatiquement par Caddy

---

## 🐳 Docker — Deux environnements distincts

### Développement (`docker-compose.yml`)
- Hot reload activé (Vite dev server)
- Volume monté pour les fichiers source
- Port `5173` exposé localement

### Production (`docker-compose.prod.yml`)
- Build Vite → fichiers statiques
- Servis par Caddy dans le même conteneur
- HTTPS automatique via Caddy
- Aucun code source dans l'image finale

---

## 🎓 Approche pédagogique

Chaque étape suivra ce format :

1. **Explication** — Pourquoi on fait ça ? Quel concept React/TS est en jeu ?
2. **Ce qu'on va faire** — Liste courte et claire des actions
3. **Les commandes** — Une par une, avec explication de ce qu'elle fait
4. **Le code** — Expliqué ligne par ligne si c'est un nouveau concept
5. **Vérification** — Comment savoir que ça fonctionne ?
6. **Ce qu'on a appris** — Résumé du concept clé de l'étape

> ⚠️ On n'avance pas à l'étape suivante tant que la précédente n'est pas comprise et validée.

---

## 📁 Données du portfolio (contenu réel)

### Stratégie des données

| Section       | Phase 1 (maintenant)         | Phase 2 (API)                        |
|---------------|------------------------------|--------------------------------------|
| Compétences   | Statique dans `src/data/`    | Statique (pas de gestion admin prévue) |
| **Projets**   | Statique dans `src/data/` ⚠️ | **Dynamique via API Python + admin** |
| **Expériences** | Statique dans `src/data/` ⚠️ | **Dynamique via API Python + admin** |
| Contact       | Formulaire → API email       | Idem                                 |

> ⚠️ Les fichiers `data/projects.ts` et `data/experiences.ts` sont **temporaires**.
> Ils seront remplacés en Phase 2 par des appels à l'API FastAPI.
> Les types TypeScript (`ProjectType`, `ExperienceType`) resteront identiques — seule la source change.
> Prévoir un custom hook par ressource (`useProjects`, `useExperiences`) pour isoler la couche data.

### Compétences
**Frontend** : HTML, CSS, SCSS, Bootstrap, Tailwind, JavaScript, TypeScript, Vue.js, React
**Backend** : PHP, Symfony
**DevOps/Outils** : Docker, Git, Caddy
**En cours** : React (approfondissement), Python (à venir via l'API)

### Projets
| Nom | Description | Stack | Lien |
|-----|-------------|-------|------|
| **Nidemiel** | Site e-commerce de vente de miel | À préciser | À ajouter |
| **Admin e-commerce démo** | Back-office complet (commandes, produits, clients, expéditions) — accès libre sans compte | À préciser | À ajouter |
| Sites vitrines | Plusieurs sites en HTML/CSS/JS | HTML, CSS, JS | À ajouter |
| Projets en attente | 2 projets à venir | — | — |

---

## ✅ Checklist avant chaque session de travail

- [ ] Relire ce document pour se remettre en contexte
- [ ] Vérifier à quelle étape de la roadmap on en est
- [ ] Lancer l'environnement Docker dev
- [ ] Committer le travail précédent si ce n'est pas fait

---

*Document maintenu tout au long du projet — mis à jour à chaque évolution significative.*