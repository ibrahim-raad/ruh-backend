# Ruh Therapy — Backend API (NestJS)

## Project Description

Ruh Therapy is a mental-health platform. This repository contains the **NestJS backend API** that powers authentication, administration, and core domain operations (users, therapists, patients, sessions, questionnaires, etc.). The web dashboard (admin/therapist) connects to this API.

- **Web (Frontend) Repository**: `ruh-web`
- **Live Web Demo**: `https://ruhtherapy.online`

## Core Requirements Mapping (Phase 2)

- **Node.js backend**: NestJS (TypeScript)
- **Database CRUD**: TypeORM + Postgres with CRUD controllers/services (example: `Sessions`, `Users`)
- **Authentication**: Register/Login + JWT access token + refresh token cookie
- **Related entities**: example relations include `User -> Patient` and `TherapyCase -> Session`
- **Validation & error handling**: global validation pipe + DB/service exception filters

## Tech Stack

- **Framework**: NestJS 11, TypeScript
- **Database/ORM**: PostgreSQL, TypeORM
- **Auth**: Passport JWT, `@nestjs/jwt`, refresh token via httpOnly cookie
- **Validation**: `class-validator`, `class-transformer`
- **Docs**: Swagger (`@nestjs/swagger`) at `/api`
- **Email**: Resend (email verification + password reset flows)
- **Logging**: Pino (`nestjs-pino`)
- **Uploads**: static files served from `uploads/` at `/uploads/*`

## API Docs (Swagger)

When running locally, open:

- **Swagger UI**: `http://localhost:3000/api`

## Environment Variables

This project reads configuration from `.env` (and Docker uses `env.docker` / `env.docker.example`).

Start from `env.docker.example` and adjust as needed.

Key variables (see `env.docker.example` for the full list):

- **PORT**: API port (container exposes 3000)
- **DB_HOST / DB_PORT / DB_USERNAME / DB_PASS / DB_NAME**
- **JWT_SECRET / JWT_EXPIRATION**
- **RESEND_API_KEY / RESEND_FROM_EMAIL**
- **WEB_APP_URL**

## Run Locally (Recommended: Docker Compose)

1. Create your env file:

```bash
cp env.docker.example env.docker
```

2. Start services:

```bash
docker compose up --build
```

3. API will be available at:

- `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

### Notes

- Postgres is exposed on **host port `5433`** (mapped to container `5432`) in `docker-compose.yml`.
- `uploads/` is mounted into the container for persistent file storage.

## Run Locally (Without Docker)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the repo root (copy values from `env.docker.example`) and set:

- `DB_HOST=localhost`
- `DB_PORT=5432` (or `5433` if you’re using the dockerized DB)

3. Start dev server:

```bash
npm run start:dev
```

## Useful Scripts

- **dev**: `npm run start:dev`
- **build**: `npm run build`
- **prod**: `npm run start:prod`
- **tests**: `npm run test`, `npm run test:e2e`

## Example Endpoints (Selected)

All endpoints are prefixed by `/api/v1`.

### Auth (`/api/v1/auth`)

- `POST /register`
- `POST /login`
- `POST /refresh-token`
- `POST /logout`
- `GET /me`
- `POST /verify-email`
- `POST /forgot-password`
- `POST /reset-password`

### Sessions CRUD (`/api/v1/sessions`)

- `POST /`
- `GET /`
- `GET /:id`
- `PATCH /:id`
- `DELETE /:id`
- `PATCH /restore/:id`

## Screenshots (UI)

These screenshots are from the web dashboard that consumes this API:

### Landing Page

![Landing Page](./screenshots/landing.png)

### Login Screen

![Login Screen](./screenshots/login.png)

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

### Mobile View

![Mobile View](./screenshots/mobile.png)

## Deployment

See `DEPLOYMENT.md` for an Ubuntu/Docker deployment guide.

