import { Router } from 'express';
import { CourseController } from './course.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCourseSchema,
  updateCourseSchema,
  getCourseSchema,
  getCoursesSchema,
} from '../../schemas/course.schema';

const router = Router();
const courseController = new CourseController();

// Public routes
router.get('/', validate(getCoursesSchema), courseController.getCourses);
router.get('/:id', validate(getCourseSchema), courseController.getCourse);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createCourseSchema),
  courseController.createCourse
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateCourseSchema),
  courseController.updateCourse
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(getCourseSchema),
  courseController.deleteCourse
);

export default router;

