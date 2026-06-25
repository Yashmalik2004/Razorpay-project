/**
 * DTO: Create Reimbursement
 * Validates the request body for POST /rest/reimbursements
 */

function validateCreateReimbursement(body) {
  const errors = [];
  const { title, description, amount } = body || {};

  // Title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('title is required and must be a valid string');
  }

  // Description
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push('description is required and must be a valid string');
  }

  // Amount
  const parsedAmount = parseFloat(amount);
  if (amount === undefined || amount === null || isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  return errors;
}

module.exports = { validateCreateReimbursement };
