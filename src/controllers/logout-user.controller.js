/**
 * Controller: Logout User
 * POST /rest/onboardings/logout
 *
 * Requires: authenticate middleware (must be logged in to log out)
 * Flow: clear the auth_token cookie → return 200
 */

const logoutUserService = require('../services/logout-user.service');

async function logoutUserController(req, res, next) {
  try {
    // 1. Call service (no-op for stateless JWT, kept for architectural consistency)
    await logoutUserService();

    // 2. Clear the auth cookie — this is the actual logout mechanism
    res.clearCookie('auth_token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { logoutUserController };
