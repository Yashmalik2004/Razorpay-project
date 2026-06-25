-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMP', 'RM', 'APE', 'CFO');

-- CreateEnum
CREATE TYPE "ReimbursementStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_managers" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "manager_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reimbursements" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "ReimbursementStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reimbursements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reimbursement_approvals" (
    "id" TEXT NOT NULL,
    "reimbursement_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "approver_role" "Role" NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reimbursement_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_managers_employee_id_key" ON "employee_managers"("employee_id");

-- AddForeignKey
ALTER TABLE "employee_managers" ADD CONSTRAINT "employee_managers_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_managers" ADD CONSTRAINT "employee_managers_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursement_approvals" ADD CONSTRAINT "reimbursement_approvals_reimbursement_id_fkey" FOREIGN KEY ("reimbursement_id") REFERENCES "reimbursements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reimbursement_approvals" ADD CONSTRAINT "reimbursement_approvals_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
