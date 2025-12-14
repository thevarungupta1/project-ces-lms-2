import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticate, authorize } from '../../core/middleware/auth';
import { validate } from '../../core/middleware/validation';
import {
  createNotificationSchema,
  markAsReadSchema,
} from '../../schemas/notification.schema';

const router = Router();
const notificationController = new NotificationController();

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'educator'),
  validate(createNotificationSchema),
  notificationController.createNotification
);

router.get('/me', authenticate, notificationController.getMyNotifications);
router.get('/me/unread', authenticate, notificationController.getUnreadNotifications);
router.get('/me/unread-count', authenticate, notificationController.getUnreadCount);

router.get('/:id', authenticate, notificationController.getNotification);
router.put('/:id/read', authenticate, validate(markAsReadSchema), notificationController.markAsRead);
router.put('/me/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/:id', authenticate, notificationController.deleteNotification);

export default router;

