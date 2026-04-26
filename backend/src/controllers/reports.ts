import { Response } from 'express';
import { prisma } from '../utils/db';

/**
 * Advanced reporting with powerful filtering:
 * - Filter by Project(s), User/Member(s), Date Range, Role, Billable status, Tags
 * - Return detailed breakdowns per user, per project, per task
 * - Include totals and comparisons
 */

export const getReportData = async (req: any, res: Response) => {
  try {
    const {
      projectIds = [],
      userIds = [],
      startDate,
      endDate,
      roles = [],
      billableOnly = false,
      tags = [],
      page = 1,
      limit = 100,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Parse array parameters
    const parsedProjectIds = Array.isArray(projectIds) ? projectIds : (projectIds ? [projectIds] : []);
    const parsedUserIds = Array.isArray(userIds) ? userIds : (userIds ? [userIds] : []);
    const parsedRoles = Array.isArray(roles) ? roles : (roles ? [roles] : []);
    const parsedTags = Array.isArray(tags) ? tags : (tags ? [tags] : []);

    // Build where clause
    const where: any = { status: 'APPROVED' };

    if (parsedProjectIds.length > 0) {
      where.projectId = { in: parsedProjectIds };
    }

    if (parsedUserIds.length > 0) {
      where.userId = { in: parsedUserIds };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    if (billableOnly === 'true') {
      where.billable = true;
    }

    if (parsedTags.length > 0) {
      where.tags = { hasSome: parsedTags };
    }

    // If roles are specified, filter by user role
    let userConstraint: any = undefined;
    if (parsedRoles.length > 0) {
      userConstraint = {
        role: { in: parsedRoles },
      };
    }

    // Fetch work logs
    let workLogs = await prisma.workLog.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, role: true } },
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Filter by user role if needed
    if (userConstraint) {
      workLogs = workLogs.filter((log) => {
        return parsedRoles.includes(log.user.role);
      });
    }

    // Calculate aggregates
    const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);
    const billableHours = workLogs.filter((log) => log.billable).reduce((sum, log) => sum + log.hours, 0);
    const nonBillableHours = workLogs.filter((log) => !log.billable).reduce((sum, log) => sum + log.hours, 0);

    // Group by user
    const byUser: Record<string, any> = {};
    workLogs.forEach((log) => {
      if (!byUser[log.userId]) {
        byUser[log.userId] = {
          userId: log.userId,
          userName: `${log.user.firstName} ${log.user.lastName}`,
          email: log.user.email,
          role: log.user.role,
          totalHours: 0,
          billableHours: 0,
          nonBillableHours: 0,
          logCount: 0,
        };
      }
      byUser[log.userId].totalHours += log.hours;
      if (log.billable) byUser[log.userId].billableHours += log.hours;
      else byUser[log.userId].nonBillableHours += log.hours;
      byUser[log.userId].logCount += 1;
    });

    // Group by project
    const byProject: Record<string, any> = {};
    workLogs.forEach((log) => {
      if (!byProject[log.projectId]) {
        byProject[log.projectId] = {
          projectId: log.projectId,
          projectName: log.project.name,
          totalHours: 0,
          billableHours: 0,
          nonBillableHours: 0,
          logCount: 0,
        };
      }
      byProject[log.projectId].totalHours += log.hours;
      if (log.billable) byProject[log.projectId].billableHours += log.hours;
      else byProject[log.projectId].nonBillableHours += log.hours;
      byProject[log.projectId].logCount += 1;
    });

    // Group by task
    const byTask: Record<string, any> = {};
    workLogs.forEach((log) => {
      if (log.task) {
        const taskId = log.taskId ?? 'unknown-task';
        if (!byTask[taskId]) {
          byTask[taskId] = {
            taskId,
            taskTitle: log.task.title,
            projectName: log.project.name,
            totalHours: 0,
            logCount: 0,
          };
        }
        byTask[taskId].totalHours += log.hours;
        byTask[taskId].logCount += 1;
      }
    });

    // Paginate detailed logs
    const paginatedLogs = workLogs.slice(skip, skip + parseInt(limit));

    res.json({
      summary: {
        totalHours,
        billableHours,
        nonBillableHours,
        logCount: workLogs.length,
      },
      byUser: Object.values(byUser),
      byProject: Object.values(byProject),
      byTask: Object.values(byTask),
      logs: paginatedLogs,
      pagination: {
        total: workLogs.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(workLogs.length / parseInt(limit)),
      },
    });
  } catch (error: any) {
    console.error('Report error:', error);
    res.status(500).json({ message: 'Failed to generate report', error: error.message });
  }
};

export const getUserReport = async (req: any, res: Response) => {
  try {
    const { userId, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const where: any = { userId, status: 'APPROVED' };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const workLogs = await prisma.workLog.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { date: 'desc' },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Group by project
    const byProject: Record<string, any> = {};
    workLogs.forEach((log) => {
      if (!byProject[log.projectId]) {
        byProject[log.projectId] = {
          projectId: log.projectId,
          projectName: log.project.name,
          totalHours: 0,
          billableHours: 0,
          logs: [],
        };
      }
      byProject[log.projectId].totalHours += log.hours;
      if (log.billable) byProject[log.projectId].billableHours += log.hours;
      byProject[log.projectId].logs.push(log);
    });

    const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);
    const billableHours = workLogs.filter((log) => log.billable).reduce((sum, log) => sum + log.hours, 0);

    res.json({
      user: {
        id: user?.id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
      summary: {
        totalHours,
        billableHours,
        nonBillableHours: totalHours - billableHours,
        logCount: workLogs.length,
      },
      byProject: Object.values(byProject),
      logs: workLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate user report' });
  }
};

export const getProjectReport = async (req: any, res: Response) => {
  try {
    const { projectId, startDate, endDate } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'projectId is required' });
    }

    const where: any = { projectId, status: 'APPROVED' };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    const workLogs = await prisma.workLog.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { date: 'desc' },
    });

    const project = await prisma.project.findUnique({ where: { id: projectId } });

    // Group by user
    const byUser: Record<string, any> = {};
    workLogs.forEach((log) => {
      if (!byUser[log.userId]) {
        byUser[log.userId] = {
          userId: log.userId,
          userName: `${log.user.firstName} ${log.user.lastName}`,
          totalHours: 0,
          billableHours: 0,
          logs: [],
        };
      }
      byUser[log.userId].totalHours += log.hours;
      if (log.billable) byUser[log.userId].billableHours += log.hours;
      byUser[log.userId].logs.push(log);
    });

    const totalHours = workLogs.reduce((sum, log) => sum + log.hours, 0);
    const billableHours = workLogs.filter((log) => log.billable).reduce((sum, log) => sum + log.hours, 0);

    res.json({
      project: {
        id: project?.id,
        name: project?.name,
        budget: project?.budget,
      },
      summary: {
        totalHours,
        billableHours,
        nonBillableHours: totalHours - billableHours,
        logCount: workLogs.length,
      },
      byUser: Object.values(byUser),
      logs: workLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate project report' });
  }
};

// Dashboard stats
export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // Get today's hours
    const todayLogs = await prisma.workLog.findMany({
      where: { userId, date: { gte: today }, status: 'APPROVED' },
    });
    const todayHours = todayLogs.reduce((sum, log) => sum + log.hours, 0);

    // Get week's hours
    const weekLogs = await prisma.workLog.findMany({
      where: { userId, date: { gte: weekStart }, status: 'APPROVED' },
    });
    const weekHours = weekLogs.reduce((sum, log) => sum + log.hours, 0);

    // Get pending approvals
    const pendingApprovals = await prisma.approval.count({
      where: { worklog: { userId }, status: 'PENDING' },
    });

    // Get recent worklogs
    const recentLogs = await prisma.workLog.findMany({
      where: { userId },
      include: {
        project: { select: { id: true, name: true } },
        task: { select: { id: true, title: true } },
        approval: true,
      },
      take: 5,
      orderBy: { date: 'desc' },
    });

    res.json({
      todayHours,
      weekHours,
      pendingApprovals,
      recentLogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
