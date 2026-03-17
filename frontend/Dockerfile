# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY frontend/package.json ./frontend/

RUN npm install --workspace=frontend

COPY frontend/ ./frontend/

# VITE_API_TARGET is only used by vite.config.ts at runtime (dev server proxy),
# not embedded into the static bundle, so no ARG needed here.
RUN npm run build --workspace=frontend

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Nginx config: serve static files and proxy /api to the backend service
COPY frontend/nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
