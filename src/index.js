// Load environment variables
require('dotenv').config();

const app = require('./app');

// Fetch PORT from environment, defaulting strictly to 7002 per the requirements
const PORT = process.env.PORT || 7002;

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Server started successfully on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});

module.exports = server;
