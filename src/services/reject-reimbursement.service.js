/**
 * Service: Reject Reimbursement
 * Business logic for rejecting a reimbursement
 */

const reimbursementRepository = require('../repositories/reimbursement.repository');
const reimbursementApprovalRepository = require('../repositories/reimbursement-approval.repository');

/**
 * Rejects a reimbursement request immediately.
 * @param {string} reimbursementId
 * @param {string} approverId
 * @param {string} approverRole - RM | APE | CFO
 * @returns {Promise<object>} updated reimbursement
 */
async function rejectReimbursementService(reimbursementId, approverId, approverRole) {
  // 1. Verify reimbursement exists and is PENDING
  const reimbursement = await reimbursementRepository.findById(reimbursementId);
  if (!reimbursement) {
    const error = new Error('Reimbursement not found');
    error.statusCode = 404;
    throw error;
  }
  if (reimbursement.status !== 'PENDING') {
    const error = new Error(`Reimbursement is already ${reimbursement.status.toLowerCase()}`);
    error.statusCode = 400;
    throw error;
  }

  // 2. Prevent duplicate decisions by same user
  const existingDecision = await reimbursementApprovalRepository.findByReimbursementAndApprover(reimbursementId, approverId);
  if (existingDecision) {
    const error = new Error('You have already made a decision on this reimbursement');
    error.statusCode = 400;
    throw error;
  }

  // 3. RM Role checks: must be the employee's assigned RM
  if (approverRole === 'RM') {
    const assignedManagerId = reimbursement.employee?.employeeManagerEntry?.managerId;
    if (!assignedManagerId || assignedManagerId !== approverId) {
      const error = new Error('Access denied. You can only reject submissions from your subordinates.');
      error.statusCode = 403;
      throw error;
    }
  }

  // 4. Create REJECTED record in reimbursement_approvals
  await reimbursementApprovalRepository.create({
    reimbursementId,
    approverId,
    approverRole,
    decision: 'REJECTED',
  });

  // 5. Update reimbursement status to REJECTED immediately
  const updatedReimbursement = await reimbursementRepository.updateStatus(reimbursementId, 'REJECTED');
  return updatedReimbursement;
}

module.exports = rejectReimbursementService;
