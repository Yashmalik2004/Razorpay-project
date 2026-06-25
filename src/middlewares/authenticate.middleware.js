/**
 * Middleware: Authenticate
 * Reads the `auth_token` httpOnly cookie, verifies the JWT,
 * and attaches the decoded payload to req.user = { id, role }.
 *
 * Usage: mount on any route that requires a logged-in user.
 */

const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  // 1. Read token from cookie
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Please log in.',
    });
  }

  // 2. Verify signature and expiry
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded payload — { id, role } — to the request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    // Covers TokenExpiredError, JsonWebTokenError, etc.
    return res.status(401).json({
      status: 'error',
      message: 'Session expired or invalid. Please log in again.',
    });
  }
}

module.exports = authenticate;
