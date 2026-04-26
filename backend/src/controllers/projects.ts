import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { ProjectStatus, ProjectMemberRole } from '@prisma/client';

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  client: z.string().optional(),
  budget: z.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  client: z.string().optional(),
  budget: z.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const listProjects = async (req: any, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { status: status || 'ACTIVE' };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          projectMembers: { select: { userId: true, role: true } },
          _count: { select: { tasks: true, workLogs: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: any, res: Response) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        ...data,
        createdById: req.user.id,
      },
      include: { projectMembers: true },
    });

    res.status(201).json(project);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create project' });
  }
};

export const getProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        projectMembers: {
          include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        },
        tasks: { include: { _count: { select: { workLogs: true } } } },
        _count: { select: { workLogs: true } },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateProjectSchema.parse(req.body);

    const project = await prisma.project.update({
      where: { id },
      data,
      include: { projectMembers: true },
    });

    res.json(project);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Failed to update project' });
  }
};

export const addProjectMember = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = z.object({
      userId: z.string(),
      role: z.enum(['MEMBER', 'LEAD', 'PM']).optional(),
    }).parse(req.body);

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId,
        role: (role as ProjectMemberRole) || 'MEMBER',
      },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });

    res.status(201).json(member);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User already a member of this project' });
    }
    res.status(500).json({ message: 'Failed to add project member' });
  }
};

export const removeProjectMember = async (req: any, res: Response) => {
  try {
    const { id, memberId } = req.params;

    await prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(500).json({ message: 'Failed to remove project member' });
  }
};
