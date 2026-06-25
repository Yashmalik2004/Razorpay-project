/**
 * Repository: User
 * All Prisma database access for the `users` table.
 * Services MUST use this; never query Prisma directly from services or controllers.
 */

const prisma = require('../config/database');

/**
 * Find a user by email (includes passwordHash for login comparison).
 * @param {string} email
 * @returns {Promise<object|null>}
 */
async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

/**
 * Find a user by ID (excludes passwordHash — safe for responses).
 * @param {string} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * Create a new user.
 * @param {{ name: string, email: string, passwordHash: string, role: string }} data
 * @returns {Promise<object>} created user (without passwordHash)
 */
async function createUser(data) {
  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Update the role of a user by ID.
 * @param {string} id
 * @param {string} role
 * @returns {Promise<object>} updated user
 */
async function updateRole(id, role) {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}


/**
 * Find all users with a specific role.
 * @param {string} role
 * @returns {Promise<object[]>}
 */
async function findAllByRole(role) {
  return prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Find all users (used by CFO/APE visibility).
 * @returns {Promise<object[]>}
 */
async function findAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateRole,
  findAllByRole,
  findAll,
};
