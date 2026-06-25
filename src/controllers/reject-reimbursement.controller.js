/**
 * Controller: Reject Reimbursement
 * PATCH /rest/reimbursements/:id (decision=REJECTED)
 * Access: RM / APE / CFO
 */

const rejectReimbursementService = require('../services/reject-reimbursement.service');

async function rejectReimbursementController(req, res, next) {
  try {
    const { id } = req.params;
    const approverId = req.user.id;
    const approverRole = req.user.role;

    const reimbursement = await rejectReimbursementService(id, approverId, approverRole);

    return res.status(200).json({
      status: 'success',
      data: {
        id: reimbursement.id,
        employeeId: reimbursement.employeeId,
        title: reimbursement.title,
        description: reimbursement.description,
        amount: parseFloat(reimbursement.amount),
        status: reimbursement.status,
        createdAt: reimbursement.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { rejectReimbursementController };
