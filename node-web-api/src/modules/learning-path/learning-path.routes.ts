import { Router } from 'express';
import { LearningPathController } from './learning-path.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createLearningPathSchema,
  updateLearningPathSchema,
} from '../../schemas/learningPath.schema';

const router = Router();
const learningPathController = new LearningPathController();

// Public routes
router.get('/', learningPathController.getLearningPaths);
router.get('/:id', learningPathController.getLearningPath);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createLearningPathSchema),
  learningPathController.createLearningPath
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateLearningPathSchema),
  learningPathController.updateLearningPath
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  learningPathController.deleteLearningPath
);

export default router;

