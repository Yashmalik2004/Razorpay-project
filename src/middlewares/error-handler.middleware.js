/**
 * Middleware: Global Error Handler
 * Must be registered LAST in app.js (after all routes).
 * Catches all errors passed via next(err).
 *
 * Services throw errors with a custom `statusCode` property.
 * e.g.: const err = new Error('Email already in use'); err.statusCode = 409;
 */

function errorHandler(err, req, res, next) {
  // Use service-attached statusCode, or fall back to 500
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  // Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  return res.status(status).json({
    status: 'error',
    message,
  });
}

module.exports = errorHandler;
