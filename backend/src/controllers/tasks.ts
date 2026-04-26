import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { TaskStatus, TaskPriority } from '@prisma/client';

const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  estimatedHours: z.number().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  estimatedHours: z.number().optional(),
});

export const listTasks = async (req: any, res: Response) => {
  try {
    const { projectId, status, priority, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { _count: { select: { workLogs: true } } },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        priority: (data.priority as TaskPriority) || 'MEDIUM',
      },
      include: { _count: { select: { workLogs: true } } },
    });

    res.status(201).json(task);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateTaskSchema.parse(req.body);

    const task = await prisma.task.update({
      where: { id },
      data,
      include: { _count: { select: { workLogs: true } } },
    });

    res.json(task);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Failed to update task' });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
