# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first so this layer is cached unless deps change
COPY package.json ./
COPY backend/package.json ./backend/

# Install all deps (dev included — needed for tsc)
RUN npm install --workspace=backend

# Copy source and compile
COPY backend/ ./backend/
RUN npm run build --workspace=backend

# Prune devDependencies from the root node_modules (where workspaces hoists them)
RUN npm prune --omit=dev

# ── Stage 2: runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Compiled JS output
COPY --from=builder /app/backend/dist ./dist

# Root node_modules is the only location after workspace hoisting
COPY --from=builder /app/node_modules ./node_modules

# package.json needed so 'node -r dotenv/config' resolves the dotenv binary path
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 3000

CMD ["node", "-r", "dotenv/config", "dist/index.js"]
