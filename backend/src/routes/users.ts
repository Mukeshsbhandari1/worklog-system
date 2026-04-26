import { Router } from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  getUserStats,
} from '../controllers/users';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('ADMIN'), listUsers);
router.post('/', requireRole('ADMIN'), createUser);
router.patch('/:id', requireRole('ADMIN'), updateUser);
router.get('/:id/stats', getUserStats);

export default router;
