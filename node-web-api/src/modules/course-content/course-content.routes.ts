import { Router } from 'express';
import { CourseContentController } from './course-content.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCourseContentSchema,
  updateCourseContentSchema,
  getCourseContentSchema,
} from '../../schemas/courseContent.schema';

const router = Router();
const courseContentController = new CourseContentController();

// Public routes
router.get('/module/:moduleId', courseContentController.getContentByModule);
router.get('/:id', validate(getCourseContentSchema), courseContentController.getContent);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createCourseContentSchema),
  courseContentController.createContent
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateCourseContentSchema),
  courseContentController.updateContent
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(getCourseContentSchema),
  courseContentController.deleteContent
);

export default router;

