/**
 * Controller: Assign Role
 * POST /rest/roles/assign
 *
 * Access: CFO only (enforced by authorizeRole middleware on the route)
 * Flow: validate body → call service → return 200
 */

const { validateAssignRole } = require('../dtos/assign-role.dto');
const assignRoleService = require('../services/assign-role.service');

async function assignRoleController(req, res, next) {
  try {
    // 1. Validate request body
    const errors = validateAssignRole(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0],
        errors,
      });
    }

    const { userId, role } = req.body;

    // 2. req.user.id is the CFO making the request (set by authenticate middleware)
    const requesterId = req.user.id;

    // 3. Delegate to service
    const updatedUser = await assignRoleService(userId, role, requesterId);

    // 4. Return updated user
    return res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { assignRoleController };
