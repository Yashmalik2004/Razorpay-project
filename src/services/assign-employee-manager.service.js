/**
 * Service: Assign Employee-Manager
 * Business logic for POST /rest/employees/assign
 */

const employeeManagerRepository = require('../repositories/employee-manager.repository');
const userRepository = require('../repositories/user.repository');

async function assignEmployeeManagerService(data) {
  const { employeeId, managerId } = data;

  // 1. Verify target employee user exists and has the EMP role
  const employee = await userRepository.findById(employeeId);
  if (!employee) {
    const error = new Error('Employee user not found');
    error.statusCode = 404;
    throw error;
  }
  if (employee.role !== 'EMP') {
    const error = new Error('Target user is not an employee (must have role EMP)');
    error.statusCode = 400;
    throw error;
  }

  // 2. Verify target manager user exists and has the RM role
  const manager = await userRepository.findById(managerId);
  if (!manager) {
    const error = new Error('Manager user not found');
    error.statusCode = 404;
    throw error;
  }
  if (manager.role !== 'RM') {
    const error = new Error('Target manager must have role RM');
    error.statusCode = 400;
    throw error;
  }

  // 3. Create or update assignment
  const assignment = await employeeManagerRepository.create({ employeeId, managerId });
  return assignment;
}

module.exports = assignEmployeeManagerService;
