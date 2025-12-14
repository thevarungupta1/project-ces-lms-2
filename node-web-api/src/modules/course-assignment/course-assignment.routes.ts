import { Router } from 'express';
import { CourseAssignmentController } from './course-assignment.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createCourseAssignmentSchema,
  assignToGroupSchema,
  updateAssignmentProgressSchema,
} from '../../schemas/courseAssignment.schema';

const router = Router();
const courseAssignmentController = new CourseAssignmentController();

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createCourseAssignmentSchema),
  courseAssignmentController.createAssignment
);

router.post(
  '/group/:courseId/:groupId',
  authenticate,
  authorize('admin', 'educator'),
  validate(assignToGroupSchema),
  courseAssignmentController.assignToGroup
);

router.get('/', authenticate, courseAssignmentController.getAssignments);
router.get('/:id', authenticate, courseAssignmentController.getAssignment);

router.put(
  '/:id/progress',
  authenticate,
  validate(updateAssignmentProgressSchema),
  courseAssignmentController.updateProgress
);

router.put('/:id', authenticate, authorize('admin', 'educator'), courseAssignmentController.updateAssignment);
router.delete('/:id', authenticate, authorize('admin', 'educator'), courseAssignmentController.deleteAssignment);

export default router;

