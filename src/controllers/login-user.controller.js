/**
 * Controller: Login User
 * POST /rest/onboardings/login
 *
 * Flow: validate body → call service → set httpOnly cookie → return 200
 * The JWT token is NEVER returned in the response body — only via cookie.
 */

const { validateLoginUser } = require('../dtos/login-user.dto');
const loginUserService = require('../services/login-user.service');

// Cookie options — httpOnly prevents JS access (XSS protection)
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

async function loginUserController(req, res, next) {
  try {
    // 1. Validate request body
    const errors = validateLoginUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0],
        errors,
      });
    }

    const { email, password } = req.body;

    // 2. Delegate to service — gets token + user
    const { token, user } = await loginUserService({ email, password });

    // 3. Set JWT in httpOnly cookie — NOT in response body
    res.cookie('auth_token', token, COOKIE_OPTIONS);

    // 4. Return sanitized user info only
    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { loginUserController };
