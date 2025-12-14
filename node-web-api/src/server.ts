import { env } from './config/env';
import { logger } from './config/logger';
import { loadApp } from './loaders';

const startServer = async (): Promise<void> => {
  try {
    const app = await loadApp();

    app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`API Version: ${env.apiVersion}`);
      logger.info(`API Base URL: http://localhost:${env.port}/api/${env.apiVersion}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

