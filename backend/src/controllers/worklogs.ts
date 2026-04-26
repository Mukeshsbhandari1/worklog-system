import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { WorkLogStatus } from '@prisma/client';

const createWorkLogSchema = z.object({
  projectId: z.string(),
  taskId: z.string().optional(),
  date: z.string().datetime(),
  hours: z.number().min(0),
  description: z.string(),
  billable: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  timerData: z.record(z.any()).optional(),
});

const updateWorkLogSchema = z.object({
  taskId: z.string().optional(),
  date: z.string().datetime().optional(),
  hours: z.number().min(0).optional(),
  description: z.string().optional(),
  billable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  timerData: z.record(z.any()).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),
});

export const listWorkLogs = async (req: any, res: Response) => {
  try {
    const { userId, projectId, taskId, status, date, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (taskId) where.taskId = taskId;
    if (status) where.status = status;
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = { gte: dateObj, lt: nextDay };
    }

    const [workLogs, total] = await Promise.all([
      prisma.workLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          project: { select: { id: true, name: true } },
          task: { select: { id: true, title: true } },
          approval: true,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.workLog.count({ where }),
    ]);

    res.json({
      data: workLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch work logs' });
  }
};

export const createWorkLog = async (req: any, res: Response) => {
  try {
    const data = createWorkLogSchema.parse(req.body);

    const workLog = await prisma.workLog.create({
      data: {
        ...data,
        userId: req.user.id,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        approval: true,
      },
    });

    res.status(201).json(workLog);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create work log' });
  }
};

export const getWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const workLog = await prisma.workLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        approval: true,
      },
    });

    if (!workLog) {
      return res.status(404).json({ message: 'Work log not found' });
    }

    res.json(workLog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch work log' });
  }
};

export const updateWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateWorkLogSchema.parse(req.body);

    const workLog = await prisma.workLog.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        approval: true,
      },
    });

    res.json(workLog);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Work log not found' });
    }
    res.status(500).json({ message: 'Failed to update work log' });
  }
};

export const deleteWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.workLog.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Work log not found' });
    }
    res.status(500).json({ message: 'Failed to delete work log' });
  }
};

export const submitWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const workLog = await prisma.workLog.update({
      where: { id },
      data: { status: 'SUBMITTED' },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        approval: true,
      },
    });

    res.json(workLog);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Work log not found' });
    }
    res.status(500).json({ message: 'Failed to submit work log' });
  }
};

export const getMyWorkLogs = async (req: any, res: Response) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { userId: req.user.id };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const [workLogs, total] = await Promise.all([
      prisma.workLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          project: { select: { id: true, name: true } },
          task: { select: { id: true, title: true } },
          approval: true,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.workLog.count({ where }),
    ]);

    res.json({
      data: workLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch work logs' });
  }
};
