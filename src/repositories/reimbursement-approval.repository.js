// Repository: ReimbursementApproval — all Prisma access for the reimbursement_approvals table
const prisma = require('../config/database');

/**
 * Record a new approval/rejection decision.
 * @param {{ reimbursementId: string, approverId: string, approverRole: string, decision: string }} data
 * @returns {Promise<object>}
 */
async function create(data) {
  return prisma.reimbursementApproval.create({
    data: {
      reimbursementId: data.reimbursementId,
      approverId: data.approverId,
      approverRole: data.approverRole,
      decision: data.decision,
    },
  });
}

/**
 * Find all decisions made for a reimbursement.
 * @param {string} reimbursementId
 * @returns {Promise<object[]>}
 */
async function findByReimbursementId(reimbursementId) {
  return prisma.reimbursementApproval.findMany({
    where: { reimbursementId },
  });
}

/**
 * Find if a specific approver has already made a decision on a reimbursement.
 * @param {string} reimbursementId
 * @param {string} approverId
 * @returns {Promise<object|null>}
 */
async function findByReimbursementAndApprover(reimbursementId, approverId) {
  return prisma.reimbursementApproval.findFirst({
    where: {
      reimbursementId,
      approverId,
    },
  });
}

module.exports = {
  create,
  findByReimbursementId,
  findByReimbursementAndApprover,
};
