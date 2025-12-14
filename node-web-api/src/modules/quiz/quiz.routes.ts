import { Router } from 'express';
import { QuizController } from './quiz.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createQuizSchema,
  updateQuizSchema,
  getQuizSchema,
} from '../../schemas/quiz.schema';

const router = Router();
const quizController = new QuizController();

// Public routes
router.get('/', quizController.getQuizzes);
router.get('/:id', validate(getQuizSchema), quizController.getQuiz);
router.get('/course/:courseId', quizController.getQuizzesByCourse);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createQuizSchema),
  quizController.createQuiz
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateQuizSchema),
  quizController.updateQuiz
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(getQuizSchema),
  quizController.deleteQuiz
);

export default router;

