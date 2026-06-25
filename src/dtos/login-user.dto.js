/**
 * DTO: Login User
 * Validates the request body for POST /rest/onboardings/login
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORG_DOMAIN = 'org.com';

/**
 * @param {object} body - req.body
 * @returns {string[]} array of error messages (empty = valid)
 */
function validateLoginUser(body) {
  const errors = [];

  const { email, password } = body || {};

  // email — must be valid AND on the org.com domain
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('email must be a valid email address');
  } else if (!email.trim().toLowerCase().endsWith(`@${ORG_DOMAIN}`)) {
    errors.push(`email must be from the ${ORG_DOMAIN} domain`);
  }

  // password
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('password is required');
  }

  return errors;
}

module.exports = { validateLoginUser };
