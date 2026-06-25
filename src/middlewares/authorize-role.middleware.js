/**
 * Middleware: Authorize Role (RBAC Guard)
 * Restricts route access to users with specific roles.
 * Must always be used AFTER the `authenticate` middleware (needs req.user).
 *
 * Usage:
 *   router.post('/assign', authenticate, authorizeRole('CFO'), controller)
 *   router.get('/data',    authenticate, authorizeRole('RM', 'APE', 'CFO'), controller)
 *
 * @param {...string} allowedRoles - One or more roles that may access the route
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // req.user is attached by the authenticate middleware
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

module.exports = authorizeRole;
