/**
 * Service: Create Reimbursement
 * Business logic for POST /rest/reimbursements
 */

const reimbursementRepository = require('../repositories/reimbursement.repository');

/**
 * Creates a new reimbursement request under PENDING status.
 * @param {string} employeeId - The ID of the employee raising the request
 * @param {{ title: string, description: string, amount: number }} data
 * @returns {Promise<object>}
 */
async function createReimbursementService(employeeId, data) {
  const { title, description, amount } = data;

  const reimbursement = await reimbursementRepository.create({
    employeeId,
    title,
    description,
    amount: parseFloat(amount),
  });

  return reimbursement;
}

module.exports = createReimbursementService;
