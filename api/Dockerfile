# Etapa 1: Build
FROM node:20.9.0 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm exec tsup src --format esm



# Etapa 2: Produção
FROM node:20.9.0
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3333

CMD ["node", "dist/app.mjs"]
