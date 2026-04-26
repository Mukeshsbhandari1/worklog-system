import { Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: any,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: err.errors 
    });
  }

  if (err.message === 'Unauthorized') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (err.message === 'Forbidden') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
