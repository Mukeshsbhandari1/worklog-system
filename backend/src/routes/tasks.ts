import { Router } from 'express';
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', listTasks);
router.post('/', requireRole('ADMIN', 'PM'), createTask);
router.patch('/:id', requireRole('ADMIN', 'PM'), updateTask);
router.delete('/:id', requireRole('ADMIN', 'PM'), deleteTask);

export default router;
