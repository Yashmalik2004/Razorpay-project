/**
 * DTO: Assign Employee
 * Validates request body for POST /rest/employees/assign and DELETE /rest/employees/assign
 *
 * Rules:
 * - employeeId (or userId): required, valid string — refers to the EMP user
 * - managerId: required, valid string — refers to the RM user
 *
 * Supports both naming conventions:
 *   { employeeId, managerId }   — internal convention
 *   { userId, managerId }       — assignment PDF convention (userId = employee's userId)
 */

/**
 * Normalizes the body and validates required fields.
 * @param {object} body
 * @returns {{ errors: string[], employeeId: string|undefined, managerId: string|undefined }}
 */
function validateAssignEmployee(body) {
  const errors = [];
  // Accept both `employeeId` and `userId` as the employee reference
  const employeeId = body?.employeeId || body?.userId;
  const managerId = body?.managerId;

  if (!employeeId || typeof employeeId !== 'string' || employeeId.trim().length === 0) {
    errors.push('employeeId (or userId) is required and must be a valid string');
  }

  if (!managerId || typeof managerId !== 'string' || managerId.trim().length === 0) {
    errors.push('managerId is required and must be a valid string');
  }

  return { errors, employeeId, managerId };
}

module.exports = { validateAssignEmployee };
