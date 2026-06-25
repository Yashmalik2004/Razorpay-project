/**
 * Controller: Get Reimbursements
 * GET /rest/reimbursements AND GET /rest/reimbursements/:userId
 * Access: Role-based visibility
 */

const getReimbursementsService = require('../services/get-reimbursements.service');

async function getReimbursementsController(req, res, next) {
  try {
    const { userId } = req.params;

    // req.user is set by authenticate middleware
    const reimbursements = await getReimbursementsService(req.user, userId || null);

    return res.status(200).json({
      status: 'success',
      data: {
        reimbursements,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReimbursementsController };
