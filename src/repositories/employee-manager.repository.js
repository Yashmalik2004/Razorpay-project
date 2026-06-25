// Repository: EmployeeManager — all Prisma access for the employee_managers table
const prisma = require('../config/database');

/**
 * Find an assignment mapping by Employee ID.
 * @param {string} employeeId
 * @returns {Promise<object|null>}
 */
async function findByEmployeeId(employeeId) {
  return prisma.employeeManager.findUnique({
    where: { employeeId },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Find all mappings for a specific manager ID.
 * @param {string} managerId
 * @returns {Promise<object[]>}
 */
async function findByManagerId(managerId) {
  return prisma.employeeManager.findMany({
    where: { managerId },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

/**
 * Upsert or create an employee-manager assignment.
 * @param {{ employeeId: string, managerId: string }} data
 * @returns {Promise<object>}
 */
async function create(data) {
  const { employeeId, managerId } = data;
  return prisma.employeeManager.upsert({
    where: { employeeId },
    update: { managerId },
    create: { employeeId, managerId },
  });
}

/**
 * Delete assignment for a given employee.
 * @param {string} employeeId
 * @returns {Promise<object>}
 */
async function deleteByEmployeeId(employeeId) {
  return prisma.employeeManager.delete({
    where: { employeeId },
  });
}

module.exports = {
  findByEmployeeId,
  findByManagerId,
  create,
  deleteByEmployeeId,
};
