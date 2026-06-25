/**
 * Service: Assign Role
 * Business logic for POST /rest/roles/assign
 *
 * Rules:
 * 1. Target user must exist
 * 2. Cannot assign CFO role (root-only via seed)
 * 3. CFO cannot reassign their own role (prevents self-demotion)
 * 4. Update role via repository
 */

const userRepository = require('../repositories/user.repository');

/**
 * @param {string} userId     - ID of the user whose role is being changed
 * @param {string} role       - New role to assign (EMP | RM | APE)
 * @param {string} requesterId - ID of the CFO making the request
 * @returns {Promise<{ id, name, email, role }>}
 */
async function assignRoleService(userId, role, requesterId) {
  // 1. Verify target user exists
  const targetUser = await userRepository.findById(userId);
  if (!targetUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Prevent assigning CFO role — it is root-only
  if (role === 'CFO') {
    const error = new Error('Cannot assign CFO role');
    error.statusCode = 403;
    throw error;
  }

  // 3. Prevent CFO from demoting themselves
  if (userId === requesterId) {
    const error = new Error('Cannot reassign your own role');
    error.statusCode = 403;
    throw error;
  }

  // 4. Update role in DB via repository
  const updatedUser = await userRepository.updateRole(userId, role);

  return updatedUser;
}

module.exports = assignRoleService;
