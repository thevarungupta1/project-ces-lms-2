import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  deleteUserSchema,
  getUsersSchema,
} from '../../schemas/user.schema';

const router = Router();
const userController = new UserController();

// Public routes
router.get('/profile', authenticate, userController.getProfile);

// Protected routes - Admin only
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createUserSchema),
  userController.createUser
);

router.get(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(getUsersSchema),
  userController.getUsers
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(getUserSchema),
  userController.getUser
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(deleteUserSchema),
  userController.deleteUser
);

export default router;

