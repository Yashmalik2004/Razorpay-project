# Production Deployment Guide — ReimburseIQ

This document provides step-by-step instructions on deploying the ReimburseIQ full-stack application (Node.js Express + Prisma + PostgreSQL) to production cloud platforms.

---

## Required Environment Variables

When deploying the web service, you must configure the following Environment Variables:

| Variable | Description | Example / Note |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?schema=public` |
| `JWT_SECRET` | Secret key used to sign and verify user authentication tokens | Any long random string (e.g. `jwt_p4ss_3489!`) |
| `COOKIE_SECRET`| Secret key used to sign browser cookies | Any long random string |
| `PORT` | The port the application binds to | `7002` (Render/Railway automatically configure this) |

---

## Option 1: Deploying on Render (Free Database + Web Service)

Render is highly recommended because it supports a free PostgreSQL database alongside Node.js web services.

### Step 1: Provision PostgreSQL on Render
1. Navigate to the [Render Dashboard](https://dashboard.render.com/) and log in.
2. Click **New +** -> **PostgreSQL**.
3. Fill in the database details:
   - **Name**: `reimburse-db`
   - **Database**: `reimbursement_db`
   - **User**: `postgres`
4. Click **Create Database**.
5. Once spawned, copy the **External Database URL** (to connect locally) or **Internal Database URL** (for connection within Render).

### Step 2: Deploy the Web Service
1. Click **New +** -> **Web Service**.
2. Connect your GitHub repository `vansh700/razorpay`.
3. Configure the following web service settings:
   - **Name**: `reimburse-iq`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npx prisma migrate deploy && node src/index.js`
4. Expand the **Advanced** section and add the environment variables listed in the [Required Environment Variables](#required-environment-variables) section.
5. Click **Deploy Web Service**.

---

## Option 2: Deploying on Railway (Easiest and Fastest Setup)

Railway provides instant PostgreSQL database provisioning and automatically maps database parameters to the web service.

### Step 1: Provision Postgres and Deploy Backend
1. Sign in to your dashboard at [Railway.app](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Once the database is ready, click **New** -> **GitHub Repo** and select `vansh700/razorpay`.

### Step 2: Configure Environment & Deploy
1. Click on the newly added service block for your repository.
2. Go to the **Variables** tab and click **New Variable**:
   - Add `DATABASE_URL` and set its value to `${{Postgres.DATABASE_URL}}` (Railway will automatically inject the connection string of your Postgres database).
   - Add `JWT_SECRET` and set it to a secure random string.
   - Add `COOKIE_SECRET` and set it to a secure random string.
3. Go to the **Settings** tab:
   - Under **Build & Deploy**, set the **Start Command** to:
     ```bash
     npx prisma migrate deploy && node src/index.js
     ```
4. Click **Deploy**. Railway will run migrations, deploy the build, and host the app.

---

## Option 3: Deploying with Docker (Universal)

We have provided a fully configured [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) in the repository.

To run the application locally or on VPS providers (like DigitalOcean or AWS EC2) using Docker:

1. Ensure Docker and Docker Compose are installed.
2. Build and spin up the services:
   ```bash
   docker-compose up --build -d
   ```
3. Docker will start a Postgres database container, execute Prisma migrations, and start the app on `http://localhost:7002/`.
