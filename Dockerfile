# ─── Stage 1 : build ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Dépendances d'abord (cache layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Sources
COPY . .
RUN pnpm build

# ─── Stage 2 : serve ─────────────────────────────────────────────────────────
FROM caddy:2-alpine

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
