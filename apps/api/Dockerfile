# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/logger/package.json ./packages/logger/
COPY packages/ai-core/package.json ./packages/ai-core/
COPY packages/vector-db/package.json ./packages/vector-db/
COPY packages/prompt-manager/package.json ./packages/prompt-manager/
COPY packages/agent-core/package.json ./packages/agent-core/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build shared packages first
RUN pnpm --filter @ai-platform/shared-types build
RUN pnpm --filter @ai-platform/shared-config build
RUN pnpm --filter @ai-platform/logger build
RUN pnpm --filter @ai-platform/ai-core build
RUN pnpm --filter @ai-platform/vector-db build
RUN pnpm --filter @ai-platform/prompt-manager build
RUN pnpm --filter @ai-platform/agent-core build

# Generate Prisma client
RUN pnpm --filter @ai-platform/api db:generate

# Build API
RUN pnpm --filter @ai-platform/api build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Production only — no devDependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api

ENV NODE_ENV=production

EXPOSE 3000

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
