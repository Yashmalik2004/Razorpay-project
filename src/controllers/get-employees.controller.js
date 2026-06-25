/**
 * Controller: Get Employees
 * GET /rest/employees
 * Access: RM, APE, CFO (blocked for EMP)
 */

const getEmployeesService = require('../services/get-employees.service');

async function getEmployeesController(req, res, next) {
  try {
    // req.user has been attached by authenticate middleware
    const users = await getEmployeesService(req.user);

    return res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEmployeesController };
