/**
 * Routes: Role Management
 * Mounted at: /rest/roles
 *
 * POST /rest/roles/assign  — requires CFO role
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate.middleware');
const authorizeRole = require('../middlewares/authorize-role.middleware');
const { assignRoleController } = require('../controllers/assign-role.controller');

// CFO-only route to assign roles to users
router.post('/assign', authenticate, authorizeRole('CFO'), assignRoleController);

module.exports = router;
