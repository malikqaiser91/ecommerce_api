const dotenv = require('dotenv').config({
  path: './backend/config/config.env',
});
const app = require('./app');

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
