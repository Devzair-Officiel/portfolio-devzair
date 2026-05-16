# Mise en production — devZair Portfolio

## Architecture réelle

```
Internet
   │
   ▼
Apache (ports 80/443) — SSL Let's Encrypt
   ├── devzair.fr              → 127.0.0.1:8081  (Caddy, fichiers React statiques)
   └── api-portfolio.devzair.fr → 127.0.0.1:8000  (FastAPI)
                                        │
                                   PostgreSQL (réseau interne Docker)
```

## Structure sur le serveur

```
/var/www/portfolio/
  ├── portfolio-devzair/        ← repo front (docker-compose.prod.yml, deploy.sh, .env)
  └── portfolio-devzair-api/   ← repo API (référencé via ../portfolio-devzair-api)
```

> Toutes les commandes `docker compose` se lancent depuis `portfolio-devzair/` avec `-f docker-compose.prod.yml`.

---

## Premier déploiement

### 1. Cloner les deux repos

```bash
cd /var/www/portfolio
git clone <url-repo-front> portfolio-devzair
git clone <url-repo-api> portfolio-devzair-api
```

### 2. Créer le `.env`

```bash
cd /var/www/portfolio/portfolio-devzair
cp .env.example .env
nano .env
```

Générer la `SECRET_KEY` :
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Lancer le déploiement

```bash
chmod +x deploy.sh
./deploy.sh
```

Le script pull les deux repos, rebuild tout, lance les conteneurs et applique les migrations.

### 4. Créer l'utilisateur admin (première fois uniquement)

```bash
docker exec -it devzair-api python src/manage.py create-user
```

---

## Mettre à jour en production

```bash
cd /var/www/portfolio/portfolio-devzair
./deploy.sh
```

**Rebuilder un seul service** (plus rapide) :

```bash
# Après un git pull dans portfolio-devzair-api/
docker compose -f docker-compose.prod.yml up -d --build api

# Après un changement front
docker compose -f docker-compose.prod.yml up -d --build frontend
```

---

## Commandes utiles

```bash
# État des conteneurs
docker compose -f docker-compose.prod.yml ps

# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f api

# Redémarrer sans rebuild
docker compose -f docker-compose.prod.yml restart api

# Shell dans l'API
docker exec -it devzair-api sh

# Vérifier les migrations (doit afficher "head")
docker compose -f docker-compose.prod.yml exec api alembic current

# Appliquer les migrations manuellement
docker exec devzair-api sh -c "cd /app && python -m alembic -c alembic.ini upgrade head"
```
