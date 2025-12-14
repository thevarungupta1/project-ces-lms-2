import { Router } from 'express';
import { AnnouncementController } from './announcement.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from '../../schemas/announcement.schema';

const router = Router();
const announcementController = new AnnouncementController();

// Public routes
router.get('/', announcementController.getAnnouncements);
router.get('/active', announcementController.getActiveAnnouncements);
router.get('/:id', announcementController.getAnnouncement);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'educator'),
  announcementController.deleteAnnouncement
);

export default router;

