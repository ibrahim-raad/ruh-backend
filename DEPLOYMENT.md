# Deployment Guide for Ubuntu Server

## 1. Prerequisites

- Ubuntu Server (20.04 or 22.04 LTS recommended)
- SSH access to the server

## 2. Initial Setup (One-time)

Run the provided setup script to install Docker and dependencies:

```bash
chmod +x scripts/setup-ubuntu.sh
./scripts/setup-ubuntu.sh
```

## 3. Deploying the Application

1.  **Copy Code**: Upload your project files to the server (e.g., via `git clone` or `scp`).

    ```bash
    git clone <your-repo-url>
    cd ruh-backend
    ```

2.  **Configure Environment**:
    - Create your production environment file:
      ```bash
      cp env.docker .env.docker
      nano .env.docker
      ```
    - **IMPORTANT**: Update `DB_PASS`, `JWT_SECRET`, and other sensitive values!

3.  **Start the Application**:

    ```bash
    docker compose up -d --build
    ```

4.  **Verify Deployment**:
    - Check logs: `docker compose logs -f app`
    - Check status: `docker compose ps`

## 4. Updates

To deploy a new version:

1.  Pull latest code: `git pull`
2.  Rebuild and restart: `docker compose up -d --build`
