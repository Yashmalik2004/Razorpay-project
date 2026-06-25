/**
 * Controller: Register User
 * POST /rest/onboardings/register
 *
 * Flow: validate body → call service → return 201
 */

const { validateRegisterUser } = require('../dtos/register-user.dto');
const registerUserService = require('../services/register-user.service');

async function registerUserController(req, res, next) {
  try {
    // 1. Validate request body
    const errors = validateRegisterUser(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: errors[0], // Return the first validation error
        errors,
      });
    }

    const { name, email, password } = req.body;

    // 2. Delegate to service
    const user = await registerUserService({ name, email, password });

    // 3. Return created user
    return res.status(201).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUserController };
