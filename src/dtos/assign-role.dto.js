/**
 * DTO: Assign Role
 * Validates the request body for POST /rest/roles/assign
 *
 * Rules:
 * - userId: required, non-empty string
 * - role: required, must be one of EMP | RM | APE
 *   (CFO is NOT an assignable role — it is a root-only seed account)
 */

const ASSIGNABLE_ROLES = ['EMP', 'RM', 'APE'];

/**
 * @param {object} body - req.body
 * @returns {string[]} array of error messages (empty = valid)
 */
function validateAssignRole(body) {
  const errors = [];

  const { userId, role } = body || {};

  // userId
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    errors.push('userId is required and must be a valid string');
  }

  // role
  if (!role || !ASSIGNABLE_ROLES.includes(role)) {
    errors.push(`role is required and must be one of: ${ASSIGNABLE_ROLES.join(', ')}`);
  }

  return errors;
}

module.exports = { validateAssignRole, ASSIGNABLE_ROLES };
