# Razorpay Reimbursement Management Tool (Backend MVP)

A production-ready role-based reimbursement management system built using Node.js, Express, Prisma, and PostgreSQL.

## Features & Architecture

This project is built incrementally following MVC (Model-View-Controller) principles and strict separation of concerns:
- **Controller** (`src/controllers/`): Handles HTTP routing, input validation, cookie management, and maps HTTP requests to services.
- **Service** (`src/services/`): Implements business logic, validation rules, role guards, and domain rules.
- **Repository** (`src/repositories/`): Direct access to Prisma ORM. No business logic or controllers interact with Prisma directly.
- **DTO (Data Transfer Object)** (`src/dtos/`): Enforces request payload validation schemas.

## Requirements

- Node.js >= 20.10.2
- PostgreSQL

## Getting Started

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your database credentials:
   ```bash
   cp .env.example .env
   ```

3. **Run Migrations (Phase 1+)**:
   ```bash
   npm run db:migrate
   ```

4. **Seed Database (Phase 1+)**:
   ```bash
   npm run db:seed-data
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   The backend app starts strictly on **port 7002**.
