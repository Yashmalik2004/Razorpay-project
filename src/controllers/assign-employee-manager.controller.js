/**
 * Controller: Assign Employee-Manager
 * POST /rest/employees/assign
 * Access: CFO only
 */

const { validateAssignEmployee } = require('../dtos/assign-employee.dto');
const assignEmployeeManagerService = require('../services/assign-employee-manager.service');

async function assignEmployeeManagerController(req, res, next) {
  try {
    const { errors, employeeId, managerId } = validateAssignEmployee(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0],
        errors,
      });
    }

    const assignment = await assignEmployeeManagerService({ employeeId, managerId });

    return res.status(200).json({
      status: 'success',
      data: {
        id: assignment.id,
        employeeId: assignment.employeeId,
        managerId: assignment.managerId,
        createdAt: assignment.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { assignEmployeeManagerController };
