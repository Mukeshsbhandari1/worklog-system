import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { hashPassword } from '../utils/auth';
import { UserRole } from '@prisma/client';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['ADMIN', 'PM', 'TEAM_MEMBER']),
});

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['ADMIN', 'PM', 'TEAM_MEMBER']).optional(),
  isActive: z.boolean().optional(),
});

export const listUsers = async (req: any, res: Response) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const createUser = async (req: any, res: Response) => {
  try {
    const data = createUserSchema.parse(req.body);
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const updateUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const getUserStats = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get worklog stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [todayHours, weekHours, totalHours] = await Promise.all([
      prisma.workLog.aggregate({
        where: { userId: id, date: { gte: today }, status: 'APPROVED' },
        _sum: { hours: true },
      }),
      prisma.workLog.aggregate({
        where: { userId: id, date: { gte: weekStart }, status: 'APPROVED' },
        _sum: { hours: true },
      }),
      prisma.workLog.aggregate({
        where: { userId: id, status: 'APPROVED' },
        _sum: { hours: true },
      }),
    ]);

    res.json({
      user,
      stats: {
        todayHours: todayHours._sum.hours || 0,
        weekHours: weekHours._sum.hours || 0,
        totalHours: totalHours._sum.hours || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
};
