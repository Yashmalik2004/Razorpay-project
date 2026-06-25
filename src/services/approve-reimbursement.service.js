/**
 * Service: Approve Reimbursement
 * Business logic for approving a reimbursement
 */

const reimbursementRepository = require('../repositories/reimbursement.repository');
const reimbursementApprovalRepository = require('../repositories/reimbursement-approval.repository');

/**
 * Approves a reimbursement request and transitions its status when conditions are met.
 * @param {string} reimbursementId
 * @param {string} approverId
 * @param {string} approverRole - RM | APE | CFO
 * @returns {Promise<object>} updated reimbursement
 */
async function approveReimbursementService(reimbursementId, approverId, approverRole) {
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

  // 2. Prevent duplicate approval by same approver
  const existingDecision = await reimbursementApprovalRepository.findByReimbursementAndApprover(reimbursementId, approverId);
  if (existingDecision) {
    const error = new Error('You have already made a decision on this reimbursement');
    error.statusCode = 400;
    throw error;
  }

  const assignedManagerId = reimbursement.employee?.employeeManagerEntry?.managerId;

  // 3. RM Role checks: must be the employee's assigned RM
  if (approverRole === 'RM') {
    if (!assignedManagerId || assignedManagerId !== approverId) {
      const error = new Error('Access denied. You can only approve submissions from your subordinates.');
      error.statusCode = 403;
      throw error;
    }
  }

  // 4. Create APPROVED record in reimbursement_approvals
  await reimbursementApprovalRepository.create({
    reimbursementId,
    approverId,
    approverRole,
    decision: 'APPROVED',
  });

  // 5. Recalculate overall status:
  // - If CFO approved -> transition status to APPROVED immediately
  // - Otherwise -> APPROVED if RM (the employee's manager) approved AND at least one APE approved
  let shouldApprove = false;

  if (approverRole === 'CFO') {
    shouldApprove = true;
  } else {
    // Fetch all decisions to check rules
    const allApprovals = await reimbursementApprovalRepository.findByReimbursementId(reimbursementId);
    
    const hasRmApproved = allApprovals.some(
      a => a.approverId === assignedManagerId && a.decision === 'APPROVED'
    );
    const hasApeApproved = allApprovals.some(
      a => a.approverRole === 'APE' && a.decision === 'APPROVED'
    );

    if (hasRmApproved && hasApeApproved) {
      shouldApprove = true;
    }
  }

  let finalReimbursement = reimbursement;
  if (shouldApprove) {
    finalReimbursement = await reimbursementRepository.updateStatus(reimbursementId, 'APPROVED');
  }

  return finalReimbursement;
}

module.exports = approveReimbursementService;
