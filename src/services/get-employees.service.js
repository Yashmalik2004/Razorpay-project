/**
 * Service: Get Employees
 * Business logic for GET /rest/employees
 */

const userRepository = require('../repositories/user.repository');
const employeeManagerRepository = require('../repositories/employee-manager.repository');

/**
 * Resolves role-based employee visibility rules and formats output.
 * @param {{ id: string, role: string }} requester - The user making the request
 * @returns {Promise<object[]>} formatted list of visible users
 */
async function getEmployeesService(requester) {
  const { id: requesterId, role: requesterRole } = requester;
  let rawUsers = [];

  if (requesterRole === 'CFO') {
    // CFO sees everyone in the organization
    rawUsers = await userRepository.findAll();
  } else if (requesterRole === 'APE') {
    // APE sees all EMP and RM users
    const allUsers = await userRepository.findAll();
    rawUsers = allUsers.filter(u => u.role === 'EMP' || u.role === 'RM');
  } else if (requesterRole === 'RM') {
    // RM sees only EMP users reporting to them
    const mappings = await employeeManagerRepository.findByManagerId(requesterId);
    rawUsers = mappings.map(m => m.employee);
  } else {
    // EMP or unauthorized roles get blocked (also guarded by route middleware)
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  // Map database format to the exact API specification response shape:
  // userId, name, email, role
  const formattedUsers = rawUsers.map(user => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return formattedUsers;
}

module.exports = getEmployeesService;
