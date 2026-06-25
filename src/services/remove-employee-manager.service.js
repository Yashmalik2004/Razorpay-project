/**
 * Service: Remove Employee-Manager Assignment
 * Business logic for DELETE /rest/employees/assign
 */

const employeeManagerRepository = require('../repositories/employee-manager.repository');

async function removeEmployeeManagerService(data) {
  const { employeeId, managerId } = data;

  // 1. Verify mapping exists
  const existingMapping = await employeeManagerRepository.findByEmployeeId(employeeId);
  if (!existingMapping || existingMapping.managerId !== managerId) {
    const error = new Error('Employee-Manager assignment not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Delete mapping
  await employeeManagerRepository.deleteByEmployeeId(employeeId);
  return { message: 'Assignment successfully removed' };
}

module.exports = removeEmployeeManagerService;
