/**
 * Service: Logout User
 * Business logic for POST /rest/onboardings/logout
 *
 * JWT is stateless — logout is achieved by clearing the httpOnly cookie.
 * This service is a deliberate no-op kept for architectural consistency.
 * If token blacklisting is ever needed in Phase 8, it goes here.
 */

async function logoutUserService() {
  // Intentional no-op — cookie is cleared in the controller layer
  return true;
}

module.exports = logoutUserService;
