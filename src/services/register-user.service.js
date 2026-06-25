/**
 * Service: Register User
 * Business logic for POST /rest/onboardings/register
 *
 * Rules:
 * - Email must be unique (409 if duplicate)
 * - Password is hashed with bcrypt before storing
 * - Role is ALWAYS set to EMP — never trust client-sent role
 */

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;

/**
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ id, name, email, role, createdAt }>}
 */
async function registerUserService(data) {
  const { name, email, password } = data;

  // 1. Check email uniqueness
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const error = new Error('Email is already in use');
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash password — never store plain text
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Create user — role is always EMP at self-registration
  const user = await userRepository.createUser({
    name,
    email,
    passwordHash,
    role: 'EMP',
  });

  return user;
}

module.exports = registerUserService;
