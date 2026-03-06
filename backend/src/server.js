const app = require('./app');
const { env } = require('./config/env');
const { logger } = require('./middlewares/error');

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`🌐 Health check: http://localhost:${PORT}/api/health`);
  if (env.DEMO_MODE) {
    logger.warn('⚠️ DEMO_MODE activated! Mocking data where applicable.');
  }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  server.close(() => {
    logger.info('Closed out remaining connections.');
    process.exit(0);
  });
});
