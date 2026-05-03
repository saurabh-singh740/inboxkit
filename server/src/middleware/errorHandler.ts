import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.status ?? 500;
  const message = err.message || 'Internal Server Error';

  if (env.isDev) {
    console.error(`[Error] ${req.method} ${req.path} →`, err);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(env.isDev && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `${req.method} ${req.path} not found`,
  });
}
