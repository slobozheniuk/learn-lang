# Spec 18 — Deployment (Docker + Dokploy)

## Goal
Finalize the Docker configuration and provide a production-ready `docker-compose.yml` compatible with Dokploy for one-click VPS deployment.

## Docker Configuration

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Pre-download EasyOCR models
RUN python -c "import easyocr; easyocr.Reader(['en','nl'])"
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production `docker-compose.yml`
```yaml
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - AUTH0_DOMAIN=${AUTH0_DOMAIN}
      - AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## Production Checklist

### Security
- [ ] All secrets in environment variables (never in images).
- [ ] CORS restricted to production domain.
- [ ] Rate limiting on API endpoints.
- [ ] HTTPS enforced (via reverse proxy).
- [ ] Auth0 production tenant configured.

### Performance
- [ ] Next.js standalone output mode.
- [ ] PostgreSQL connection pooling.
- [ ] Uvicorn with multiple workers.
- [ ] Static assets served via CDN or nginx.

### Monitoring
- [ ] Health check endpoints for all services.
- [ ] Structured logging (JSON format).
- [ ] Basic error tracking (Sentry or similar).

### Database
- [ ] Automated backups configured.
- [ ] Alembic migrations run on deploy.
- [ ] Connection pooling via pgBouncer (optional).

## Dokploy Integration
- Import `docker-compose.yml` into Dokploy.
- Set environment variables via Dokploy UI.
- Configure domain + SSL via Dokploy's built-in Traefik integration.

## Acceptance Criteria
1. `docker compose -f docker-compose.yml up --build` works in production mode.
2. All services are healthy and communicate correctly.
3. Frontend serves pre-built static assets.
4. Database persists data across container restarts.
5. Deploying on Dokploy with env vars results in a working instance.
6. HTTPS is enforced via reverse proxy.
