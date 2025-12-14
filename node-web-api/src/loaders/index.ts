import { Application } from 'express';
import { connectDatabase } from '../infrastructure/database/mongo/connection';
import { createExpressApp, setupErrorHandling } from './express';
import { setupRoutes } from './routes';
import { logger } from '../config/logger';

export const loadApp = async (): Promise<Application> => {
  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createExpressApp();

  // Setup routes
  setupRoutes(app);

  // Setup error handling (must be last)
  setupErrorHandling(app);

  logger.info('Application loaded successfully');

  return app;
};

