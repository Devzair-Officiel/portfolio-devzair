# Git — Branches de design

## Commandes utilisées

### Créer et basculer sur une branche depuis `main`
```bash
git checkout main
git checkout -b design/option-a   # Option A — Spotlight
git checkout main
git checkout -b design/option-b   # Option B — Editorial
git checkout main
git checkout -b design/option-c   # Option C — Glassmorphism
```

### Créer la branche mix depuis option-a (base retenue)
```bash
git checkout design/option-a
git checkout -b design/mix
```

### Naviguer entre les branches
```bash
git checkout main
git checkout design/option-a
git checkout design/option-b
git checkout design/option-c
git checkout design/mix
```

### Voir toutes les branches
```bash
git branch
```

### Merger une branche dans main (quand le design est validé)
```bash
git checkout main
git merge design/mix
```

### Supprimer une branche devenue inutile
```bash
git branch -d design/option-b
git branch -d design/option-c
```

## État des branches

| Branche          | Description                                      | Statut     |
|------------------|--------------------------------------------------|------------|
| `main`           | Design validé (merge de design/mix)              | ✅ Production |
| `design/option-a`| Spotlight — halos, glow, Plus Jakarta Sans       | Archivée   |
| `design/option-b`| Editorial — grille, DM Serif, JetBrains Mono     | Archivée   |
| `design/option-c`| Glassmorphism — mesh gradient, verre dépoli      | Archivée   |
| `design/mix`     | Mix final — mergé dans main                      | Mergée ✅  |
