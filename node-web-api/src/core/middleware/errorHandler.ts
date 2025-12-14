import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../http/ApiError';
import { ResponseBuilder } from '../http/ApiResponse';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = 500;
    const message = err.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false);
  }

  const apiError = error as ApiError;

  // Log error
  if (apiError.statusCode >= 500) {
    logger.error('Error:', {
      error: apiError.message,
      stack: apiError.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn('Client Error:', {
      error: apiError.message,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  const response = ResponseBuilder.error(
    apiError.message,
    apiError.errors
  );

  if (env.nodeEnv === 'development' && apiError.statusCode >= 500) {
    (response as any).stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(response);
};

