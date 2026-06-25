/**
 * Service: Get Reimbursements
 * Business logic for role-based reimbursement visibility
 */

const reimbursementRepository = require('../repositories/reimbursement.repository');
const userRepository = require('../repositories/user.repository');
const employeeManagerRepository = require('../repositories/employee-manager.repository');

/**
 * Lists reimbursements matching the user's role-based visibility permissions.
 * @param {{ id: string, role: string }} requestingUser
 * @param {string|null} targetUserId
 * @returns {Promise<object[]>} list of filtered reimbursements
 */
async function getReimbursementsService(requestingUser, targetUserId = null) {
  const { id: requesterId, role: requesterRole } = requestingUser;

  // 1. If targetUserId is provided, perform subordinate checks
  if (targetUserId) {
    // Only RM and CFO are allowed to query specific users (subordinate checks)
    if (requesterRole !== 'RM' && requesterRole !== 'CFO') {
      const error = new Error('Access denied. Only managers can view subordinate records.');
      error.statusCode = 403;
      throw error;
    }

    // Verify target user is an EMP
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      const error = new Error('Target user not found');
      error.statusCode = 404;
      throw error;
    }
    if (targetUser.role !== 'EMP') {
      const error = new Error('Target user is not an employee');
      error.statusCode = 400;
      throw error;
    }

    // If requester is RM, verify the employee is their subordinate
    if (requesterRole === 'RM') {
      const assignment = await employeeManagerRepository.findByEmployeeId(targetUserId);
      if (!assignment || assignment.managerId !== requesterId) {
        const error = new Error('Access denied. This user is not your subordinate.');
        error.statusCode = 403;
        throw error;
      }
    }

    // Return ALL reimbursements for the target employee
    const items = await reimbursementRepository.findByEmployeeId(targetUserId);
    return items.map(item => ({
      id: item.id,
      employeeId: item.employeeId,
      title: item.title,
      description: item.description,
      amount: parseFloat(item.amount),
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  // 2. No targetUserId: query all matching visibility rules
  const allItems = await reimbursementRepository.findAll();

  let filtered = [];

  if (requesterRole === 'EMP') {
    // EMP: returns only self
    filtered = allItems.filter(item => item.employeeId === requesterId);
  } else if (requesterRole === 'RM') {
    // RM: returns PENDING reimbursements from direct reports
    filtered = allItems.filter(item => {
      const assignedManagerId = item.employee?.employeeManagerEntry?.managerId;
      return item.status === 'PENDING' && assignedManagerId === requesterId;
    });
  } else if (requesterRole === 'APE') {
    // APE: returns PENDING reimbursements approved by RM (or if employee has no manager assigned)
    filtered = allItems.filter(item => {
      if (item.status !== 'PENDING') return false;
      const assignedManagerId = item.employee?.employeeManagerEntry?.managerId;
      if (!assignedManagerId) return true; // No manager assigned, goes directly to APE
      return item.approvals.some(
        a => a.approverId === assignedManagerId && a.decision === 'APPROVED'
      );
    });
  } else if (requesterRole === 'CFO') {
    // CFO: returns all reimbursements approved by APEs
    filtered = allItems.filter(item => {
      return item.approvals.some(
        a => a.approverRole === 'APE' && a.decision === 'APPROVED'
      );
    });
  }

  return filtered.map(item => ({
    id: item.id,
    employeeId: item.employeeId,
    title: item.title,
    description: item.description,
    amount: parseFloat(item.amount),
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}

module.exports = getReimbursementsService;
