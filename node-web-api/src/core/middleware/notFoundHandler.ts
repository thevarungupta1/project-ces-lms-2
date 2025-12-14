import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../http/ApiError';

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

