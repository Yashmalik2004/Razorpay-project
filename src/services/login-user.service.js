/**
 * Service: Login User
 * Business logic for POST /rest/onboardings/login
 *
 * Security rules:
 * - Return the same generic error whether email is wrong or password is wrong
 *   (prevents user enumeration attacks)
 * - JWT payload contains ONLY { id, role } — minimal surface area
 * - Token expiry: 7 days
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

/**
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ token: string, user: { id, name, email, role } }>}
 */
async function loginUserService(data) {
  const { email, password } = data;

  // 1. Find user — includes passwordHash
  const user = await userRepository.findByEmail(email);

  // 2. Generic error — do NOT reveal whether email exists
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 3. Compare password against stored hash
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // 4. Sign JWT — only embed id and role
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 5. Return token + sanitized user (no passwordHash)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = loginUserService;
