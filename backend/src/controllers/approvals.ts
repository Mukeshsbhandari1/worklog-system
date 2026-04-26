import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/db';
import { ApprovalStatus } from '@prisma/client';

const approveWorkLogSchema = z.object({
  comments: z.string().optional(),
});

export const getPendingApprovals = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [approvals, total] = await Promise.all([
      prisma.approval.findMany({
        where: { status: 'PENDING' },
        skip,
        take: parseInt(limit),
        include: {
          worklog: {
            include: {
              user: { select: { id: true, email: true, firstName: true, lastName: true } },
              project: { select: { id: true, name: true } },
              task: { select: { id: true, title: true } },
            },
          },
          reviewedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.approval.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      data: approvals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approvals' });
  }
};

export const approveWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { comments } = approveWorkLogSchema.parse(req.body);

    const approval = await prisma.approval.update({
      where: { id },
      data: {
        status: 'APPROVED',
        comments,
      },
      include: {
        worklog: true,
        reviewedBy: { select: { id: true, email: true } },
      },
    });

    // Update worklog status to approved
    await prisma.workLog.update({
      where: { id: approval.worklogId },
      data: { status: 'APPROVED' },
    });

    res.json(approval);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Approval not found' });
    }
    res.status(500).json({ message: 'Failed to approve work log' });
  }
};

export const rejectWorkLog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { comments } = approveWorkLogSchema.parse(req.body);

    const approval = await prisma.approval.update({
      where: { id },
      data: {
        status: 'REJECTED',
        comments,
      },
      include: {
        worklog: true,
        reviewedBy: { select: { id: true, email: true } },
      },
    });

    // Update worklog status to rejected
    await prisma.workLog.update({
      where: { id: approval.worklogId },
      data: { status: 'REJECTED' },
    });

    res.json(approval);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Approval not found' });
    }
    res.status(500).json({ message: 'Failed to reject work log' });
  }
};

export const getApprovalsByUser = async (req: any, res: Response) => {
  try {
    const { userId, status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = { worklog: { userId } };
    if (status) where.status = status;

    const [approvals, total] = await Promise.all([
      prisma.approval.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          worklog: {
            include: {
              user: { select: { id: true, email: true, firstName: true, lastName: true } },
              project: { select: { id: true, name: true } },
            },
          },
          reviewedBy: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.approval.count({ where }),
    ]);

    res.json({
      data: approvals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approvals' });
  }
};
