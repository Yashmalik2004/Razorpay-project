/**
 * Routes: Employee Management
 * Mounted at: /rest/employees
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate.middleware');
const authorizeRole = require('../middlewares/authorize-role.middleware');

const { assignEmployeeManagerController } = require('../controllers/assign-employee-manager.controller');
const { removeEmployeeManagerController } = require('../controllers/remove-employee-manager.controller');
const { getEmployeesController } = require('../controllers/get-employees.controller');

// CFO-only endpoints to manage assignments
router.post('/assign', authenticate, authorizeRole('CFO'), assignEmployeeManagerController);
router.delete('/assign', authenticate, authorizeRole('CFO'), removeEmployeeManagerController);

// Role-based visibility lists (blocked for EMP)
router.get('/', authenticate, authorizeRole('RM', 'APE', 'CFO'), getEmployeesController);

module.exports = router;
