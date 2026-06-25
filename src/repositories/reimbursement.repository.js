// Repository: Reimbursement — all Prisma access for the reimbursements table
const prisma = require('../config/database');

/**
 * Create a new reimbursement.
 * @param {{ employeeId: string, title: string, description: string, amount: number }} data
 * @returns {Promise<object>}
 */
async function create(data) {
  return prisma.reimbursement.create({
    data: {
      employeeId: data.employeeId,
      title: data.title.trim(),
      description: data.description.trim(),
      amount: data.amount,
      status: 'PENDING',
    },
  });
}

/**
 * Find a unique reimbursement by ID.
 * Includes employee info and their manager mapping.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  return prisma.reimbursement.findUnique({
    where: { id },
    include: {
      employee: {
        include: {
          employeeManagerEntry: true,
        },
      },
    },
  });
}

/**
 * Update the status of a reimbursement.
 * @param {string} id
 * @param {string} status - PENDING | APPROVED | REJECTED
 * @returns {Promise<object>}
 */
async function updateStatus(id, status) {
  return prisma.reimbursement.update({
    where: { id },
    data: { status },
  });
}

/**
 * Find all reimbursements raised by a specific employee.
 * @param {string} employeeId
 * @returns {Promise<object[]>}
 */
async function findByEmployeeId(employeeId) {
  return prisma.reimbursement.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Find all reimbursements across the entire system.
 * @returns {Promise<object[]>}
 */
async function findAll() {
  return prisma.reimbursement.findMany({
    include: {
      employee: {
        include: {
          employeeManagerEntry: true,
        },
      },
      approvals: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Find all reimbursements raised by a list of employee IDs.
 * @param {string[]} employeeIds
 * @returns {Promise<object[]>}
 */
async function findByEmployeeIds(employeeIds) {
  return prisma.reimbursement.findMany({
    where: {
      employeeId: {
        in: employeeIds,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  create,
  findById,
  updateStatus,
  findByEmployeeId,
  findAll,
  findByEmployeeIds,
};
