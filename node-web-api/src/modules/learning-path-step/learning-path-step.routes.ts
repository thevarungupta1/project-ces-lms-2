import { Router } from 'express';
import { LearningPathStepController } from './learning-path-step.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createLearningPathStepSchema,
  updateLearningPathStepSchema,
} from '../../schemas/learningPathStep.schema';

const router = Router();
const learningPathStepController = new LearningPathStepController();

// Public routes
router.get('/learning-path/:learningPathId', learningPathStepController.getStepsByLearningPath);
router.get('/:id', learningPathStepController.getStep);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createLearningPathStepSchema),
  learningPathStepController.createStep
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateLearningPathStepSchema),
  learningPathStepController.updateStep
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  learningPathStepController.deleteStep
);

export default router;

