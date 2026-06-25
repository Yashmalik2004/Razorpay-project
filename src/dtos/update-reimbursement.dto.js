/**
 * DTO: Update Reimbursement Approval/Rejection Decision
 * Validates request body for PATCH /rest/reimbursements and PATCH /rest/reimbursements/:id
 *
 * Accepts both:
 *   - { "decision": "APPROVED" | "REJECTED" }  (our internal convention)
 *   - { "status": "APPROVED" | "REJECTED" }     (assignment PDF convention)
 */

const ALLOWED_DECISIONS = ['APPROVED', 'REJECTED'];

/**
 * Normalizes and validates the update body.
 * Returns { errors, decision } — normalized 'decision' value for downstream use.
 * @param {object} body
 * @returns {{ errors: string[], decision: string|null }}
 */
function validateUpdateReimbursement(body) {
  const errors = [];
  // Support both `status` (PDF spec) and `decision` (internal) — prefer status if both provided
  const raw = body?.status || body?.decision;
  const decision = typeof raw === 'string' ? raw.toUpperCase() : null;

  if (!decision || !ALLOWED_DECISIONS.includes(decision)) {
    errors.push(`status is required and must be one of: ${ALLOWED_DECISIONS.join(', ')}`);
  }

  return { errors, decision };
}

module.exports = { validateUpdateReimbursement, ALLOWED_DECISIONS };
