#!/bin/bash
set -e

echo "🚀  Déploiement devZair..."

# Vérifier que .env existe
if [ ! -f .env ]; then
  echo "❌  Fichier .env introuvable. Copie .env.example et remplis-le."
  exit 1
fi

# Pull front et api
git pull origin main
cd ../api && git pull origin main && cd ../front

# Build et redémarrage
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Migrations
echo "⏳  Attente de la base de données..."
sleep 8
docker exec devzair-api sh -c "cd /app && python -m alembic -c alembic.ini upgrade head"

echo "✅  Déploiement terminé !"
echo ""
echo "   Première fois ? Crée ton utilisateur admin :"
echo "   docker exec -it devzair-api python src/manage.py create-user"
