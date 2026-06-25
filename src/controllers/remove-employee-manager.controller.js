/**
 * Controller: Remove Employee-Manager
 * DELETE /rest/employees/assign
 * Access: CFO only
 */

const { validateAssignEmployee } = require('../dtos/assign-employee.dto');
const removeEmployeeManagerService = require('../services/remove-employee-manager.service');

async function removeEmployeeManagerController(req, res, next) {
  try {
    const { errors, employeeId, managerId } = validateAssignEmployee(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0],
        errors,
      });
    }

    const result = await removeEmployeeManagerService({ employeeId, managerId });

    return res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { removeEmployeeManagerController };
