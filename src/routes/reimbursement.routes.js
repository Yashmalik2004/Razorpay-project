/**
 * Routes: Reimbursement Management
 * Mounted at: /rest/reimbursements
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate.middleware');
const authorizeRole = require('../middlewares/authorize-role.middleware');

const { createReimbursementController } = require('../controllers/create-reimbursement.controller');
const { approveReimbursementController } = require('../controllers/approve-reimbursement.controller');
const { rejectReimbursementController } = require('../controllers/reject-reimbursement.controller');
const { getReimbursementsController } = require('../controllers/get-reimbursements.controller');

const { validateUpdateReimbursement } = require('../dtos/update-reimbursement.dto');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: shared PATCH handler that routes to approve or reject
// ─────────────────────────────────────────────────────────────────────────────
function handlePatch(req, res, next) {
  const { errors, decision } = validateUpdateReimbursement(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: errors[0],
      errors,
    });
  }

  // Support PDF spec: body may carry { userId } as the reimbursement ID
  // Falls back to the route param :id if no userId in body
  if (!req.params.id && req.body.userId) {
    req.params.id = req.body.userId;
  }

  if (!req.params.id) {
    return res.status(400).json({
      status: 'error',
      message: 'Reimbursement id is required (pass as route param or userId in body)',
    });
  }

  // Attach normalized decision so controllers don't need to re-read body
  req.normalizedDecision = decision;

  if (decision === 'APPROVED') {
    return approveReimbursementController(req, res, next);
  } else {
    return rejectReimbursementController(req, res, next);
  }
}

// Create a reimbursement (EMP only)
router.post('/', authenticate, authorizeRole('EMP'), createReimbursementController);

// Approve or Reject — PDF spec: PATCH /rest/reimbursements  { userId, status }
router.patch('/', authenticate, authorizeRole('RM', 'APE', 'CFO'), handlePatch);

// Approve or Reject — internal convention: PATCH /rest/reimbursements/:id  { decision }
router.patch('/:id', authenticate, authorizeRole('RM', 'APE', 'CFO'), handlePatch);

// GET /rest/reimbursements (role-based visibility filter)
router.get('/', authenticate, getReimbursementsController);

// GET /rest/reimbursements/:userId (subordinate list, manager/CFO checks inside controller/service)
router.get('/:userId', authenticate, getReimbursementsController);

module.exports = router;
