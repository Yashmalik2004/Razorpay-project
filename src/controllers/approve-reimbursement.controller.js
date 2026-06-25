/**
 * Controller: Approve Reimbursement
 * PATCH /rest/reimbursements/:id (decision=APPROVED)
 * Access: RM / APE / CFO
 */

const approveReimbursementService = require('../services/approve-reimbursement.service');

async function approveReimbursementController(req, res, next) {
  try {
    const { id } = req.params;
    const approverId = req.user.id;
    const approverRole = req.user.role;

    const reimbursement = await approveReimbursementService(id, approverId, approverRole);

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

module.exports = { approveReimbursementController };
