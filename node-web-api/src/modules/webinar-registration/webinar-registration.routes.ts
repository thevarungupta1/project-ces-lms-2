import { Router } from 'express';
import { WebinarRegistrationController } from './webinar-registration.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createWebinarRegistrationSchema,
  updateAttendanceSchema,
} from '../../schemas/webinarRegistration.schema';

const router = Router();
const webinarRegistrationController = new WebinarRegistrationController();

// Protected routes
router.post(
  '/',
  authenticate,
  validate(createWebinarRegistrationSchema),
  webinarRegistrationController.register
);

router.get('/', authenticate, webinarRegistrationController.getRegistrations);
router.get('/:id', authenticate, webinarRegistrationController.getRegistration);

router.put(
  '/:id/attendance',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateAttendanceSchema),
  webinarRegistrationController.updateAttendance
);

router.delete('/:id', authenticate, webinarRegistrationController.cancelRegistration);

export default router;

