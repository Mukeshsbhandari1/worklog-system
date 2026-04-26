import { Router } from 'express';
import {
  listWorkLogs,
  createWorkLog,
  getWorkLog,
  updateWorkLog,
  deleteWorkLog,
  submitWorkLog,
  getMyWorkLogs,
} from '../controllers/worklogs';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', listWorkLogs);
router.post('/', createWorkLog);
router.get('/my/list', getMyWorkLogs);
router.get('/:id', getWorkLog);
router.patch('/:id', updateWorkLog);
router.delete('/:id', deleteWorkLog);
router.post('/:id/submit', submitWorkLog);

export default router;
