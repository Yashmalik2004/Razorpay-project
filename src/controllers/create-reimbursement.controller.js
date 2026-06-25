/**
 * Controller: Create Reimbursement
 * POST /rest/reimbursements
 * Access: EMP only
 */

const { validateCreateReimbursement } = require('../dtos/create-reimbursement.dto');
const createReimbursementService = require('../services/create-reimbursement.service');

async function createReimbursementController(req, res, next) {
  try {
    const errors = validateCreateReimbursement(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0],
        errors,
      });
    }

    const { title, description, amount } = req.body;

    const reimbursement = await createReimbursementService(req.user.id, {
      title,
      description,
      amount,
    });

    return res.status(201).json({
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

module.exports = { createReimbursementController };
