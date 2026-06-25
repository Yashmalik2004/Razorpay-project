/**
 * Controller: Get Me (Current User)
 * GET /rest/onboardings/me
 *
 * Returns the currently authenticated user's profile information.
 * Requires authentication middleware (reads JWT from auth_token cookie).
 * Called by frontend on page load to restore user session after refresh.
 */

const { getMeService } = require('../services/get-me.service');

async function getMeController(req, res, next) {
  try {
    // req.user is attached by authenticate middleware
    // It contains { id, role } from the JWT token
    const userId = req.user.id;

    // Fetch user details using the service
    const user = await getMeService(userId);

    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    // User not found or other error — treat as unauthorized
    if (err.message === 'User not found') {
      // Clear the invalid auth token cookie
      res.clearCookie('auth_token');
      return res.status(401).json({
        status: 'error',
        message: 'Session invalid. Please log in again.',
      });
    }
    next(err);
  }
}

module.exports = { getMeController };
