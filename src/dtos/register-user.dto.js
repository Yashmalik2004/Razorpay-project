/**
 * DTO: Register User
 * Validates the request body for POST /rest/onboardings/register
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORG_DOMAIN = 'org.com';

/**
 * @param {object} body - req.body
 * @returns {string[]} array of error messages (empty = valid)
 */
function validateRegisterUser(body) {
  const errors = [];

  const { name, email, password } = body || {};

  // name
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name is required and must be at least 2 characters');
  }

  // email — must be valid AND on the org.com domain
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('email must be a valid email address');
  } else if (!email.trim().toLowerCase().endsWith(`@${ORG_DOMAIN}`)) {
    errors.push(`email must be from the ${ORG_DOMAIN} domain`);
  }

  // password
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('password is required and must be at least 8 characters');
  }

  return errors;
}

module.exports = { validateRegisterUser };
