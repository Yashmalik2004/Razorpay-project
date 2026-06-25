/**
 * Service: Get Current User (Me)
 * Fetches the full user profile from the database excluding password hash.
 * Called by the get-me controller to restore user session on frontend page load.
 */

const { findById } = require('../repositories/user.repository');

async function getMeService(userId) {
  // Fetch user by ID, exclude password hash for security
  const user = await findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Return only safe fields
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

module.exports = { getMeService };
