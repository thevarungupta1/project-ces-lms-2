import { Router } from 'express';
import { WebinarController } from './webinar.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createWebinarSchema,
  updateWebinarSchema,
} from '../../schemas/webinar.schema';

const router = Router();
const webinarController = new WebinarController();

// Public routes
router.get('/', webinarController.getWebinars);
router.get('/upcoming', webinarController.getUpcomingWebinars);
router.get('/:id', webinarController.getWebinar);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createWebinarSchema),
  webinarController.createWebinar
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateWebinarSchema),
  webinarController.updateWebinar
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  webinarController.deleteWebinar
);

export default router;

