import { Router } from 'express';
import { QuizAssignmentController } from './quiz-assignment.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createQuizAssignmentSchema,
  assignQuizToGroupSchema,
  submitQuizSchema,
} from '../../schemas/quizAssignment.schema';

const router = Router();
const quizAssignmentController = new QuizAssignmentController();

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createQuizAssignmentSchema),
  quizAssignmentController.createAssignment
);

router.post(
  '/group/:quizId/:groupId',
  authenticate,
  authorize('admin', 'educator'),
  validate(assignQuizToGroupSchema),
  quizAssignmentController.assignToGroup
);

router.get('/', authenticate, quizAssignmentController.getAssignments);
router.get('/:id', authenticate, quizAssignmentController.getAssignment);

router.post(
  '/:id/submit',
  authenticate,
  validate(submitQuizSchema),
  quizAssignmentController.submitQuiz
);

router.put('/:id', authenticate, authorize('admin', 'educator'), quizAssignmentController.updateAssignment);
router.delete('/:id', authenticate, authorize('admin', 'educator'), quizAssignmentController.deleteAssignment);

export default router;

