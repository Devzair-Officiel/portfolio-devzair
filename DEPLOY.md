# Mise en production — devZair Portfolio

## Architecture

```
Internet
   │
   ▼
Caddy (ports 80/443) — HTTPS automatique Let's Encrypt
   ├── devzair.fr                   → fichiers statiques React
   └── api-portfolio.devzair.fr     → reverse proxy → FastAPI :8000
                                                          │
                                                     PostgreSQL (réseau interne)
```

---

## Prérequis sur le serveur

- Ubuntu 22.04+
- Docker + Docker Compose : `apt install docker.io docker-compose-plugin`
- Ports **80** et **443** ouverts dans le firewall
- DNS configuré :
  - `devzair.fr` → IP du serveur
  - `api-portfolio.devzair.fr` → même IP

---

## Structure attendue sur le serveur

Les deux repos doivent être côte à côte dans le même dossier :

```
~/devzair/
  ├── front/    ← ce repo (contient docker-compose.prod.yml et deploy.sh)
  └── api/      ← repo API
```

---

## 1. Cloner les deux repos

```bash
mkdir ~/devzair && cd ~/devzair
git clone <url-repo-front> front
git clone <url-repo-api> api
```

---

## 2. Créer le fichier `.env`

```bash
cd ~/devzair/front
cp .env.example .env
nano .env
```

| Variable | Valeur |
|---|---|
| `CADDY_DOMAIN` | `devzair.fr` |
| `CADDY_API_DOMAIN` | `api-portfolio.devzair.fr` |
| `CADDY_EMAIL` | ton email (pour Let's Encrypt) |
| `VITE_API_URL` | `https://api-portfolio.devzair.fr` |
| `DB_PASSWORD` | mot de passe fort |
| `SECRET_KEY` | généré avec la commande ci-dessous |

Générer `SECRET_KEY` :
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 3. Premier déploiement

```bash
cd ~/devzair/front
chmod +x deploy.sh
./deploy.sh
```

Le script pull les deux repos, build les images, lance les conteneurs et applique les migrations.  
Caddy obtient les certificats HTTPS **automatiquement**.

---

## 4. Créer l'utilisateur admin

```bash
docker exec -it devzair-api python src/manage.py create-user
```

Connecte-toi ensuite sur `https://devzair.fr/admin`.

---

## Mises à jour

```bash
cd ~/devzair/front && ./deploy.sh
```

---

## Commandes utiles

```bash
# Logs temps réel (tous les services)
docker compose -f docker-compose.prod.yml logs -f

# Logs API uniquement
docker compose -f docker-compose.prod.yml logs -f api

# Redémarrer l'API sans rebuild
docker compose -f docker-compose.prod.yml restart api

# Shell dans le conteneur API
docker exec -it devzair-api sh

# Changer le mot de passe admin
docker exec -it devzair-api python src/manage.py create-user

# Migrations manuelles
docker exec devzair-api sh -c "cd /app && python -m alembic -c alembic.ini upgrade head"
```
