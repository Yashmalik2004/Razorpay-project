const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

// Routes
const onboardingRoutes = require('./routes/onboarding.routes');
const roleRoutes = require('./routes/role.routes');
const employeeRoutes = require('./routes/employee.routes');
const reimbursementRoutes = require('./routes/reimbursement.routes');

// Middlewares
const errorHandler = require('./middlewares/error-handler.middleware');

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'fallback-cookie-secret'));

// ─────────────────────────────────────────────────────────────────────────────
// Static Frontend — serves frontend/index.html at http://localhost:7002/
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Razorpay Reimbursement Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use('/rest/onboardings', onboardingRoutes);
app.use('/rest/roles', roleRoutes);
app.use('/rest/employees', employeeRoutes);
app.use('/rest/reimbursements', reimbursementRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// 404 Handler — catch-all for unmatched routes
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  return res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler — MUST be last
// ─────────────────────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
