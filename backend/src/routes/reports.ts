import { Router } from 'express';
import {
  getReportData,
  getUserReport,
  getProjectReport,
  getDashboardStats,
} from '../controllers/reports';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Advanced report with powerful filtering
router.get('/advanced', requireRole('ADMIN', 'PM'), getReportData);

// User-specific report
router.get('/user/:userId', getUserReport);

// Project-specific report
router.get('/project/:projectId', requireRole('ADMIN', 'PM'), getProjectReport);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

export default router;
