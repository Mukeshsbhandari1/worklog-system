import { Router } from 'express';
import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  addProjectMember,
  removeProjectMember,
} from '../controllers/projects';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', listProjects);
router.post('/', requireRole('ADMIN', 'PM'), createProject);
router.get('/:id', getProject);
router.patch('/:id', requireRole('ADMIN', 'PM'), updateProject);
router.post('/:id/members', requireRole('ADMIN', 'PM'), addProjectMember);
router.delete('/:id/members/:memberId', requireRole('ADMIN', 'PM'), removeProjectMember);

export default router;
