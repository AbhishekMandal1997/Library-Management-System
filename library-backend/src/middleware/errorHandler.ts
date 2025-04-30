import { Request, Response, NextFunction } from 'express';

// Global error handler middleware
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
