import { Router } from 'express';
import { GroupController } from './group.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createGroupSchema,
  updateGroupSchema,
} from '../../schemas/group.schema';

const router = Router();
const groupController = new GroupController();

// Public routes
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroup);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createGroupSchema),
  groupController.createGroup
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateGroupSchema),
  groupController.updateGroup
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  groupController.deleteGroup
);

router.post(
  '/:id/members/:memberId',
  authenticate,
  authorize('admin', 'educator'),
  groupController.addMember
);

router.delete(
  '/:id/members/:memberId',
  authenticate,
  authorize('admin', 'educator'),
  groupController.removeMember
);

export default router;

