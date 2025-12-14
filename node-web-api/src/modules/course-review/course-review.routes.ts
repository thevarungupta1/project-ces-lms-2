import { Router } from 'express';
import { CourseReviewController } from './course-review.controller';
import { authenticate } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCourseReviewSchema,
  updateCourseReviewSchema,
} from '../../schemas/courseReview.schema';

const router = Router();
const courseReviewController = new CourseReviewController();

// Public routes
router.get('/course/:courseId', courseReviewController.getReviewsByCourse);
router.get('/course/:courseId/average', courseReviewController.getAverageRating);
router.get('/:id', courseReviewController.getReview);

// Protected routes
router.post(
  '/',
  authenticate,
  validate(createCourseReviewSchema),
  courseReviewController.createReview
);

router.put(
  '/:id',
  authenticate,
  validate(updateCourseReviewSchema),
  courseReviewController.updateReview
);

router.delete(
  '/:id',
  authenticate,
  courseReviewController.deleteReview
);

export default router;

