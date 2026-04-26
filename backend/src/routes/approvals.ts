import { Router } from 'express';
import {
  getPendingApprovals,
  approveWorkLog,
  rejectWorkLog,
  getApprovalsByUser,
} from '../controllers/approvals';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('ADMIN', 'PM'), getPendingApprovals);
router.post('/:id/approve', requireRole('ADMIN', 'PM'), approveWorkLog);
router.post('/:id/reject', requireRole('ADMIN', 'PM'), rejectWorkLog);
router.get('/user/:userId', getApprovalsByUser);

export default router;
