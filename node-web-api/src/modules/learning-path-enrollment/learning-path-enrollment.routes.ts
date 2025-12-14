import { Router } from 'express';
import { LearningPathEnrollmentController } from './learning-path-enrollment.controller';
import { authenticate } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createLearningPathEnrollmentSchema,
  updateProgressSchema,
} from '../../schemas/learningPathEnrollment.schema';

const router = Router();
const learningPathEnrollmentController = new LearningPathEnrollmentController();

// Protected routes
router.post(
  '/',
  authenticate,
  validate(createLearningPathEnrollmentSchema),
  learningPathEnrollmentController.enroll
);

router.get('/', authenticate, learningPathEnrollmentController.getEnrollments);
router.get('/:id', authenticate, learningPathEnrollmentController.getEnrollment);

router.put(
  '/:id/progress',
  authenticate,
  validate(updateProgressSchema),
  learningPathEnrollmentController.updateProgress
);

router.delete('/:id', authenticate, learningPathEnrollmentController.deleteEnrollment);

export default router;

