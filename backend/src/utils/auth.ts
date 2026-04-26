import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export const generateToken = (
  userId: string,
  email: string,
  role: UserRole
): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(
    { id: userId, email, role },
    secret as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRY || '7d' } as jwt.SignOptions
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
