# syntax=docker.io/docker/dockerfile:1

# Base image com pnpm habilitado
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalação de dependências com cache
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

# Build da aplicação Next.js
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.build .env
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm run build
RUN rm -rf .env

# Imagem final para produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos necessários para produção
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY package.json pnpm-lock.yaml ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]