import { Router } from 'express';
import { CourseModuleController } from './course-module.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCourseModuleSchema,
  updateCourseModuleSchema,
  getCourseModuleSchema,
} from '../../schemas/courseModule.schema';

const router = Router();
const courseModuleController = new CourseModuleController();

// Public routes
router.get('/course/:courseId', courseModuleController.getModulesByCourse);
router.get('/:id', validate(getCourseModuleSchema), courseModuleController.getModule);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createCourseModuleSchema),
  courseModuleController.createModule
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateCourseModuleSchema),
  courseModuleController.updateModule
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(getCourseModuleSchema),
  courseModuleController.deleteModule
);

export default router;

