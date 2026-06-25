/**
 * Routes: Onboarding
 * Mounted at: /rest/onboardings
 *
 * POST /rest/onboardings/register  — public
 * POST /rest/onboardings/login     — public
 * POST /rest/onboardings/logout    — requires authentication
 * GET  /rest/onboardings/me        — requires authentication (session restore)
 */

const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate.middleware');
const { registerUserController } = require('../controllers/register-user.controller');
const { loginUserController } = require('../controllers/login-user.controller');
const { logoutUserController } = require('../controllers/logout-user.controller');
const { getMeController } = require('../controllers/get-me.controller');

// Public routes
router.post('/register', registerUserController);
router.post('/login', loginUserController);

// Protected routes — must be logged in
router.post('/logout', authenticate, logoutUserController);
router.get('/me', authenticate, getMeController);

module.exports = router;
